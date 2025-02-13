import { BuildDelegate } from './Template'
import { Component } from './specification'
import { AstNode, Block } from './types/pug'

export class StructureVisitor {

  constructor(
    private readonly delegate: BuildDelegate,
  ) {}

  public walk(node: Block): Component {
    return this.visit(node) as Component
  }

  private visit(node: AstNode): any {
    const methodName = `visit_${node.type}` as const
    if (!(methodName in this)) {
      throw new Error(`Unknown node type: ${node.type}`)
    }

    const method = (this as any)[methodName]
    return method.call(this, node)
  }

  protected visit_Block(block: Block): Component {
    return {
      id:       '',
      type:     'group',
      children: block.nodes.map(it => this.visit(it)),
    }
  }

}