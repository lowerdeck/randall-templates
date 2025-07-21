import { isPlainObject } from 'ytil'

import { GeneratorHook } from './types'

export interface SceneSpec {
  width:  number
  height: number
  fps:    number

  root:        ComponentSpec
  transitions: Transition[]
  overrides:   Override[]
  hooks:       GeneratorHook[]
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
  align?:   'left' | 'center' | 'right'
  justify?: 'top' | 'middle' | 'bottom'

  box_style?: Record<string, any>
}

export interface HStackSpec extends ContainerSpecCommon {
  type: ComponentType.HStack

  padding?: number
  gap?:     number
  align?:   'top' | 'middle' | 'bottom' | 'stretch'
  justify?: 'left' | 'center' | 'right'

  box_style?: Record<string, any>
}

export interface ImageSpec extends ComponentSpecCommon {
  type:       ComponentType.Image
  image:      Buffer
  objectFit?: 'scale' | 'cover' | 'contain'
  mask?:      'rectangle' | 'circle'
  box_style?: Record<string, any>
}

export interface RectangleSpec extends ComponentSpecCommon {
  type: ComponentType.Rectangle
}

export interface TextSpec extends ComponentSpecCommon {
  type:        ComponentType.Text
  max_width?:  number
  max_height?: number
  text:        string
  box_style?:  Record<string, any>
}

//------
// Common props

export interface ContainerSpecCommon extends ComponentSpecCommon {
  children?: ComponentSpec[]
}

export interface ComponentSpecCommon extends ComponentLayoutSpec {
  id?:    string
  style?: Record<string, any>
}

export interface ComponentLayoutSpec {
  inset?:  number
  left?:   number | Constraint
  right?:  number | Constraint
  top?:    number | Constraint
  bottom?: number | Constraint
  
  offset?:  [number, number]
  offsetX?: number
  offsetY?: number

  width?:  number
  height?: number

  flex?:       number | [number, number, number | 'auto']
  flexGrow?:   number
  flexShrink?: number
  flexBasis?:  number | 'auto'

  padding?:       number
  paddingLeft?:   number
  paddingRight?:  number
  paddingTop?:    number
  paddingBottom?: number
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