import { Rect } from '../layout'
import { ComponentSpec, ComponentType } from '../specification'

/**
 * The layout properties to update to make a component in a ZStack floating, keeping it at its current rect, relative
 * to the rect of its parent.
 */
export function floatUpdates(spec: ComponentSpec, rect: Rect): Record<string, unknown> {
  const updates: Record<string, unknown> = {
    left: Math.round(rect.left),
    top:  Math.round(rect.top),
  }

  // Otherwise it would shrink to its intrinsic size. Texts are left to grow with their content vertically.
  if (spec.width == null) {
    updates.width = Math.round(rect.width)
  }
  if (spec.height == null && spec.$type !== ComponentType.Text) {
    updates.height = Math.round(rect.height)
  }

  return updates
}
