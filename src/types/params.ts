import { isPlainObject, safeParseFloat } from 'ytil'

export * from './pug'

export interface TemplateParamGroup {
  group: string
  params: TemplateParam[]
}


export type TemplateParam =
  | TextParameter
  | ImageParameter
  | NumberParameter
  | BooleanParameter
  | SelectParameter

export interface TemplateParamCommon<T> {
  name:     string
  caption:  string
  optional: boolean
  default?: T
}

export interface TextParameter extends TemplateParamCommon<string> {
  type: 'text'
  min_length?: number
  max_length?: number
  regexp?: string
  multiline: boolean
}

export interface ImageParameter extends TemplateParamCommon<string> {
  type: 'image'
}

export interface NumberParameter extends TemplateParamCommon<string> {
  type: 'number'
  int: boolean
  min?: number
  max?: number
}

export interface BooleanParameter extends TemplateParamCommon<string> {
  type: 'boolean'
  yes_caption?: string
  no_caption?: string
}

export interface SelectParameter extends TemplateParamCommon<string> {
  type: 'select'
  choices: SelectParameterChoice[] | WellKnownSelectParameterChoices
}

export type SelectParameterChoice = string | {value: string | number, label: string}
export enum WellKnownSelectParameterChoices {
  Outlet = '$outlet'
}

export interface ObjectParameter extends TemplateParamCommon<string> {
  type: 'object'
  fields: TemplateParam[]
}

export function validateParamValue(param: TemplateParam, value: unknown) {
  switch (param.type) {
  case 'text': return validateTextParamValue(param, value)
  case 'image': return validateImageParamValue(param, value)
  case 'number': return validateNumberParamValue(param, value)
  case 'boolean': return validateBooleanParamValue(param, value)
  case 'select': return validateSelectParamValue(param, value)
  }
}

function validateTextParamValue(param: TextParameter, value: unknown) {
  if (typeof value !== 'string') { return false }
  
  if (param.min_length !== undefined && value.length < param.min_length) { return false }
  if (param.max_length !== undefined && value.length > param.max_length) { return false }
  if (param.regexp && !new RegExp(param.regexp).test(value)) { return false }
  
  return true
}

function validateImageParamValue(_param: ImageParameter, value: unknown) {
  if (value instanceof Uint8Array) { return true }
  if (typeof value === 'string' && IMAGE_URL_REGEXP.test(value)) { return true }
  return false
}

const IMAGE_URL_REGEXP = /^https?:\/\/.*\.(png|jpe?g|webp)(?:[?#].*)$/i

function validateNumberParamValue(param: NumberParameter, value: unknown) {
  const num = typeof value === 'string' ? safeParseFloat(value) : value
  if (typeof num !== 'number') { return false }
  
  if (param.int && !Number.isInteger(num)) { return false }
  if (param.min !== undefined && num < param.min) { return false }
  if (param.max !== undefined && num > param.max) { return false }
  
  return true
}

function validateBooleanParamValue(_param: BooleanParameter, value: unknown) {
  if (value === true || value === false) { return true }
  if (value === 1 || value === 0) { return true }
  if (typeof value === 'string' && ['yes', 'no'].includes(value.trim().toLowerCase())) {
    return true
  }
  return false
}

function validateSelectParamValue(param: SelectParameter, value: unknown) {
  if (typeof value !== 'string' && typeof value !== 'number') { return false }
  
  if (Array.isArray(param.choices)) {
    return param.choices.some(choice => {
      if (typeof choice === 'string') {
        return choice === value
      } else {
        return choice.value === value
      }
    })
  }
  
  // Handle WellKnownSelectParameterChoices if needed
  return true
}

function validateObjectParamValue(param: ObjectParameter, value: unknown) {
  if (!isPlainObject(value)) { return false }
  
  return param.fields.every(field => {
    const fieldValue = value[field.name]
    if (fieldValue === undefined && !field.optional) {
      return false
    }
    
    if (fieldValue !== undefined && !validateParamValue(field, fieldValue)) {
      return false
    }

    return true
  })
}