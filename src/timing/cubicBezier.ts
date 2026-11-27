import { BezierPoints } from './bezier'

/**
 * The easing of a CSS `cubic-bezier()`: maps progress in time (x) to progress in value (y), by solving the curve for x.
 */
export function cubicBezier([x1, y1, x2, y2]: BezierPoints): (x: number) => number {
  const cx = 3 * x1
  const bx = 3 * (x2 - x1) - cx
  const ax = 1 - cx - bx

  const cy = 3 * y1
  const by = 3 * (y2 - y1) - cy
  const ay = 1 - cy - by

  const sampleX = (s: number) => ((ax * s + bx) * s + cx) * s
  const sampleY = (s: number) => ((ay * s + by) * s + cy) * s
  const slopeX = (s: number) => (3 * ax * s + 2 * bx) * s + cx

  function solve(x: number) {
    let s = x
    for (let i = 0; i < NEWTON_ITERATIONS; i++) {
      const error = sampleX(s) - x
      if (Math.abs(error) < EPSILON) { return s }

      const slope = slopeX(s)
      if (Math.abs(slope) < EPSILON) { break }
      s -= error / slope
    }

    // Newton's method can stall on flat parts of the curve; bisection always converges.
    let lo = 0
    let hi = 1
    s = x
    while (hi - lo > EPSILON) {
      const sx = sampleX(s)
      if (Math.abs(sx - x) < EPSILON) { return s }
      if (sx < x) { lo = s } else { hi = s }
      s = (lo + hi) / 2
    }
    return s
  }

  return (x: number) => {
    if (x <= 0) { return 0 }
    if (x >= 1) { return 1 }
    return sampleY(solve(x))
  }
}

const NEWTON_ITERATIONS = 8
const EPSILON = 1e-7
