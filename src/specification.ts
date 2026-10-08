import { set } from 'lodash'
import { EnumUtil, isPlainObject, objectEntries } from 'ytil'
import { componentId } from './ids'

export interface SceneSpec {
  width:  number
  height: number
  fps:    number

  root: ZStackSpec
  animations: AnimationsSpec
}

export type ComponentSpec =
  | ImageSpec
  | VideoSpec
  | ShapeSpec
  | TextSpec
  | ContainerSpec

export type ContainerSpec =
  | ZStackSpec
  | VStackSpec
  | HStackSpec
  | ImageSpec
  | VideoSpec
  | ShapeSpec

export enum ComponentType {
  Image = 'image',
  Video = 'video',
  Shape = 'shape',
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
  | ComponentType.Video
  | ComponentType.Shape

export function isComponentSpec(arg: unknown): arg is ComponentSpec {
  if (!isPlainObject(arg)) { return false }
  if (!('$type' in arg)) { return false }
  if (!EnumUtil.is(ComponentType, arg.$type)) { return false }

  return true 
}

export function isContainerType(type: ComponentType): type is ContainerType {
  if (type === ComponentType.ZStack) { return true }
  if (type === ComponentType.VStack) { return true }
  if (type === ComponentType.HStack) { return true }
  if (type === ComponentType.Image) { return true }
  if (type === ComponentType.Video) { return true }
  if (type === ComponentType.Shape) { return true }
  return false
}

export function isZStackContainerType(type: ComponentType): type is ComponentType.ZStack {
  if (type === ComponentType.ZStack) { return true }
  if (type === ComponentType.Image) { return true }
  if (type === ComponentType.Video) { return true }
  if (type === ComponentType.Shape) { return true }
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
  image:         TemplateMedia | string | null
  aspect_ratio?: number
  resize_mode?:  ResizeMode

  // These are only for resize_mode 'cover'.
  image_placement?: ContentPlacement
  image_offset?: [number, number]
}

export interface VideoSpec extends ContainerSpecCommon {
  $type: ComponentType.Video,
  video: TemplateMedia | string | null
  aspect_ratio?: number
  resize_mode?: ResizeMode

  // These are only for resize_mode 'cover'.
  video_placement?: ContentPlacement
  video_offset?: [number, number]

  // Optionally the start and end times for the video if it needs to be trimmed.
  trim_start?: number
  trim_end?: number
}

export enum ResizeMode {
  Cover = 'cover',
  Contain = 'contain',
  Stretch = 'stretch'
}

export enum ContentPlacement {
  Center = 'center',
  Top = 'top',
  Bottom = 'bottom',
  Left = 'left',
  Right = 'right',
}

export interface TemplateMedia {
  type: string
  binary: Uint8Array<ArrayBuffer>
}

export namespace TemplateMedia {
  export function is(arg: any): arg is TemplateMedia {
    if (!isPlainObject(arg)) { return false }
    if (!('type' in arg) || typeof arg.type !== 'string') { return false }
    if (!('binary' in arg) || !(arg.binary instanceof Uint8Array)) { return false }
    return true
  }
}

export interface ShapeSpec extends ContainerSpecCommon {
  $type: ComponentType.Shape

  // SVG path data. Without a path, the shape is a (rounded) rectangle filling its bounds.
  path?: string | null

  // The coordinate space of the path, which is stretched to the bounds of the shape.
  view_box?: [number, number]

  // How the shape masks its children.
  mask_mode?: MaskMode
}

export enum MaskMode {
  // Children are clipped to the shape's outline.
  Clip = 'clip',

  // Children are masked by the alpha of the shape's background.
  Alpha = 'alpha',
}

export enum TextTransform {
  None = 'none',
  Uppercase = 'uppercase',
  Lowercase = 'lowercase',
  Capitalize = 'capitalize',
}

// How a component is blended onto what's beneath it, like CSS's mix-blend-mode.
export enum BlendMode {
  Normal = 'normal',
  Multiply = 'multiply',
  Screen = 'screen',
  Overlay = 'overlay',
  Darken = 'darken',
  Lighten = 'lighten',
  ColorDodge = 'color-dodge',
  ColorBurn = 'color-burn',
  HardLight = 'hard-light',
  SoftLight = 'soft-light',
  Difference = 'difference',
  Exclusion = 'exclusion',
  Hue = 'hue',
  Saturation = 'saturation',
  Color = 'color',
  Luminosity = 'luminosity',
}

export const defaultShapeViewBox: [number, number] = [100, 100]

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

export interface ComponentSpecCommon extends ComponentLayoutSpec {
  id:    string
  name:  string
  style: Record<string, any>

  $if?: string
}

export interface ComponentLayoutSpec {
  inset?:  Attribute<number>
  left?:   Attribute<number>
  right?:  Attribute<number>
  top?:    Attribute<number>
  bottom?: Attribute<number>
  
  width?:  Attribute<SizeValue>
  max_width?:  Attribute<SizeValue>
  min_width?:  Attribute<SizeValue>
  
  height?: Attribute<SizeValue>
  max_height?: Attribute<SizeValue>
  min_height?: Attribute<SizeValue>

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

  opacity?:     Attribute<number> // 0 - 1
  scale?:       Attribute<number> // 0 - 1
  rotate?:      Attribute<number> // degrees
  translate_x?: Attribute<number> // pixels
  translate_y?: Attribute<number> // pixels

  transform_origin?: Attribute<[number, number]>
}

export type SizeValue = number | `${number}%`

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

export function defaultComponent<C extends ComponentSpec>(type: C['$type'], name: string, id: string = componentId()): C {
  const empty = emptyComponent(type, id, name)
  const defaults = propertyDefaults(type)
  for (const [path, value] of objectEntries(defaults)) {
    set(empty, path, value)
  }
  return empty
}

function emptyComponent<C extends ComponentSpec>(type: C['$type'], id: string, name: string): C {
  switch (type) {
  case ComponentType.ZStack:
    return {$type: ComponentType.ZStack, id, name, style: {}, children: []} as ZStackSpec as C
  case ComponentType.HStack:
    return {$type: ComponentType.HStack, id, name, style: {}, children: []} as HStackSpec as C
  case ComponentType.VStack:
    return {$type: ComponentType.VStack, id, name, style: {}, children: []} as VStackSpec as C
  case ComponentType.Text:
    return {$type: ComponentType.Text, id, name, style: {}, text: null} as TextSpec as C
  case ComponentType.Image:
    return {$type: ComponentType.Image, id, name, style: {}, image: null, children: []} as ImageSpec as C
  case ComponentType.Video:
    return {$type: ComponentType.Video, id, name, style: {}, video: null, children: []} as VideoSpec as C
  case ComponentType.Shape:
    return {$type: ComponentType.Shape, id, name, style: {}, children: []} as ShapeSpec as C
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

  'style.inset_shadow_blur':   0,
  'style.inset_shadow_offset': [0, 0],

  'style.blur': 0,

  'style.blend_mode': BlendMode.Normal,

  'scale':       1,
  'rotate':      0,
  'translate_x': 0,
  'translate_y': 0,
  'opacity':     1,
}

const $stackComponentDefaults: Record<string, unknown> = {
  ...$componentDefaultsCommon,

  'align':   'stretch',
  'justify': 'start',
  'gap':     0,
}

const $shapeComponentDefaults: Record<string, unknown> = {
  ...$componentDefaultsCommon,

  'mask_mode': MaskMode.Clip,
}

const $textComponentDefaults: Record<string, unknown> = {
  ...$componentDefaultsCommon,
  
  'style.fill':           '#000000',
  'style.font_family':    "Arial",
  'style.font_size':      32,
  'style.font_subfamily': 'Regular',

  'style.text_stroke_width': 0,
  'style.text_transform':    TextTransform.None,
}

const $imageComponentDefaults: Record<string, unknown> = {
  ...$componentDefaultsCommon,

  'aspect_ratio':    1,
  'resize_mode':     ResizeMode.Contain,
  'image_placement': 'center',
  'image_offset':    [0, 0],
}

const $videoComponentDefaults: Record<string, unknown> = {
  ...$componentDefaultsCommon,

  'aspect_ratio':    1,
  'resize_mode':     ResizeMode.Contain,
  'video_placement': 'center',
  'video_offset':    [0, 0],
}

export function propertyDefaults(type: ComponentType): Record<string, unknown> {
  switch (type) {
  case ComponentType.Text:
    return $textComponentDefaults
  case ComponentType.Shape:
    return $shapeComponentDefaults
  case ComponentType.Image:
    return $imageComponentDefaults
  case ComponentType.Video:
    return $videoComponentDefaults
  case ComponentType.HStack:
  case ComponentType.VStack:
    return $stackComponentDefaults
  default:
    return $componentDefaultsCommon
  }
}

export function propertyDefault(type: ComponentType | undefined, prop: string): unknown {
  const defaults = type != null ? propertyDefaults(type) : $componentDefaultsCommon
  return defaults[prop]
}

//------
// Animations

export interface AnimationsSpec {
  /**
   * Phases are marked parts of the animation timeline that are outputted as different files.
   */
  phases: Phase[]
  tracks: Track[]
}

export interface Phase {
  type: PhaseType
  name: string
  from: number
  to: number
}

export enum PhaseType {
  BuildIn = 'build-in',
  Stable = 'stable',
  Transition = 'transition',
  BuildOut = 'build-out',
}

export interface Track {
  component_id: string
  prop: AnimProperty
  keyframes: Keyframe[]

  /**
   * Animates the children of a container, or the letters of a text, one after the other. Together, they fill the
   * keyframe span.
   */
  stagger?: Stagger
}

export interface Stagger {
  /** The number of frames by which consecutive items' animations overlap. */
  overlap: number
}

export enum AnimProperty {
  Scale = 'scale',
  Rotate = 'rotate',
  TranslateX = 'translate_x',
  TranslateY = 'translate_y',
  Opacity = 'opacity',
}

export function isAnimProperty(prop: string): prop is AnimProperty {
  return EnumUtil.values(AnimProperty).includes(prop as AnimProperty)
}

export namespace Track {
  export function empty(componentId: string, prop: AnimProperty): Track {
    return {
      component_id: componentId,
      prop:         prop,
      keyframes:    [],
    }
  }
}

export interface Keyframe {
  frame: number
  value: Attribute<number>
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
