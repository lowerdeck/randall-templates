import { BuildDelegate } from './Template'
import { Transition } from './specification'
import { AstNode, Block } from './types/pug'

export class PhaseVisitor {

  constructor(
    private readonly delegate: BuildDelegate,
  ) {}

  public walk(node: Block): Transition[][] {
    return this.visit(node) as Transition[][]
  }

  private visit(node: AstNode): any {
    const methodName = `visit_${node.type}` as const
    if (!(methodName in this)) {
      throw new Error(`Unknown node type: ${node.type}`)
    }

    const method = (this as any)[methodName]
    return method.call(this, node)
  }

  protected visit_Block(_block: Block): Transition[][] {
    return [[]]
  }


}