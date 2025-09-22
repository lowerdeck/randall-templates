import { StructureVisitor } from './StructureVisitor'
import { ComponentSpec, SceneSpec } from './specification'
import { TemplateConfig, TemplateParameter, TemplatePhase, TemplateStructure } from './types'
import { AstNode } from './types/pug'

export class Template {

  constructor(
    public readonly id:   string,
    public readonly config: TemplateConfig,
    public readonly params: TemplateParameter[],
    public readonly structure: TemplateStructure,
  ) {}

  public build(vars: Record<string, any>): Array<[string, SceneSpec]> {
    const specifications: Array<[string, SceneSpec]> = []

    const [root, phases] = this.resolveStructure(vars)

    for (const phase of phases) {
      specifications.push([
        phase.name,
        {
          fps: this.config.fps,
      
          width:  this.config.width,
          height: this.config.height,
        
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
    root.width = this.config.width
    root.height = this.config.height
    
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
      id:        this.id,
      config:    this.config,
      variables: this.params,
      structure: this.structure,
    }
  }

}

export interface TemplateSerialized {
  id:        string
  config:    TemplateConfig
  variables: TemplateParameter[]
  structure: AstNode
}