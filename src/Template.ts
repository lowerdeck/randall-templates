import { deepMapValues } from 'ytil'

import { ComponentSpec, ContainerSpec, SceneSpec } from './specification'
import { TemplateConfig, TemplateParameter, TemplatePhase, TemplateRoot } from './types'

export class Template {

  constructor(
    public readonly id:   string,
    public readonly root: TemplateRoot,
    public readonly phases: TemplatePhase[],
    public readonly params: TemplateParameter[],
    public readonly config: TemplateConfig,
  ) {}

  public build(vars: Record<string, any>): Array<[string, SceneSpec]> {
    const specifications: Array<[string, SceneSpec]> = []
    const interpolatedRoot = this.interpolateRoot(vars)

    const phases = [...this.phases]
    if (phases.length === 0) {
      phases.push({
        name:       'main',
        animations: [],
      })
    }

    for (const phase of phases) {
      specifications.push([
        phase.name,
        {
          fps: this.config.fps,
      
          width:  this.config.width,
          height: this.config.height,
        
          root:       interpolatedRoot,
          animations: phase.animations,
        },
      ])
    }

    return specifications
  }

  private interpolateRoot(vars: Record<string, any>): ComponentSpec {
    const visit = (component: ComponentSpec): ComponentSpec => {
      const {children, ...rest} = component as ContainerSpec
      if (children === undefined) {
        return this.interpolateVars(rest, vars)
      } else {
        const container = {
          ...this.interpolateVars(rest, vars),
        } as ContainerSpec
        container.children = children.map(visit)
        return container
      }
    }
    
    const root = visit(this.root)
    root.width = this.config.width
    root.height = this.config.height
    return root
  }

  private interpolateVars(component: ComponentSpec, vars: Record<string, any>) {
    return deepMapValues(component, (value, key) => {
      if (typeof value !== 'string') { return value }
      if (!value.startsWith('=')) { return value }
      return this.evaluateExpression(value, vars)
    })
  }

  private evaluateExpression(source: string, vars: Record<string, any>) {
    try {
      const fn = new Function('vars', `with (vars) { return (${source}); }`)
      return fn(vars)
    } catch (error) {
      if (error instanceof ReferenceError) { return null }
      throw new Error(`Error while evaluating expression \`${source}\`: ${error}`)
    }
  }

}

export interface TemplateSerialized {
  id:        string
  config:    TemplateConfig
  variables: TemplateParameter[]
  root:      ComponentSpec
  phases:    TemplatePhase[]
}