import { Override, Transition } from '../specification'
import { Block } from './pug'

export * from './pug'

export interface TemplateConfig {
  fps:    number
  width:  number
  height: number
}

export interface TemplateParameter<T = any> {
  name:         string
  caption:      string
  type:         TemplateVariableType
  min?:         number
  max?:         number
  optional?:    boolean
  yes_caption?: string
  no_caption?:  string
  default?:     T
}

export enum TemplateVariableType {
  Image = 'image',
  Text = 'text',
  Multiline = 'multiline',
  Number = 'number',
  Boolean = 'boolean',
  Outlet = 'outlet',
}

export type TemplateStructure = Block

export interface TemplatePhase {
  name:        string
  transitions: Transition[]
  overrides:   Override[]
}

export interface GeneratorHook {
  type:   GeneratorHookType
  source: string
}

export enum GeneratorHookType {
  BeforeLayout = 'before-layout',
  AfterLayout = 'after-layout',
  AfterDraw = 'after-draw'
}