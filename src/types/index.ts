import { Block } from './pug'

export interface TemplateConfig {
  name:   string
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