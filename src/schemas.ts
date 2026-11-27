import { z } from 'zod'
import { AnimProperty, ComponentSpec, Keyframe, Phase, PhaseType, StaggerOrder, Still, TextUnit } from './specification'
import { INVALID_TIMING_MESSAGE, parseTiming } from './timing'

export enum ParamScope {
  Regular = 'regular',
  Internal = 'internal',
  External = 'external',
}

const paramResolver = z.object({
  name:    z.string(),
  options: z.record(z.string(), z.any()),
})

const paramCommon = {
  name:  z.string().max(64),
  label: z.string().max(512),
  scope: z.enum(ParamScope).default(ParamScope.Regular),
  
  resolvers: z.array(paramResolver).default([]),
  default:   z.any().optional(),

  optional: z.boolean().default(false),
}

const textParam = z.object({
  type: z.literal('text'),
  ...paramCommon,

  regexp:     z.string().optional(),
  min_length: z.int().nonnegative().optional(),
  max_length: z.int().nonnegative().optional(),
  multiline:  z.boolean().optional().default(false),
})

const imageParam = z.object({
  type: z.literal('image'),
  ...paramCommon,
})

const numberParam = z.object({
  type: z.literal('number'),
  ...paramCommon,

  min: z.number().optional(),
  max: z.number().optional(),
  int: z.boolean().optional().default(true),
})

const booleanParam = z.object({
  type: z.literal('boolean'),
  ...paramCommon,

  yes_label: z.string().min(1).max(64).nullable().default(null),
  no_label:  z.string().min(1).max(64).nullable().default(null),
})

const choiceParam = z.object({
  type:    z.literal('choice'),
  variant: z.enum(['select', 'buttons']).default('select'),
  ...paramCommon,

  choices: z.array(z.union([
    z.string(),
    z.object({
      value: z.union([z.string(), z.number()]),
      label: z.string().max(64),
    }),
  ])),
})

const param = z.discriminatedUnion('type', [
  textParam,
  imageParam,
  numberParam,
  booleanParam,
  choiceParam,
])

export const paramTypes = [
  'text',
  'image',
  'number', 
  'boolean',
  'choice',
] as const

const paramGroup = z.object({
  group:  z.string().max(64),
  params: z.array(param),
})

const phase: z.ZodType<Phase> = z.object({
  type: z.enum(PhaseType),
  name: z.string().max(64),
  from: z.number(),
  to:   z.number(),
})

const still: z.ZodType<Still> = z.object({
  name:  z.string().max(64),
  frame: z.number().int().min(0),
})

const timing = z.unknown().transform((raw, ctx) => {
  const parsed = parseTiming(raw)
  if (parsed != null) { return parsed }

  ctx.issues.push({code: 'custom', input: raw, message: `Invalid timing ${JSON.stringify(raw)}. ${INVALID_TIMING_MESSAGE}`})
  return z.NEVER
})

const keyframe: z.ZodType<Keyframe> = z.object({
  frame:  z.number(),
  value:  z.any(),
  timing: timing,
})

const track = z.object({
  component_id: z.string(),
  prop:         z.enum(AnimProperty),
  keyframes:    z.array(keyframe),
  stagger:      z.object({
    overlap: z.number().min(0),
    unit:    z.enum(TextUnit).optional(),
    order:   z.enum(StaggerOrder).optional(),
  }).optional(),
})

const widgetTrack = z.object({
  component_id: z.string(),
  animation:    z.string(),
  from:         z.number().int().min(0),
  to:           z.number().int().min(0),
})

const animations = z.object({
  phases:        z.array(phase),
  stills:        z.array(still).optional(),
  tracks:        z.array(track),
  widget_tracks: z.array(widgetTrack).optional(),
})

const version = z.object({
  params:     z.array(paramGroup),
  vars:       z.record(z.string().max(64), z.any()),
  components: z.array(z.any()) as z.ZodType<Array<ComponentSpec | null>>,
  animations: animations,
})

export const schemas = {
  params: z.array(paramGroup).default(() => []),
  paramGroup,
  param,
  animations,
  version,
}

export type Param =
  | TextParam
  | ImageParam
  | NumberParam
  | BooleanParam
  | ChoiceParam

export type TextParam = z.output<typeof textParam>
export type ImageParam = z.output<typeof imageParam>
export type NumberParam = z.output<typeof numberParam>
export type BooleanParam = z.output<typeof booleanParam>
export type ChoiceParam = z.output<typeof choiceParam>

export interface ParamGroup {
  group: string
  params: Param[]
}