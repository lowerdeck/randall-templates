import { Block } from './pug'

export interface TemplateConfig {
  fps:    number
  width:  number
  height: number
}

export interface TemplateParameter<T = any> {
  name:         string
  caption:      string
  type:         TemplateVariableType
  yes_caption?: string
  no_caption?:  string
  default?:     T
}

export enum TemplateVariableType {
  Image = 'image',
  Text = 'text',
  Multiline = 'multiline',
  Boolean = 'boolean',
  Outlet = 'outlet',
}

export type TemplateStructure = Block
export type TemplatePhase = Block

export interface GeneratorHook {
  type:   GeneratorHookType
  source: string
}

export enum GeneratorHookType {
  BeforeLayout = 'before-layout',
  AfterLayout = 'after-layout',
  AfterDraw = 'after-draw'
}