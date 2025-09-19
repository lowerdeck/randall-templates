import { StructureVisitor } from './StructureVisitor'
import { ComponentSpec, Constraint, SceneSpec } from './specification'
import {
  RendererHook,
  TemplateConfig,
  TemplateParameter,
  TemplatePhase,
  TemplateStructure,
} from './types'
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

    const [root, hooks, phases] = this.resolveStructure(vars)

    for (const phase of phases) {
      specifications.push([
        phase.name,
        {
          fps: this.config.fps,
      
          width:  this.config.width,
          height: this.config.height,
        
          root:        root,
          transitions: phase.transitions,
          overrides:   phase.overrides,
          hooks:       hooks,
        },
      ])
    }

    return specifications
  }

  private resolveStructure(vars: Record<string, any>): [ComponentSpec, RendererHook[], TemplatePhase[]] {
    const visitor = new StructureVisitor({
      ...vars,
      ...this.helpers,
    })
    const root = visitor.walk(this.structure)
    root.width = this.config.width
    root.height = this.config.height
    
    const hooks = visitor.hooks
    const phases = visitor.phases
    if (phases.length === 0) {
      phases.push({name: 'main', transitions: [], overrides: []})
    }
    return [root, hooks, phases]
  }

  private helpers = {

    constraint: (
      component: string, 
      relprop: 'left' | 'right' | 'top' | 'bottom', 
      offset?: number, 
      multiplier?: number,
    ): Constraint => {
      return {component, prop: relprop, offset, multiplier}
    },


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