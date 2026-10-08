import { Size } from '../layout'
import { ComponentSpec } from '../specification'
import { Axis, axisValues, horizontal, vertical } from './axes'

/**
 * The layout properties to update to keep a ZStack at its current size once it no longer has a static child to size
 * itself around. Axes with an explicit size, or a size that follows from both insets, are left alone.
 */
export function keepSizeUpdates(spec: ComponentSpec, floating: boolean, size: Size): Record<string, unknown> {
  return {
    ...axisUpdates(spec, horizontal, floating, size.width),
    ...axisUpdates(spec, vertical, floating, size.height),
  }
}

function axisUpdates(spec: ComponentSpec, axis: Axis, floating: boolean, length: number) {
  const values = axisValues(spec, axis)
  if (values == null || values.size != null) { return {} }
  if (floating && values.base != null && values.extent != null) { return {} }

  return {[axis.size]: Math.round(length)}
}
