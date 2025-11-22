import { Image } from './Image'

export interface SceneSpec {
  width:  number
  height: number
  fps:    number

  root:       ComponentSpec
  animations: Animation[]
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
}

export interface HStackSpec extends ContainerSpecCommon {
  type: ComponentType.HStack
}

export interface ImageSpec extends ComponentSpecCommon {
  type:          ComponentType.Image
  src:           Image | string
  aspect_ratio?: number
  resize_mode?: 'cover' | 'contain' | 'stretch'
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

export interface ComponentSpecCommon extends ComponentLayoutSpec, TransitionableSpec {
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

  flex?:       number
  flex_grow?:   number
  flex_shrink?: number
  flex_basis?:  number | 'auto'

  gap?:     number
  align?:   FlexAlign
  justify?: FlexJustify

  padding?:        number
  padding_x?:      number
  padding_y?:      number
  padding_left?:   number
  padding_right?:  number
  padding_top?:    number
  padding_bottom?: number

  transform_origin?: [number, number]
}

export interface TransitionableSpec {
  opacity?:     number // 0 - 1
  scale?:       number // 0 - 1
  rotate?:      number // degrees
  translate_x?: number // pixels
  translate_y?: number // pixels
}

export type FlexAlign = 'start' | 'center' | 'end' | 'stretch'
export type FlexJustify = 'start' | 'center' | 'end' | 'space-between'

//------
// Transitions

export type Animation = Transition | Override | Effect

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

export type Effect = TypingEffect

export interface TypingEffect {
  type:      'effect',
  name:      'typing'
  component: string
  duration:  number
}