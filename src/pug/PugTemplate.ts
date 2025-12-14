import { ComponentSpec, PhaseSpec } from '../specification'
import { StructureVisitor } from './StructureVisitor'
import { Block } from './types'

export class PugTemplate {

  constructor(
    public readonly width:     number,
    public readonly height:    number,
    public readonly structure: Block,
  ) {}

  public resolve(): [ComponentSpec, PhaseSpec[]] {
    const visitor = new StructureVisitor()
    const root = visitor.walk(this.structure)
    root.width = this.width
    root.height = this.height
    
    const phases = visitor.phases
    if (phases.length === 0) {
      phases.push({
        name:    'main',
        effects: [],
      })
    }
    return [root, phases]
  }

}