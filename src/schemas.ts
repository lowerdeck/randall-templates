import { EnumUtil } from 'ytil'
import { z } from 'zod'
import { AnimProperty, Keyframe, Phase, WellKnownTimingFunction } from './specification'

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

  yes_label: z.string().max(64).optional(),
  no_label:  z.string().max(64).optional(),
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
  name: z.string().max(64),
  from: z.number(),
  to:   z.number(),
})

const keyframe: z.ZodType<Keyframe> = z.object({
  frame:  z.number(),
  value:  z.any(),
  timing: z.string().transform(parseTiming),
})

function parseTiming(raw: string): Keyframe['timing'] {
  if (EnumUtil.values(WellKnownTimingFunction).includes(raw as WellKnownTimingFunction)) {
    return raw as WellKnownTimingFunction
  }

  if (raw.startsWith('cubic-bezier(') && raw.endsWith(')')) {
    const content = raw.slice('cubic-bezier('.length, -1)
    const parts = content.split(',').map(part => part.trim())
    if (parts.length === 4) {
      const nums = parts.map(part => Number(part))
      if (nums.every(num => !isNaN(num))) {
        return nums as Keyframe['timing']
      }
    }
  }

  throw new Error(`Invalid timing: ${raw}`)
}

const track = z.object({
  component_uid: z.string(),
  prop:          z.enum(AnimProperty),
  keyframes:     z.array(keyframe),
})

const animations = z.object({
  phases: z.array(phase),
  tracks: z.array(track),
})

export const schemas = {
  params: z.array(paramGroup).default(() => []),
  paramGroup,
  param,
  animations,
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