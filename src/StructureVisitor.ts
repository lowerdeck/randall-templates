import { EnumUtil, isPlainObject, objectKeys, objectValues, sparse, splitArray } from 'ytil'
import { ComponentSpec, ComponentType, Override, Transition } from './specification'
import {
  AstNode,
  Block,
  Conditional,
  Mixin,
  RendererHook,
  RendererHookType,
  Tag,
  Text,
} from './types'
import { TemplatePhase } from './types/index'

export class StructureVisitor {

  constructor(
    private readonly vars: Record<string, any> = {},
  ) {}

  private readonly mixins: Record<string, Mixin> = {}
  public readonly hooks:   RendererHook[] = []
  public readonly phases:  TemplatePhase[] = []

  public walk(node: Block): ComponentSpec {
    return {
      type:     ComponentType.ZStack,
      children: this.visit(node) as ComponentSpec[],
    }

  }

  private visit(node: AstNode): any {
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
    if (tag.name === 'hook') {
      return this.visit_Hook(tag)
    }
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

  protected visit_Hook(tag: Tag) {
    const allowedTypes = EnumUtil.values(RendererHookType)
    if (tag.attrs.length !== 1 || !allowedTypes.includes(tag.attrs[0].name as RendererHookType)) {
      throw new Error(`${tag.line}: Invalid hook tag: ${tag.attrs[0].name}. Allowed values: ${allowedTypes.join(', ')}`)
    }

    const type = tag.attrs[0].name as RendererHookType
    const textNodes = tag.block.nodes.filter(it => it.type === 'Text') as Text[]
    const source = textNodes.map(it => it.val).join('')

    this.hooks.push({type, source})
    return null
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

    const isTransitionTag = (node: AstNode) => node.type === 'Tag' && node.name === 'transition'
    const isOverrideTag = (node: AstNode) => node.type === 'Tag' && node.name === 'override'
    if (tag.block.nodes.some(it => !isTransitionTag(it) && !isOverrideTag(it))) {
      throw new Error(`${tag.line}: phase() block must only contain \`transition\` or \`override\` tags`)
    }

    const {name} = attrs
    const transitions = tag.block.nodes.filter(it => (it as Tag).name === 'transition').map(it => this.visit_Transition(it as Tag)) as Transition[]
    const overrides = tag.block.nodes.filter(it => (it as Tag).name === 'override').map(it => this.visit_Override(it as Tag)) as Override[]
    this.phases.push({name, transitions, overrides})
    return null
  }

  protected visit_Transition(tag: Tag): Transition {
    const attrs = this.extractTagAttrs(tag)
    if (attrs.component == null) {
      throw new Error(`${tag.line}: ${tag.line}: transition() requires a component attribute`)
    }
    if (typeof attrs.component !== 'string') {
      throw new Error(`${tag.line}: Invalid phase component: ${attrs.name}`)
    }

    return attrs
  }

  protected visit_Override(tag: Tag): Override {
    const attrs = this.extractTagAttrs(tag)
    if (attrs.component == null) {
      throw new Error(`${tag.line}: ${tag.line}: override() requires a component attribute`)
    }
    if (typeof attrs.component !== 'string') {
      throw new Error(`${tag.line}: Invalid phase component: ${attrs.name}`)
    }

    return attrs
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
    } else if (tag.name === 'transition') {
      return TRANSITION_KEYS
    } else if (tag.name === 'override') {
      return OVERRIDE_KEYS
    } else {
      const type = tag.name as ComponentType
      return sparse([
        ...COMMON_KEYS,
        ...CONTAINER_TYPES.includes(type) ? CONTAINER_KEYS : [],
        ...COMPONENT_KEYS[type] ?? [],
      ])
    }
  }

  // #endregion

  // #region Expressions & scripts

  private evaluateExpression(node: AstNode, source: string) {
    try {
      const fn = new Function(...objectKeys(this.vars), `
        return (${source});
      `)
      return fn(...objectValues(this.vars))
    } catch (error) {
      throw new Error(`${node.line}: Error while parsing "${source}": ${error}`)
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
  'height',

  'offset',
  'offsetX',
  'offsetY',

  'flex',
  'flexGrow',
  'flexShrink',
  'flexBasis',
  
  'padding',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'paddingBottom',
]

const CONTAINER_TYPES = [ComponentType.ZStack, ComponentType.VStack, ComponentType.HStack]
const CONTAINER_KEYS = ['children']
const COMPONENT_KEYS = {
  [ComponentType.ZStack]:     [],
  [ComponentType.VStack]:      ['padding', 'gap', 'align', 'justify', 'box_style'],
  [ComponentType.HStack]:      ['padding', 'gap', 'align', 'justify', 'box_style'],
  [ComponentType.Image]:     ['image', 'objectFit', 'mask', 'box_style'],
  [ComponentType.Text]:      ['text', 'max_width', 'max_height', 'style', 'box_style'],
  [ComponentType.Rectangle]: ['box_style'],
}
const PHASE_KEYS = ['name']
const TRANSITION_KEYS = ['component', 'easing', 'duration', 'from', 'to']
const TRANSITION_PROPS = ['opacity', 'scale', 'rotate', 'translate_x', 'translate_y']
const OVERRIDE_KEYS = ['component', ...TRANSITION_PROPS]