import { isPlainObject } from 'ytil'
import { GeneratorHook } from './types'

export interface GeneratorSpec {
  name: string

  width:  number
  height: number
  fps:    number

  root:        Component
  transitions: Transition[]
  hooks:       GeneratorHook[]
}

export type Component =
  | Image
  | Rectangle
  | Text
  | Container

export type Container =
  | Group
  | VBox
  | HBox

export enum ComponentType {
  Image = 'image',
  Rectangle = 'rectangle',
  Text = 'text',
  Group = 'group',
  VBox = 'vbox',
  HBox = 'hbox',
}

export interface Group extends ContainerCommon {
  type: ComponentType.Group
}

export interface VBox extends ContainerCommon {
  type: ComponentType.VBox

  padding?: number
  gap?:     number
  align?:   'left' | 'center' | 'right'
  justify?: 'top' | 'middle' | 'bottom'

  box_style?: Record<string, any>
}

export interface HBox extends ContainerCommon {
  type: ComponentType.HBox

  padding?: number
  gap?:     number
  align?:   'top' | 'middle' | 'bottom' | 'stretch'
  justify?: 'left' | 'center' | 'right'

  box_style?: Record<string, any>
}

export interface Image extends ComponentCommon {
  type:       ComponentType.Image
  image:      Buffer
  objectFit?: 'scale' | 'cover' | 'contain'
  mask?:      'rectangle' | 'circle'
  box_style?: Record<string, any>
}

export interface Rectangle extends ComponentCommon {
  type: ComponentType.Rectangle
}

export interface Text extends ComponentCommon {
  type:       ComponentType.Text
  width?:     number
  text:       string
  box_style?: Record<string, any>
}

//------
// Common props

export interface ContainerCommon extends ComponentCommon {
  children?: Component[]
}

export interface ComponentCommon extends ComponentLayout {
  id?:    string
  style?: Record<string, any>
}

export interface ComponentLayout {
  inset?:  number
  left?:   number | ConstraintProp
  right?:  number | ConstraintProp
  top?:    number | ConstraintProp
  bottom?: number | ConstraintProp

  width?:  number
  height?: number

  offset?:  [number, number]
  offsetX?: number
  offsetY?: number

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

export interface ConstraintProp {
  component:   string
  relprop:     'left' | 'right' | 'top' | 'bottom'
  offset?:     number
  multiplier?: number
}

export const ConstraintProp = {
  is(value: number | string | null | ConstraintProp): value is ConstraintProp {
    return isPlainObject(value)
  },
}

//------
// Transitions

export interface Transition {
  component: string
  duration:  number
  easing:    'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'
  from:      Record<TransitionProp, number>
  to:        Record<TransitionProp, number>
}

export type TransitionProp =
  | 'opacity'
  | 'scale'
  | 'rotate'
  | 'translateX'
  | 'translateY'