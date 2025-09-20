

export class Vector {

  constructor(x: number, y: number)
  constructor(...args: any[]) {
    if (args.length === 2) {
      [this.x, this.y] = args
    } else {
      [this.x, this.y] = args[0]
    }
  }

  public static zero() {
    return new Vector(0, 0)
  }

  public x: number
  public y: number

  public offset(offset: number | Vector): Vector {
    return new Vector(
      this.x + (typeof offset === 'number' ? offset : offset.x),
      this.y + (typeof offset === 'number' ? offset : offset.y),
    )
  }

}