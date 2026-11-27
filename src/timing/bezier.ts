import { TimingBezier } from '../specification'

export type BezierPoints = [x1: number, y1: number, x2: number, y2: number]

export function parseBezier(timing: string): BezierPoints | null {
  const match = timing.trim().match(/^cubic-bezier\((.*)\)$/)
  if (match == null) { return null }

  const parts = match[1].split(',').map(it => it.trim())
  if (parts.some(it => it === '')) { return null }

  const points = parts.map(Number)
  return validBezierPoints(points) ? points : null
}

export function formatBezier(points: BezierPoints): TimingBezier {
  return `cubic-bezier(${points.join(', ')})`
}

// Like CSS, the y values may go outside 0–1 (overshoot), but the x values may not, as time can't go back.
export function validBezierPoints(points: unknown[]): points is BezierPoints {
  if (points.length !== 4) { return false }
  if (!points.every(it => typeof it === 'number' && Number.isFinite(it))) { return false }

  const [x1, , x2] = points as BezierPoints
  return x1 >= 0 && x1 <= 1 && x2 >= 0 && x2 <= 1
}
