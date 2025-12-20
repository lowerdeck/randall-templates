import { isPlainObject } from 'ytil'

export interface SceneSpec {
  width:  number
  height: number
  fps:    number

  root:    ZStackSpec
  effects: EffectSpec[]
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

export type ContainerType =
  | ComponentType.ZStack
  | ComponentType.VStack
  | ComponentType.HStack
  | ComponentType.Image

export function isContainerType(type: ComponentType): type is ContainerType {
  if (type === ComponentType.ZStack) { return true }
  if (type === ComponentType.VStack) { return true }
  if (type === ComponentType.HStack) { return true }
  if (type === ComponentType.Image) { return true }
  return false
}

export function isZStackContainerType(type: ComponentType): type is ComponentType.ZStack {
  if (type === ComponentType.ZStack) { return true }
  if (type === ComponentType.Image) { return true }
  return false
}

export function isContainer(spec: ComponentSpec): spec is ContainerSpec {
  return isContainerType(spec.$type)
}

export function isZStackContainer(spec: ComponentSpec): spec is ZStackSpec {
  return isZStackContainerType(spec.$type)
}

export interface StackSpecCommon extends ContainerSpecCommon {
  align?:      Attribute<FlexAlign>
  justify?:    Attribute<FlexJustify>
  gap?:        Attribute<number>
}

export interface ZStackSpec extends ContainerSpecCommon {
  $type: ComponentType.ZStack
}

export interface VStackSpec extends StackSpecCommon {
  $type: ComponentType.VStack
}

export interface HStackSpec extends StackSpecCommon {
  $type: ComponentType.HStack
}

export interface ImageSpec extends ContainerSpecCommon {
  $type:         ComponentType.Image
  image:         TemplateImage | string | null
  aspect_ratio?: number
  resize_mode?: 'cover' | 'contain' | 'stretch'

  // These are only for resize_mode 'cover'.
  image_placement?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  image_offset?: [number, number]
}

export interface TemplateImage {
  type: string
  binary: Uint8Array<ArrayBuffer>
}

export interface RectangleSpec extends ComponentSpecCommon {
  $type: ComponentType.Rectangle
}

export interface TextSpec extends ComponentSpecCommon {
  $type: ComponentType.Text
  text:  string | null
}

//------
// Common props

export type Attribute<T> = T | {$: string}

export namespace Attribute {

  export function isDynamic(value: any): value is {$: string} {
    if (!isPlainObject(value)) { return false }
    return typeof value.$ === 'string'
  }

}

export interface ContainerSpecCommon extends ComponentSpecCommon {
  children: ComponentSpec[]
}

export interface ComponentSpecCommon extends ComponentLayoutSpec, TransitionableSpec {
  id:    string
  style: Record<string, any>

  $if?: string
}

export interface ComponentLayoutSpec {
  inset?:  Attribute<number>
  left?:   Attribute<number>
  right?:  Attribute<number>
  top?:    Attribute<number>
  bottom?: Attribute<number>
  
  width?:  Attribute<number>
  max_width?:  Attribute<number>
  min_width?:  Attribute<number>
  
  height?: Attribute<number>
  max_height?: Attribute<number>
  min_height?: Attribute<number>

  flex?:       Attribute<number>
  flex_grow?:   Attribute<number>
  flex_shrink?: Attribute<number>
  flex_basis?:  Attribute<number | 'auto'>

  align_self?: Attribute<FlexAlign>

  padding?:        Attribute<number>
  padding_x?:      Attribute<number>
  padding_y?:      Attribute<number>
  padding_left?:   Attribute<number>
  padding_right?:  Attribute<number>
  padding_top?:    Attribute<number>
  padding_bottom?: Attribute<number>

  transform_origin?: Attribute<[number, number]>
}

export interface TransitionableSpec {
  opacity?:     Attribute<number> // 0 - 1
  scale?:       Attribute<number> // 0 - 1
  rotate?:      Attribute<number> // degrees
  translate_x?: Attribute<number> // pixels
  translate_y?: Attribute<number> // pixels
}

export enum FlexAlign {
  Start = 'start',
  Center = 'center',
  End = 'end',
  Stretch = 'stretch',
}

export enum FlexJustify {
  Start = 'start',
  Center = 'center',
  End = 'end',
  SpaceBetween = 'space-between',
}

export function emptyComponent(type: ContainerType, id: string): ContainerSpec
export function emptyComponent(type: ComponentType, id: string): ComponentSpec
export function emptyComponent(type: ComponentType, id: string): ComponentSpec {
  switch (type) {
  case ComponentType.ZStack:
    return {$type: ComponentType.ZStack, id, style: {}, children: []}
  case ComponentType.HStack:
    return {$type: ComponentType.HStack, id, style: {}, children: []}
  case ComponentType.VStack:
    return {$type: ComponentType.VStack, id, style: {}, children: []}
  case ComponentType.Text:
    return {$type: ComponentType.Text, id, style: {}, text: null}
  case ComponentType.Image:
    return {$type: ComponentType.Image, id, style: {}, image: null, children: []}
  case ComponentType.Rectangle:
    return {$type: ComponentType.Rectangle, id, style: {}}
  default:
    throw new Error(`Unknown component type: ${type}`)
  }
}

//------
// Phases


export interface PhaseSpec {
  name:    string
  effects: EffectSpec[]
}

export type EffectSpec = TransitionSpec | OverrideSpec | CustomEffectSpec

export interface TransitionSpec {
  component: string
  duration:  number
  easing:    'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'
  from:      Record<TransitionProp, number>
  to:        Record<TransitionProp, number>
}

export interface OverrideSpec extends Record<TransitionProp, number> {
  component: string
}

export type TransitionProp =
  | 'opacity'
  | 'scale'
  | 'rotate'
  | 'translateX'
  | 'translateY'

export type CustomEffectSpec = TypingEffect

export interface TypingEffect {
  type:      'effect',
  name:      'typing'
  component: string
  duration:  number
}