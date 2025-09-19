import { Override, Transition } from '../specification'
import { Block } from './pug'

export * from './params'
export * from './pug'

export interface TemplateConfig {
  fps:    number
  width:  number
  height: number
  preview?: TemplatePreviewConfig
}

export interface TemplatePreviewConfig {
  background?: string
}

export type TemplateStructure = Block

export interface TemplatePhase {
  name:        string
  transitions: Transition[]
  overrides:   Override[]
}

export interface RendererHook {
  type:   RendererHookType
  source: string
}

export enum RendererHookType {
  BeforeLayout = 'before-layout',
  AfterLayout = 'after-layout',
  AfterDraw = 'after-draw'
}