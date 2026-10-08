import { Rect, Size } from '../layout'
import { ComponentSpec, SizeValue } from '../specification'
import { Axis, axisValues, horizontal, vertical } from './axes'

/**
 * The layout properties to update to place the component at the given rect, relative to the rect of its parent.
 * Mirrors the renderer, where the insets of a floating component are relative to the full size of its parent.
 */
export function frameUpdates(spec: ComponentSpec, rect: Rect, options: FrameUpdatesOptions): Record<string, unknown> {
  const {parentSize, floating, originalSize} = options

  return {
    ...axisUpdates(spec, horizontal, rect.left, rect.width, parentSize.width, originalSize?.width, floating),
    ...axisUpdates(spec, vertical, rect.top, rect.height, parentSize.height, originalSize?.height, floating),
  }
}

function axisUpdates(spec: ComponentSpec, axis: Axis, start: number, length: number, parentLength: number, originalLength: number | undefined, floating: boolean) {
  const values = axisValues(spec, axis)
  if (values == null) { return {} }

  const {base, extent, size} = values
  const updates: Record<string, unknown> = {}

  if (floating && (base != null || extent == null)) {
    updates[axis.base] = Math.round(start)
  }
  if (floating && extent != null) {
    updates[axis.extent] = Math.round(parentLength - start - length)
  }

  // With both insets and no size, the size follows from the insets.
  const sizeFromInsets = floating && base != null && extent != null && size == null
  if (originalLength != null && !sizeFromInsets) {
    updates[axis.size] = scaleSize(size, length, originalLength)
  }

  return updates
}

// Percentages are kept, scaled along with the size.
function scaleSize(current: SizeValue | undefined, length: number, originalLength: number): SizeValue {
  if (typeof current === 'string' && originalLength > 0) {
    const percentage = parseFloat(current) * length / originalLength
    return `${Math.round(percentage * 100) / 100}%`
  }

  return Math.max(1, Math.round(length))
}

export interface FrameUpdatesOptions {
  parentSize: Size
  floating:   boolean

  // The size of the component before resizing. If not given, only the position is updated.
  originalSize?: Size
}
