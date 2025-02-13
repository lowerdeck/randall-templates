import { isArray } from 'lodash'
import { ConstraintProp } from '../specification'
import { Point } from './Point'
import { Size } from './Size'
import { Vector } from './types'

export class Rect {

  constructor(left: number, top: number, width: number, height: number)
  constructor(origin: Point, size: Size)
  constructor(origin: Vector, size: Vector)
  constructor(...args: any[]) {
    if (args.length === 4) {
      [
        this.left,
        this.top,
        this.width,
        this.height,
      ] = args
    } else {
      const [origin, size] = args
      if (isArray(origin)) {
        [this.left, this.top] = origin
      } else {
        this.left = origin.x
        this.top = origin.y
      }
      if (isArray(size)) {
        [this.width, this.height] = size
      } else {
        this.width = size.width
        this.height = size.height
      }
    }
  }

  public static zero = new Rect(0, 0, 0, 0)

  public static around(rects: Rect[]) {
    const left = Math.min(...rects.map(it => it.left))
    const top = Math.min(...rects.map(it => it.top))
    const right = Math.max(...rects.map(it => it.right))
    const bottom = Math.max(...rects.map(it => it.bottom))

    return new Rect(
      left,
      top,
      right - left,
      bottom - top
    )
  }

  public left:   number
  public top:    number
  public width:  number
  public height: number

  public get right() {
    return this.left + this.width
  }

  public get bottom() {
    return this.top + this.height
  }

  public get origin() {
    return new Point(
      this.left,
      this.top
    )
  }

  public get center() {
    return new Point(
      this.left + this.width / 2,
      this.top + this.height / 2
    )
  }

  public get size() {
    return new Size(
      this.width,
      this.height
    )
  }

  //------
  // Derived

  public roundIn() {
    const left = Math.ceil(this.left)
    const top = Math.ceil(this.top)
    const right = Math.floor(this.left + this.width)
    const bottom = Math.floor(this.top + this.height)

    return new Rect(left, top, right - left, bottom - top)
  }

  public roundOut() {
    const left = Math.floor(this.left)
    const top = Math.floor(this.top)
    const right = Math.ceil(this.left + this.width)
    const bottom = Math.ceil(this.top + this.height)

    return new Rect(left, top, right - left, bottom - top)
  }

  public inset(inset: number) {
    return new Rect(
      this.left + inset,
      this.top + inset,
      this.width - 2 * inset,
      this.height - 2 * inset
    )
  }

  public offset(offset: number | Vector | Point) {
    return new Rect(
      this.origin.offset(offset),
      this.size
    )
  }

  //------
  // Anchors

  public constraintValue(prop: ConstraintProp) {
    switch (prop) {
    case 'left': return this.left
    case 'right': return this.right
    case 'top': return this.top
    case 'bottom': return this.bottom
    }
  }

}