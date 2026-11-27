import { EnumUtil } from '@mosdev/ytil'
import { Keyframe, WellKnownTimingFunction } from '../specification'
import { BezierPoints, formatBezier, parseBezier, validBezierPoints } from './bezier'

/**
 * Parses a keyframe timing into its canonical form: a well-known name, or a CSS `cubic-bezier(x1, y1, x2, y2)`.
 * Also accepts the `[x1, y1, x2, y2]` arrays that older templates contain. Returns `null` if it is invalid.
 */
export function parseTiming(raw: unknown): Keyframe['timing'] | null {
  if (EnumUtil.is(WellKnownTimingFunction, raw)) { return raw }

  const points = typeof raw === 'string' ? parseBezier(raw) : legacyBezier(raw)
  return points == null ? null : formatBezier(points)
}

export const INVALID_TIMING_MESSAGE = 'Use a named timing or "cubic-bezier(x1, y1, x2, y2)", with x1 and x2 between 0 and 1.'

function legacyBezier(raw: unknown): BezierPoints | null {
  if (!Array.isArray(raw) || raw.length !== 4) { return null }
  return validBezierPoints(raw) ? raw : null
}
