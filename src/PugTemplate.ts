import { StructureVisitor } from './StructureVisitor'
import { ComponentSpec } from './specification'
import { Block, TemplateParamGroup, TemplatePhase } from './types'

export class PugTemplate {

  constructor(
    public readonly name:      string,
    public readonly fps:       number,
    public readonly width:     number,
    public readonly height:    number,
    public readonly params:    TemplateParamGroup[],
    public readonly structure: Block,
  ) {}

  public get flatParams() {
    return this.params.flatMap(it => it.params)
  }

  public resolve(): [ComponentSpec, TemplatePhase[]] {
    const visitor = new StructureVisitor()
    const root = visitor.walk(this.structure)
    root.width = this.width
    root.height = this.height
    
    const phases = visitor.phases
    if (phases.length === 0) {
      phases.push({
        name:       'main',
        animations: [],
      })
    }
    return [root, phases]
  }

}