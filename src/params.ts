import { z } from 'zod'

// #region Types

export interface TemplateParamGroup {
  group: string
  params: TemplateParam[]
}

export type TemplateParam =
  | TemplateTextParam
  | TemplateImageParam
  | TemplateNumberParam
  | TemplateBooleanParam
  | TemplateChoiceParam

export interface TemplateParamCommon<T> {
  name:     string
  caption:  string
  optional: boolean
  default?: T
  resolve: boolean
}

export interface TemplateTextParam extends TemplateParamCommon<string> {
  type: 'text'
  min_length?: number
  max_length?: number
  pattern?: string
  multiline: boolean
}

export interface TemplateImageParam extends TemplateParamCommon<string> {
  type: 'image'
}

export interface TemplateNumberParam extends TemplateParamCommon<string> {
  type: 'number'
  int: boolean
  min?: number
  max?: number
}

export interface TemplateBooleanParam extends TemplateParamCommon<string> {
  type: 'boolean'
  yes_caption?: string
  no_caption?: string
}

export interface TemplateChoiceParam extends TemplateParamCommon<string> {
  type: 'choice'
  choices: ParameterChoice[]
  variant: 'select' | 'buttons'
}

export type ParameterChoice = string | {value: string | number, label: string}

// #endregion

// #region Defaults

export function paramDefault(param: TemplateParam) {
  if (param.default !== undefined) {
    return param.default
  }

  switch (param.type) {
  case 'text': return ''
  case 'boolean': return false
  default: return null
  }
}

// #endregion

// #region Validation

export function paramSchema(param: TemplateParam): z.ZodType {
  switch (param.type) {
  case 'text': return textParamSchema(param)
  case 'image': return imageParamSchema(param)
  case 'number': return numberParamSchema(param)
  case 'boolean': return booleanParamSchema(param)
  case 'choice': return choiceParamSchema(param)
  }
}

function textParamSchema(param: TemplateTextParam): z.ZodType {
  let type = z.string()
  if (param.min_length != null) {
    type = type.min(param.min_length)
  }
  if (param.max_length != null) {
    type = type.max(param.max_length)
  }
  if (param.pattern != null) {
    type = type.regex(new RegExp(param.pattern))
  }

  return type
}
const IMAGE_URL_REGEXP = /^https?:\/\/.*\.(png|jpe?g|webp)(?:[?#].*)$/i

function safeParseFloat(value: string): number | null {
  const num = parseFloat(value)
  return isNaN(num) ? null : num
}

function imageParamSchema(_param: TemplateImageParam): z.ZodType {
  return z.union([
    z.instanceof(Uint8Array),
    z.string().regex(IMAGE_URL_REGEXP),
  ])
}

function numberParamSchema(param: TemplateNumberParam): z.ZodType {
  let schema = z.union([
    z.number(),
    z.string().transform((val) => {
      const num = safeParseFloat(val)
      if (num === null) throw new Error('Invalid number')
      return num
    }),
  ])
  
  if (param.int) {
    schema = schema.refine((num) => Number.isInteger(num), {
      message: 'Must be an integer',
    })
  }
  
  if (param.min !== undefined) {
    schema = schema.refine((num) => num >= param.min!, {
      message: `Must be at least ${param.min}`,
    })
  }
  
  if (param.max !== undefined) {
    schema = schema.refine((num) => num <= param.max!, {
      message: `Must be at most ${param.max}`,
    })
  }
  
  return schema
}

function booleanParamSchema(_param: TemplateBooleanParam): z.ZodType {
  return z.union([
    z.boolean(),
    z.number().refine((val) => val === 0 || val === 1).transform((val) => val === 1),
    z.string().transform((val) => {
      const lower = val.trim().toLowerCase()
      if (lower === 'yes' || lower === 'true') return true
      if (lower === 'no' || lower === 'false') return false
      throw new Error('Invalid boolean value')
    }),
  ])
}

function choiceParamSchema(param: TemplateChoiceParam): z.ZodType {
  const validValues = param.choices.map(choice => 
    typeof choice === 'string' ? choice : choice.value,
  )
  
  return z.union([z.string(), z.number()]).refine((val) => 
    validValues.includes(val), {
    message: `Must be one of: ${validValues.join(', ')}`,
  },
  )
}
// #endregion