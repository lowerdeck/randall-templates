import { Attribute, ComponentSpec } from '../specification'

export interface Axis {
  base:   'left' | 'top'
  extent: 'right' | 'bottom'
  size:   'width' | 'height'
}

export const horizontal: Axis = {base: 'left', extent: 'right', size: 'width'}
export const vertical: Axis = {base: 'top', extent: 'bottom', size: 'height'}

/**
 * The raw base, extent and size of the component along the axis, or `null` if any of them is dynamic, in which case
 * the axis can't be manipulated.
 */
export function axisValues(spec: ComponentSpec, axis: Axis): AxisValues | null {
  const base = spec[axis.base] ?? spec.inset
  const extent = spec[axis.extent] ?? spec.inset
  const size = spec[axis.size]
  if (Attribute.isDynamic(base) || Attribute.isDynamic(extent) || Attribute.isDynamic(size)) { return null }

  return {base, extent, size}
}

export interface AxisValues {
  base:   number | undefined
  extent: number | undefined
  size:   number | `${number}%` | undefined
}
