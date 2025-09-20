import { isPlainObject } from 'ytil'
import { RendererHook } from './types'

export interface SceneSpec {
  width:  number
  height: number
  fps:    number

  root:        ComponentSpec
  transitions: Transition[]
  overrides:   Override[]
  hooks:       RendererHook[]
}

export type ComponentSpec =
  | ImageSpec
  | RectangleSpec
  | TextSpec
  | ContainerSpec

export type ContainerSpec =
  | ZStackSpec
  | VStackSpec
  | HStackSpec

export enum ComponentType {
  Image = 'image',
  Rectangle = 'rectangle',
  Text = 'text',
  ZStack = 'zstack',
  VStack = 'vstack',
  HStack = 'hstack',
}

export interface ZStackSpec extends ContainerSpecCommon {
  type: ComponentType.ZStack
}

export interface VStackSpec extends ContainerSpecCommon {
  type: ComponentType.VStack

  padding?: number
  gap?:     number
  align?:   'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'space-between'
}

export interface HStackSpec extends ContainerSpecCommon {
  type: ComponentType.HStack

  padding?: number
  gap?:     number
  align?:   'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'space-between'
}

export interface ImageSpec extends ComponentSpecCommon {
  type:          ComponentType.Image
  src:           Uint8Array<ArrayBuffer> | string
  aspect_ratio?: number
  resize_mode?: 'cover' | 'contain' | 'stretch'
  mask?:        'ellipse' | 'rectangle'
}

export interface RectangleSpec extends ComponentSpecCommon {
  type: ComponentType.Rectangle
}

export interface TextSpec extends ComponentSpecCommon {
  type:        ComponentType.Text
  max_width?:  number
  max_height?: number
  text?:       string
}

//------
// Common props

export interface ContainerSpecCommon extends ComponentSpecCommon {
  children?: ComponentSpec[]
}

export interface ComponentSpecCommon extends ComponentLayoutSpec {
  id?:      string
  preview?: boolean
  style?:   Record<string, any>
}

export interface ComponentLayoutSpec {
  inset?:  number
  left?:   number
  right?:  number
  top?:    number
  bottom?: number
  
  width?:  number
  max_width?:  number
  min_width?:  number
  
  height?: number
  max_height?: number
  min_height?: number

  flex?:       number | [number, number, number | 'auto']
  flex_grow?:   number
  flex_shrink?: number
  flex_basis?:  number | 'auto'

  padding?:        number
  padding_x?:      number
  padding_y?:      number
  padding_left?:   number
  padding_right?:  number
  padding_top?:    number
  padding_bottom?: number
}

//------
// Layout

export interface Constraint {
  component:   string
  prop:        ConstraintProp
  offset?:     number
  multiplier?: number
}

export const Constraint = {
  is(value: number | string | null | undefined | Constraint): value is Constraint {
    return isPlainObject(value)
  },
}

export type ConstraintProp = 'left' | 'right' | 'top' | 'bottom'

//------
// Transitions

export interface Transition {
  component: string
  duration:  number
  easing:    'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'
  from:      Record<TransitionProp, number>
  to:        Record<TransitionProp, number>
}

export interface Override extends Record<TransitionProp, number> {
  component: string
}

export type TransitionProp =
  | 'opacity'
  | 'scale'
  | 'rotate'
  | 'translateX'
  | 'translateY'