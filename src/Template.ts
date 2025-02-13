import { isPlainObject } from 'ytil'
import { PhaseVisitor } from './PhaseVisitor'
import { StructureVisitor } from './StructureVisitor'
import { Component, GeneratorSpec, Transition } from './specification'
import { TemplateConfig, TemplateParameter, TemplatePhase, TemplateStructure } from './types'
import { AstNode } from './types/pug'

export class Template {

  constructor(
    public readonly id:   string,
    public readonly config: TemplateConfig,
    public readonly params: TemplateParameter[],
    public readonly structure: TemplateStructure,
    public readonly phases: TemplatePhase,
  ) {}

  public build(name: string, vars: Record<string, any>): GeneratorSpec[] {
    const specifications: GeneratorSpec[] = []

    const root = this.resolveRoot(vars)
    const phases = this.resolvePhases(vars)

    for (const [index, transitions] of phases.entries()) {
      specifications.push({
        name: `${name} F${index + 1}`,
        
        fps: this.config.fps,
    
        width:  this.config.width,
        height: this.config.height,
      
        root:        root,
        transitions: transitions,
      })
    }

    return specifications
  }

  private resolveRoot(vars: Record<string, any>): Component {
    const visitor = new StructureVisitor(vars)
    return visitor.walk(this.structure)
  }

  private resolvePhases(vars: Record<string, any>): Transition[][] {
    const visitor = new PhaseVisitor(vars)
    return visitor.walk(this.phases)
  }

  public serialize(): TemplateSerialized {
    return {
      id:        this.id,
      config:    this.config,
      variables: this.params,
      structure: this.structure,
      phases:    this.phases,
    }
  }

}

export interface TemplateSerialized {
  id:        string
  config:    TemplateConfig
  variables: TemplateParameter[]
  structure: AstNode
  phases:    AstNode
}

export interface InlineAsset {
  filename: string
  bytes:    Uint8Array
}

export const InlineAsset = {
  isInlineAsset(value: any): value is InlineAsset {
    if (!isPlainObject(value)) { return false }
    if (!('filename' in value) || typeof value.filename !== 'string') { return false }
    if (!('bytes' in value) || !(value.bytes instanceof Uint8Array)) { return false }
    return true
  },
}