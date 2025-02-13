import { EvalAstFactory, parse } from 'jexpr'
import { EnumUtil, sparse, splitArray } from 'ytil'
import { BuildDelegate } from './Template'
import { Component, ComponentType } from './specification'
import { AstNode, Block, Conditional, Mixin, Tag } from './types/pug'

export class StructureVisitor {

  constructor(
    private readonly delegate: BuildDelegate,
  ) {}

  private mixins: Record<string, Mixin> = {}

  public walk(node: Block): Component {
    return this.visit(node) as Component
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

  protected visit_Block(block: Block): Component {
    // First visit all mixins.
    const [mixins, rest] = splitArray(block.nodes, it => it.type === 'Mixin' && !it.call)
    mixins.forEach(it => this.visit(it))

    // Then visit the rest.
    return {
      type:     ComponentType.Group,
      children: sparse(rest.map(it => this.visit(it))),
    }
  }

  protected visit_Tag(tag: Tag): Component {
    const type = tag.name as ComponentType
    if (!EnumUtil.values(ComponentType).includes(type)) {
      throw new Error(`Unknown tag: ${type}`)
    }

    const {id, ...attrs} = this.extractTagAttrs(type, tag)
    return {
      type,
      id,
      ...attrs,
      children: sparse(tag.block.nodes.map(it => this.visit(it))),
    } as Component
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
      throw new Error(`Unknown mixin: ${node.name}`)
    }

    // TODO: Arguments?
    return this.visit(mixin.block)
  }

  protected visit_MixinDeclaration(mixin: Mixin) {
    this.mixins[mixin.name] = mixin
  }

  protected visit_Conditional(conditional: Conditional) {
    const matches = this.evaluateExpression(conditional.test)
    if (!matches) { return null }

    return this.visit(conditional.consequent)
  }

  // #region Attributes

  private extractTagAttrs(type: ComponentType, tag: Tag): any {
    const attrs: Record<string, any> = {}
    for (const name of this.attrNames(type)) {
      const attr = tag.attrs.find(it => it.name)
      if (attr == null) { continue }
      
      attrs[name] = this.transformAttr(type, name, attr.val)
    }
    return attrs
  }

  private transformAttr(_type: ComponentType, _name: string, value: any) {
    if (typeof value !== 'string') { return null }
    
    return this.evaluateExpression(value)
  }

  private attrNames(type: ComponentType) {
    return sparse([
      ...COMMON_KEYS,
      ...CONTAINER_TYPES.includes(type) ? CONTAINER_KEYS : [],
      ...COMPONENT_KEYS[type] ?? [],
    ])
  }

  // #endregion

  // #region Expressions

  private evaluateExpression(value: string) {
    const expression = parse(value, new EvalAstFactory())
    if (expression == null) {
      throw new Error(`Failed to parse expression: ${value}`)
    }
    return expression.evaluate(this.delegate.data)
  }

  // #endregion

}

const COMMON_KEYS = ['id']
const CONTAINER_TYPES = [ComponentType.Group, ComponentType.VBox, ComponentType.HBox]
const CONTAINER_KEYS = ['children']
const COMPONENT_KEYS = {
  [ComponentType.Group]:     [],
  [ComponentType.VBox]:      ['padding', 'gap', 'align', 'justify', 'box_style'],
  [ComponentType.HBox]:      ['padding', 'gap', 'align', 'justify', 'box_style'],
  [ComponentType.Image]:     ['file', 'objectFit', 'mask', 'box_style'],
  [ComponentType.Text]:      ['text', 'style', 'box_style'],
  [ComponentType.Rectangle]: ['box_style'],
}