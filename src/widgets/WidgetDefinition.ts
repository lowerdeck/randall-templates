import { paramDefault } from '../params'
import { ParamGroup } from '../schemas'

export interface WidgetDefinition {
  name:   string
  label:  string
  params: ParamGroup[]

  // Default props that aren't described by params, like lists.
  defaults?: Record<string, unknown>
}

export namespace WidgetDefinition {

  // The props of a new widget.
  export function defaultProps(definition: WidgetDefinition): Record<string, unknown> {
    return {...paramDefaults(definition), ...definition.defaults}
  }

  // Fills in param defaults for any props that are missing or null.
  export function resolveProps<P>(definition: WidgetDefinition, props: Record<string, unknown>): P {
    const resolved = paramDefaults(definition)
    for (const [name, value] of Object.entries(props)) {
      if (value != null) { resolved[name] = value }
    }
    return resolved as P
  }

}

function paramDefaults(definition: WidgetDefinition): Record<string, unknown> {
  const props: Record<string, unknown> = {}
  for (const group of definition.params) {
    for (const param of group.params) {
      props[param.name] = paramDefault(param)
    }
  }
  return props
}
