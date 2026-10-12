import { componentId } from '../ids'
import { ComponentType, defaultComponent, WidgetSpec } from '../specification'
import { WidgetDefinition } from './WidgetDefinition'

export function defaultWidget(definition: WidgetDefinition, name: string, id: string = componentId()): WidgetSpec {
  return {
    ...defaultComponent<WidgetSpec>(ComponentType.Widget, name, id),
    widget: definition.name,
    props:  WidgetDefinition.defaultProps(definition),
  }
}
