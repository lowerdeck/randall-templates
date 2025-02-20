import { EnumUtil, isPlainObject, objectKeys, objectValues, sparse, splitArray } from 'ytil'
import { ComponentSpec, ComponentType, Transition } from './specification'
import { GeneratorHook, GeneratorHookType } from './types/index'
import { AstNode, Block, Conditional, Mixin, Tag, Text } from './types/pug'

export class StructureVisitor {

  constructor(
    private readonly vars: Record<string, any> = {},
  ) {}

  private readonly mixins: Record<string, Mixin> = {}
  public readonly hooks:   GeneratorHook[] = []
  public readonly phases:  Transition[][] = []

  public walk(node: Block): ComponentSpec {
    const root = this.visit(node) as ComponentSpec[]
    return {
      type:     ComponentType.Group,
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
    const allowedTypes = EnumUtil.values(GeneratorHookType)
    if (tag.attrs.length !== 1 || !allowedTypes.includes(tag.attrs[0].name as GeneratorHookType)) {
      throw new Error(`${tag.line}: Invalid hook tag: ${tag.attrs[0].name}. Allowed values: ${allowedTypes.join(', ')}`)
    }

    const type = tag.attrs[0].name as GeneratorHookType
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
    
    if (tag.block.nodes.some(it => it.type !== 'Tag' || it.name !== 'transition')) {
      throw new Error(`${tag.line}: phase() block must only contain transition tags`)
    }

    const transitions = tag.block.nodes.map(it => this.visit_Transition(it as Tag)) as Transition[]
    this.phases.push(transitions)
    return null
  }

  protected visit_Transition(tag: Tag) {
    const attrs = this.extractTagAttrs(tag)
    if (attrs.target == null) {
      throw new Error(`${tag.line}: ${tag.line}: phase() requires a target attribute`)
    }
    if (typeof attrs.target !== 'string') {
      throw new Error(`${tag.line}: Invalid phase target: ${attrs.name}`)
    }

    return attrs as Transition
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

const CONTAINER_TYPES = [ComponentType.Group, ComponentType.VBox, ComponentType.HBox]
const CONTAINER_KEYS = ['children']
const COMPONENT_KEYS = {
  [ComponentType.Group]:     [],
  [ComponentType.VBox]:      ['padding', 'gap', 'align', 'justify', 'box_style'],
  [ComponentType.HBox]:      ['padding', 'gap', 'align', 'justify', 'box_style'],
  [ComponentType.Image]:     ['image', 'objectFit', 'mask', 'box_style'],
  [ComponentType.Text]:      ['text', 'style', 'box_style'],
  [ComponentType.Rectangle]: ['box_style'],
}
const PHASE_KEYS = ['name']
const TRANSITION_KEYS = ['target', 'easing', 'duration', 'from', 'to']