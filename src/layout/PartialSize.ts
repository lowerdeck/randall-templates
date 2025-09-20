export class PartialSize {

  constructor(width: number | undefined, height: number | undefined)
  constructor(...args: any[]) {
    if (args.length === 2) {
      [this.width, this.height] = args
    } else {
      [this.width, this.height] = args[0]
    }
  }

  public static undef() { return new PartialSize(undefined, undefined) }
  public static zero() { return new PartialSize(0, 0) }

  public width:  number | undefined
  public height: number | undefined

}