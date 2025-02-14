import { isPlainObject } from 'ytil'
import { StructureVisitor } from './StructureVisitor'
import { Component, GeneratorSpec, Transition } from './specification'
import { GeneratorHook, TemplateConfig, TemplateParameter, TemplateStructure } from './types'
import { AstNode } from './types/pug'

export class Template {

  constructor(
    public readonly id:   string,
    public readonly config: TemplateConfig,
    public readonly params: TemplateParameter[],
    public readonly structure: TemplateStructure
  ) {}

  public build(name: string, vars: Record<string, any>): GeneratorSpec[] {
    const specifications: GeneratorSpec[] = []

    const [root, hooks, phases] = this.resolveStructure(vars)

    for (const [index, transitions] of phases.entries()) {
      specifications.push({
        name: `${name} F${index + 1}`,
        
        fps: this.config.fps,
    
        width:  this.config.width,
        height: this.config.height,
      
        root:        root,
        transitions: transitions,
        hooks:       hooks,
      })
    }

    return specifications
  }

  private resolveStructure(vars: Record<string, any>): [Component, GeneratorHook[], Transition[][]] {
    const visitor = new StructureVisitor(vars)
    const root = visitor.walk(this.structure)
    const hooks = visitor.hooks
    return [root, hooks, [[]]]
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