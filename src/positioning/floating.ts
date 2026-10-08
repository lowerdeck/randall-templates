import { ComponentSpec, isZStackContainer } from '../specification'

/**
 * Whether the component is absolutely positioned in its parent ZStack, and can therefore be moved around freely.
 */
export function isFloating(spec: ComponentSpec, parent: ComponentSpec): boolean {
  return canFloatIn(parent) && hasAbsolutePositioning(spec)
}

export function canFloatIn(parent: ComponentSpec): boolean {
  return isZStackContainer(parent)
}

export function hasAbsolutePositioning(spec: ComponentSpec): boolean {
  if (spec.inset != null) { return true }
  if (spec.left != null) { return true }
  if (spec.right != null) { return true }
  if (spec.top != null) { return true }
  if (spec.bottom != null) { return true }
  return false
}
