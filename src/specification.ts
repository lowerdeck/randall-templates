import { set } from 'lodash'
import { isPlainObject, objectEntries } from 'ytil'

export interface SceneSpec {
  width:  number
  height: number
  fps:    number

  root: ZStackSpec
  animations: AnimationsSpec
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
  | ImageSpec

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
  resize_mode?:  ResizeMode

  // These are only for resize_mode 'cover'.
  image_placement?: ImagePlacement
  image_offset?: [number, number]
}

export enum ResizeMode {
  Cover = 'cover',
  Contain = 'contain',
  Stretch = 'stretch'
}

export enum ImagePlacement {
  Center = 'center',
  Top = 'top',
  Bottom = 'bottom',
  Left = 'left',
  Right = 'right',
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
  children: Array<ComponentSpec | null>
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

  flex_basis?:  Attribute<FlexBasis>
  flex_grow?:   Attribute<number>
  flex_shrink?: Attribute<number>

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

export enum FlexBasis {
  Zero = 0,
  Auto = 'auto'
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

export function defaultComponent<C extends ComponentSpec>(type: C['$type'], id: string): C {
  const empty = emptyComponent(type, id)
  const defaults = getDefaultValuesForComponentType(type)
  for (const [path, value] of objectEntries(defaults)) {
    set(empty, path, value)
  }
  return empty
}

function emptyComponent<C extends ComponentSpec>(type: C['$type'], id: string): C {
  switch (type) {
  case ComponentType.ZStack:
    return {$type: ComponentType.ZStack, id, style: {}, children: []} as ZStackSpec as C
  case ComponentType.HStack:
    return {$type: ComponentType.HStack, id, style: {}, children: []} as HStackSpec as C
  case ComponentType.VStack:
    return {$type: ComponentType.VStack, id, style: {}, children: []} as VStackSpec as C
  case ComponentType.Text:
    return {$type: ComponentType.Text, id, style: {}, text: null} as TextSpec as C
  case ComponentType.Image:
    return {$type: ComponentType.Image, id, style: {}, image: null, children: []} as ImageSpec as C
  case ComponentType.Rectangle:
    return {$type: ComponentType.Rectangle, id, style: {}} as RectangleSpec as C
  default:
    throw new Error(`Unknown component type: ${type}`)
  }
}

const $componentDefaultsCommon: Record<string, unknown> = {
  'padding': 0,

  'flex_basis':  'auto',
  'flex_grow':   0,
  'flex_shrink': 0,

  'style.border_width':  0,
  'style.border_radius': 0,
  'style.shadow_blur':   0,
  'style.shadow_offset': [0, 0],
}

const $stackComponentDefaults: Record<string, unknown> = {
  ...$componentDefaultsCommon,

  'align':   'stretch',
  'justify': 'start',
  'gap':     0,
}

const $textComponentDefaults: Record<string, unknown> = {
  ...$componentDefaultsCommon,
  
  'style.color':       '#000000',
  'style.font_family': "Arial",
  'style.font_size':   32,
  'style.font_style':  'Regular',
}

const $imageComponentDefaults: Record<string, unknown> = {
  ...$componentDefaultsCommon,

  'aspect_ratio':    1,
  'resize_mode':     ResizeMode.Contain,
  'image_placement': 'center',
  'image_offset':    [0, 0],
}

export function getDefaultValuesForComponentType(type: ComponentType): Record<string, unknown> {
  switch (type) {
  case ComponentType.Text:
    return $textComponentDefaults
  case ComponentType.Image:
    return $imageComponentDefaults
  case ComponentType.HStack:
  case ComponentType.VStack:
    return $stackComponentDefaults
  default:
    return $componentDefaultsCommon
  }
}

//------
// Animations

export interface AnimationsSpec {
  /**
   * Phases are marked parts of the animation timeline that are outputted as different files.
   */
  phases: Phase[]
  tracks: ComponentTrack[]
}

export interface Phase {
  name: string
  from: number
  to: number
}

export interface ComponentTrack {
  component: string
  opacity: PropertyTrack
  scale: PropertyTrack
  rotate: PropertyTrack
  translate_x: PropertyTrack
  translate_y: PropertyTrack
}

export namespace ComponentTrack {
  export function empty(componentUid: string): ComponentTrack {
    return {
      component:   componentUid,
      opacity:     PropertyTrack.empty(),
      scale:       PropertyTrack.empty(),
      rotate:      PropertyTrack.empty(),
      translate_x: PropertyTrack.empty(),
      translate_y: PropertyTrack.empty(),
    }
  }
}

export interface PropertyTrack {
  keyframes: Keyframe[]
}

export namespace PropertyTrack {
  export function empty(): PropertyTrack {
    return {keyframes: []}
  }
}

export interface Keyframe {
  frame: number
  value: number
  timing: WellKnownTimingFunction | TimingBezier
}
export enum WellKnownTimingFunction {
  Linear = 'linear',

  EaseInQuad = 'ease-in-quad',
  EaseOutQuad = 'ease-out-quad',
  EaseInOutQuad = 'ease-in-out-quad',

  EaseInCubic = 'ease-in-cubic',
  EaseOutCubic = 'ease-out-cubic',
  EaseInOutCubic = 'ease-in-out-cubic',
}
export type TimingBezier = [number, number, number, number]

export interface EffectTrack {
  effects: Array<[start: number, effect: Effect]>
}

export type Effect = TypingEffect

export interface TypingEffect {
  type: 'typing'
}