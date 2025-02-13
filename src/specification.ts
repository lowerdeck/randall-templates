import { isPlainObject } from 'ytil'

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

export interface Image extends ComponentCommon, BoxStyledComponent {
  type:       ComponentType.Image
  filename:   string
  file:       Buffer
  objectFit?: 'scale' | 'cover' | 'contain'
  mask?:      'rectangle' | 'circle'
}

export interface Rectangle extends ComponentCommon, StyledComponent {
  type: ComponentType.Rectangle
}

export interface Text extends ComponentCommon, StyledComponent, BoxStyledComponent {
  type:   ComponentType.Text
  width?: number
  text:   string
}

//------
// Common props

export interface ContainerCommon extends ComponentCommon {
  children?: Component[]
}

export interface ComponentCommon extends ComponentLayout {
  id?: string
}

export interface ComponentLayout {
  left?:   number | ConstraintProp
  right?:  number | ConstraintProp
  top?:    number | ConstraintProp
  bottom?: number | ConstraintProp

  width?:  number
  height?: number

  offest?:  [number, number]
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

export interface StyledComponent {
  style?: Record<string, any>
}

export interface BoxStyledComponent {
  box_style?: Record<string, any>
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
  is(value: number | string | ConstraintProp): value is ConstraintProp {
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