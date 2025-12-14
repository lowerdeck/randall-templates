import { EffectSpec } from '../specification'

export * from './params'
export * from './pug'

export interface TemplatePreviewConfig {
  background?: string
}

export interface TemplatePhase {
  name:       string
  animations: EffectSpec[]
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