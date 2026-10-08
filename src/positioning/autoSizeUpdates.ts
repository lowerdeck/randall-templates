import { Attribute, ComponentSpec } from '../specification'

/**
 * The layout properties to update to size the component automatically along the given axes. Only explicit sizes are
 * cleared; a size that is dynamic, or that follows from both insets, is left alone.
 */
export function autoSizeUpdates(spec: ComponentSpec, axes: AutoSizeAxes): Record<string, unknown> {
  const updates: Record<string, unknown> = {}
  if (axes.width && spec.width != null && !Attribute.isDynamic(spec.width)) {
    updates.width = undefined
  }
  if (axes.height && spec.height != null && !Attribute.isDynamic(spec.height)) {
    updates.height = undefined
  }
  return updates
}

export interface AutoSizeAxes {
  width?:  boolean
  height?: boolean
}
