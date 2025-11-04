export class PartialSize {

  constructor(
    public readonly width: number | undefined,
    public readonly height: number | undefined,
  ) {}

  public static defined(width: number, height: number) { return new PartialSize(width, height) }
  public static undefined() { return new PartialSize(undefined, undefined) }
  public static zero() { return new PartialSize(0, 0) }

  public static around(sizes: PartialSize[]) {
    const maxWidth = Math.max(...sizes.map(s => s.width ?? 0));
    const maxHeight = Math.max(...sizes.map(s => s.height ?? 0));
    return new PartialSize(maxWidth, maxHeight);
  }

  public ceil() {
    return new PartialSize(
      this.width == null ? undefined : Math.ceil(this.width),
      this.height == null ? undefined : Math.ceil(this.height),
    )
  }

}