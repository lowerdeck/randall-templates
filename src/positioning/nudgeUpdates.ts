import { Rect, Vector } from '../layout'
import { ComponentSpec } from '../specification'
import { Axis, axisValues, horizontal, vertical } from './axes'

/**
 * The layout properties to update to move a floating component by the given delta. Works off its current insets
 * so that repeated nudges add up, even before the layout has caught up. The rect, relative to the rect of its
 * parent, is only used for an axis without insets.
 */
export function nudgeUpdates(spec: ComponentSpec, delta: Vector, rect: Rect): Record<string, unknown> {
  return {
    ...axisUpdates(spec, horizontal, delta.x, rect.left),
    ...axisUpdates(spec, vertical, delta.y, rect.top),
  }
}

function axisUpdates(spec: ComponentSpec, axis: Axis, delta: number, start: number) {
  if (delta === 0) { return {} }

  const values = axisValues(spec, axis)
  if (values == null) { return {} }

  const {base, extent} = values
  if (base == null && extent == null) {
    return {[axis.base]: Math.round(start + delta)}
  }

  const updates: Record<string, unknown> = {}
  if (base != null) {
    updates[axis.base] = base + delta
  }
  if (extent != null) {
    updates[axis.extent] = extent - delta
  }
  return updates
}
