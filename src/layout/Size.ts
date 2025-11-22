export class Size {

  constructor(width: number, height: number)
  constructor(...args: any[]) {
    if (args.length === 2) {
      [this.width, this.height] = args
    } else {
      [this.width, this.height] = args[0]
    }
  }

  public static zero = () => new Size(0, 0)

  public width:  number
  public height: number

}