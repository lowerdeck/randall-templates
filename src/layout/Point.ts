import { isArray } from 'lodash'
import { Vector } from './types'

export class Point {

  constructor(x: number, y: number)
  constructor(xy: Vector)
  constructor(...args: any[]) {
    if (args.length === 2) {
      [this.x, this.y] = args
    } else {
      [this.x, this.y] = args[0]
    }
  }

  public x: number
  public y: number

  public offset(offset: number | Point | Vector): Point {
    return new Point(
      this.x + (typeof offset === 'number' ? offset : isArray(offset) ? offset[0] : offset.x),
      this.y + (typeof offset === 'number' ? offset : isArray(offset) ? offset[1] : offset.y),
    )
  }

}