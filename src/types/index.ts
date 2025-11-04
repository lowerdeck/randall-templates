import { Animation, ZStackSpec } from '../specification'

export * from './params'

export interface TemplateConfig {
  fps:      number
  width:    number
  height:   number
  preview?: TemplatePreviewConfig
}

export type TemplateRoot = ZStackSpec

export interface TemplatePhase {
  name:       string
  animations: Animation[]
}

export interface TemplatePreviewConfig {
  background?: string
}