

export class Point {

  constructor(x: number, y: number)
  constructor(...args: any[]) {
    if (args.length === 2) {
      [this.x, this.y] = args
    } else {
      [this.x, this.y] = args[0]
    }
  }

  public x: number
  public y: number

  public offset(offset: number | Point): Point {
    return new Point(
      this.x + (typeof offset === 'number' ? offset : offset.x),
      this.y + (typeof offset === 'number' ? offset : offset.y),
    )
  }

}