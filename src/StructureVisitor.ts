import { EnumUtil, isPlainObject, objectKeys, sparse, splitArray } from 'ytil'
import { Animation, ComponentSpec, ComponentType, Effect, Override } from './specification'
import { AstNode, Block, Conditional, Mixin, Tag, Text } from './types'
import { TemplatePhase } from './types/index'

export class StructureVisitor {

  constructor(
    private readonly vars: Record<string, any> = {},
  ) {}

  private readonly mixins: Record<string, Mixin> = {}
  public readonly phases:  TemplatePhase[] = []

  public walk(node: Block): ComponentSpec {
    return {
      type:     ComponentType.ZStack,
      children: this.visit(node) as ComponentSpec[],
    }

  }

  private visit(node: AstNode): any {
    // Skip comments.
    if (node.type === 'Text') { return }

    const methodName = `visit_${node.type}` as const
    if (!(methodName in this)) {
      console.warn(`Unknown node type: ${node.type}`)
      return
    }

    const method = (this as any)[methodName]
    return method.call(this, node)
  }

  protected visit_Block(block: Block): ComponentSpec[] {
    // First visit all mixins.
    const [mixins, rest] = splitArray(block.nodes, it => it.type === 'Mixin' && !it.call)
    mixins.forEach(it => this.visit(it))

    const components = rest.flatMap(it => this.visit(it) as ComponentSpec | ComponentSpec[] | null)
    return sparse(components)
  }

  protected visit_Tag(tag: Tag): ComponentSpec | null {
    if (tag.name === 'phase') {
      return this.visit_Phase(tag)
    }

    const type = tag.name as ComponentType
    if (!EnumUtil.values(ComponentType).includes(type)) {
      throw new Error(`${tag.line}: Unknown tag: ${type}`)
    }

    const {id, ...attrs} = this.extractTagAttrs(tag)
    const children = this.visit(tag.block)

    return {
      type,
      id,
      ...attrs,
      children,
    } as ComponentSpec
  }

  protected visit_Phase(tag: Tag) {
    const attrs = this.extractTagAttrs(tag)
    if (attrs.name == null) {
      throw new Error(`${tag.line}: ${tag.line}: phase() requires a name attribute`)
    }
    if (typeof attrs.name !== 'string') {
      throw new Error(`${tag.line}: Invalid phase name: ${attrs.name}`)
    }
    if (tag.block.nodes.length === 0) {
      throw new Error(`${tag.line}: phase() requires a block`)
    }

    const {name} = attrs
    const animations = tag.block.nodes.map(it => this.visit_Animation(it as Tag)) as Animation[]
    this.phases.push({name, animations})
    return null
  }

  protected visit_Animation(tag: Tag): Animation {
    switch (tag.name) {
    case 'transition': return this.visit_Transition(tag)
    case 'override': return this.visit_Override(tag)
    case 'effect': return this.visit_Effect(tag)
    default:
      throw new Error(`${tag.line}: Unknown animation: ${tag.name}`)
    }
  }

  protected visit_Transition(tag: Tag) {
    const attrs = this.extractTagAttrs(tag)
    if (attrs.component == null) {
      throw new Error(`${tag.line}: ${tag.line}: transition() requires a component attribute`)
    }
    if (typeof attrs.component !== 'string') {
      throw new Error(`${tag.line}: Invalid phase component: ${attrs.name}`)
    }

    return {
      type: 'transition',
      ...attrs,
    }
  }

  protected visit_Override(tag: Tag): Override {
    const attrs = this.extractTagAttrs(tag)
    if (attrs.component == null) {
      throw new Error(`${tag.line}: ${tag.line}: override() requires a component attribute`)
    }
    if (typeof attrs.component !== 'string') {
      throw new Error(`${tag.line}: Invalid phase component: ${attrs.name}`)
    }

    return {
      type: 'override',
      ...attrs,
    }
  }

  protected visit_Effect(tag: Tag): Effect {
    const attrs = this.extractTagAttrs(tag)
    if (attrs.name == null) {
      throw new Error(`${tag.line}: ${tag.line}: effect() requires a name attribute`)
    }
    if (typeof attrs.name !== 'string') {
      throw new Error(`${tag.line}: Invalid effect name: ${attrs.name}`)
    }

    if (attrs.component == null) {
      throw new Error(`${tag.line}: ${tag.line}: effect() requires a component attribute`)
    }
    if (typeof attrs.component !== 'string') {
      throw new Error(`${tag.line}: Invalid effect component: ${attrs.name}`)
    }

    switch (attrs.name) {
    case 'typing':
      return this.visit_TypingEffect(tag, attrs.component)
    default:
      throw new Error(`${tag.line}: Unknown effect: ${attrs.name}`)
    }
  }

  protected visit_TypingEffect(tag: Tag, component: string): Effect {
    const attrs = this.extractTagAttrs(tag)
    const duration = attrs.duration ?? 50
    if (typeof duration !== 'number' || duration <= 0) {
      throw new Error(`${tag.line}: Invalid typing duration: ${duration}`)
    }

    return {
      type: 'effect',
      name: 'typing',
      component,
      duration,
    }
  }

  protected visit_Mixin(mixin: Mixin) {
    if (mixin.call) {
      return this.visit_MixinCall(mixin)
    } else {
      return this.visit_MixinDeclaration(mixin)
    }
  }

  protected visit_MixinCall(node: Mixin) {
    const mixin = this.mixins[node.name]
    if (mixin == null) {
      throw new Error(`${node.line}: Unknown mixin: ${node.name}`)
    }

    // TODO: Arguments?
    return this.visit(mixin.block)
  }

  protected visit_MixinDeclaration(mixin: Mixin) {
    this.mixins[mixin.name] = mixin
  }

  protected visit_Conditional(conditional: Conditional) {
    const matches = this.evaluateExpression(conditional, conditional.test)
    if (matches) {
      return this.visit(conditional.consequent)
    } else if (conditional.alternate != null) {
      return this.visit(conditional.alternate)
    } else {
      return null
    }
  }

  // #region Attributes

  private extractTagAttrs(tag: Tag): any {
    const validNames = this.attrNames(tag)

    const result: Record<string, any> = {}
    for (const {name, val} of tag.attrs) {
      if (name.startsWith('...') && val === true) {
        // Spread attr, evaluate the variable and merge it into the result.
        const obj = this.evaluateExpression(tag, name.slice(3))
        if (!isPlainObject(obj)) {
          throw new Error(`${tag.line}: Invalid spread object: ${name}`)
        }

        Object.assign(result, obj)
      } else {
        result[name] = this.transformAttr(tag, val)
      }
    }

    // Remove unknown attribute values.
    for (const key of objectKeys(result)) {
      if (!validNames.includes(key)) {
        delete result[key]
      }
    }
    
    return result
  }

  private transformAttr(tag: Tag, value: any) {
    if (typeof value !== 'string') {
      return value
    } else {
      return this.evaluateExpression(tag, value)
    }
  }

  private attrNames(tag: Tag) {
    if (tag.name === 'phase') {
      return PHASE_KEYS
    } else if (['transition', 'override', 'effect'].includes(tag.name)) {
      return ANIMATION_KEYS[tag.name as keyof typeof ANIMATION_KEYS]
    } else {
      const type = tag.name as ComponentType
      return sparse([
        ...COMMON_KEYS,
        ...CONTAINER_TYPES.includes(type) ? CONTAINER_KEYS : [],
        ...PROPERTY_KEYS[type] ?? [],
      ])
    }
  }

  // #endregion

  // #region Expressions & scripts

  private evaluateExpression(node: AstNode, source: string) {
    try {
      const fn = new Function('vars', `with (vars) { return (${source}); }`)
      return fn(this.vars)
    } catch (error) {
      if (error instanceof ReferenceError) { return null }
      throw new Error(`${node.line}: Error while evaluating expression \`${source}\`: ${error}`)
    }
  }

  // #endregion

}

const COMMON_KEYS = [
  'id',
  'style',

  'inset',
  'left',
  'right',
  'top',
  'bottom',

  'width',
  'max_width',
  'min_width',

  'height',
  'max_height',
  'min_height',

  'aspect_ratio',

  'offset',
  'offset_x',
  'offset_y',

  'flex',
  'flex_grow',
  'flex_shrink',
  'flex_basis',
  
  'padding',
  'padding_x',
  'padding_y',
  'padding_left',
  'padding_right',
  'padding_top',
  'padding_bottom',
]

const CONTAINER_TYPES = [ComponentType.ZStack, ComponentType.VStack, ComponentType.HStack]
const CONTAINER_KEYS = ['children']
const PROPERTY_KEYS = {
  [ComponentType.ZStack]:    [],
  [ComponentType.VStack]:    ['gap', 'align', 'justify'],
  [ComponentType.HStack]:    ['gap', 'align', 'justify'],
  [ComponentType.Image]:     ['src', 'resize_mode'],
  [ComponentType.Text]:      ['text'],
  [ComponentType.Rectangle]: [],
}
const PHASE_KEYS = ['name']


const TRANSITION_PROPS = ['opacity', 'scale', 'rotate', 'translate_x', 'translate_y']

const ANIMATION_KEYS = {
  transition: ['component', 'easing', 'duration', 'from', 'to'],
  override:   ['component', ...TRANSITION_PROPS],
  effect:     ['name', 'component', 'duration'],
}