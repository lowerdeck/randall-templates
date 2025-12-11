import { Animation } from '../specification'
import { Block } from './pug'

export * from './params'
export * from './pug'

export interface TemplatePreviewConfig {
  background?: string
}

export type TemplateStructure = Block

export interface TemplatePhase {
  name:       string
  animations: Animation[]
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