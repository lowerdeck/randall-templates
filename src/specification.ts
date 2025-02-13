import { Vector } from './layout'

export interface GeneratorSpec {
  name: string

  width:  number
  height: number
  fps:    number

  root:        Component
  transitions: Transition[]
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

export interface Group extends ContainerCommon {
  type: 'group'
}

export interface VBox extends ContainerCommon {
  type: 'vbox'

  padding?: number
  gap?:     number
  align?:   'left' | 'center' | 'right'
  justify?: 'top' | 'middle' | 'bottom'

  box_style?: Record<string, any>
}

export interface HBox extends ContainerCommon {
  type: 'hbox'

  padding?: number
  gap?:     number
  align?:   'top' | 'middle' | 'bottom'
  justify?: 'left' | 'center' | 'right'

  box_style?: Record<string, any>
}

export interface Image extends ComponentCommon, BoxStyledComponent {
  type:       'image'
  filename:   string
  file:       Buffer
  objectFit?: 'scale' | 'cover' | 'contain'
  mask?:      'rectangle' | 'circle'
}

export interface Rectangle extends ComponentCommon, StyledComponent {
  type: 'rectangle'
}

export interface Text extends ComponentCommon, StyledComponent, BoxStyledComponent {
  type:   'text'
  width?: number
  text:   string
}

//------
// Common props

export interface ContainerCommon extends ComponentCommon {
  children?: Component[]
}

export interface ComponentCommon extends ComponentLayout {
  id:      string
  render?: 'preview-only' | 'generator-only' | 'both'
}

export interface ComponentLayout {
  origin?:      Vector
  constraints?: ComponentLayoutConstraint[]

  size?:    Vector
  width?:   number
  height?:  number
  flex?:    number | [number, number]
  padding?: number

  offset?: [number, number]
}

export interface StyledComponent {
  style?: Record<string, any>
}

export interface BoxStyledComponent {
  box_style?: Record<string, any>
}

//------
// Layout

export interface ComponentLayoutConstraint {
  component: string | string[]
  ownprop:   ConstraintProp
  relprop:   ConstraintProp
  offset?:   number
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

export type TransitionProp =
  | 'opacity'
  | 'scale'
  | 'rotate'
  | 'translateX'
  | 'translateY'