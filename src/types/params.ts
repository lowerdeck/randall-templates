

export * from './pug'

export type TemplateParameter =
  | TextParameter
  | ImageParameter
  | NumberParameter
  | BooleanParameter
  | SelectParameter
  | ObjectParameter

export interface TemplateParameterCommon<T> {
  name:     string
  caption:  string
  optional: boolean
  default?: T
}

export interface TextParameter extends TemplateParameterCommon<string> {
  type: 'text'
  min_length?: number
  max_length?: number
  multiline: boolean
}

export interface ImageParameter extends TemplateParameterCommon<string> {
  type: 'image'
}

export interface NumberParameter extends TemplateParameterCommon<string> {
  type: 'number'
  int: boolean
  min?: number
  max?: number
}

export interface BooleanParameter extends TemplateParameterCommon<string> {
  type: 'boolean'
  yes_caption?: string
  no_caption?: string
}

export interface SelectParameter extends TemplateParameterCommon<string> {
  type: 'select'
  choices: SelectParameterChoice[] | WellKnownSelectParameterChoices
}

export type SelectParameterChoice = string | {value: string | number, label: string}
export enum WellKnownSelectParameterChoices {
  Outlet = '$outlet'
}

export interface ObjectParameter extends TemplateParameterCommon<string> {
  type: 'object'
  fields: TemplateParameter[]
}

