import { StructureVisitor } from './StructureVisitor'
import { ComponentSpec, SceneSpec } from './specification'
import { AstNode, TemplateParamGroup, TemplatePhase, TemplateStructure } from './types'

export class Template {

  constructor(
    public readonly name:      string,
    public readonly fps:       number,
    public readonly width:     number,
    public readonly height:    number,
    public readonly params:    TemplateParamGroup[],
    public readonly structure: TemplateStructure,
  ) {}

  public get flatParams() {
    return this.params.flatMap(it => it.params)
  }

  public build(vars: Record<string, any>): Array<[string, SceneSpec]> {
    const specifications: Array<[string, SceneSpec]> = []

    const [root, phases] = this.resolveStructure(vars)

    for (const phase of phases) {
      specifications.push([
        phase.name,
        {
          fps:    this.fps,
          width:  this.width,
          height: this.height,
        
          root:       root,
          animations: phase.animations,
        },
      ])
    }

    return specifications
  }

  private resolveStructure(vars: Record<string, any>): [ComponentSpec, TemplatePhase[]] {
    const visitor = new StructureVisitor({
      ...vars,
    })
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

  public serialize(): TemplateSerialized {
    return {
      fps:       this.fps,
      width:     this.width,
      height:    this.height,
      params:    this.params,
      structure: this.structure,
    }
  }

}

export interface TemplateSerialized {
  fps:       number
  width:     number
  height:    number
  params:    TemplateParamGroup[]
  structure: AstNode
}