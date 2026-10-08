import { Vector } from './Vector'

/**
 * Converts a vector (not a point) into the coordinate space that the given matrix maps from.
 */
export function vectorToLocal(matrix: DOMMatrixReadOnly, vector: {x: number, y: number}): Vector {
  const {a, b, c, d} = matrix
  const det = a * d - b * c
  if (Math.abs(det) < 1e-9) { return Vector.zero() }

  return new Vector(
    (d * vector.x - c * vector.y) / det,
    (a * vector.y - b * vector.x) / det,
  )
}

/**
 * Whether the matrix maps rects onto rects, i.e. it has no rotation or skew.
 */
export function isAxisAligned(matrix: DOMMatrixReadOnly): boolean {
  return Math.abs(matrix.b) < 1e-9 && Math.abs(matrix.c) < 1e-9
}
