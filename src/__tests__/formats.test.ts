import { isFullOutputEnabled, isOutputEnabled, OutputFiletype, OutputFormat, templateOutputs, videoCodecList } from '../formats'
import { AnimationsSpec, AnimProperty, PhaseType } from '../specification'

describe("OutputFormat", () => {

  it("round-trips its string form", () => {
    for (const raw of ['png', 'jpeg(85)', 'webp', 'webp(70)', 'avif(60)', 'prores.mov', 'libx264.mp4', 'libvpx-vp9.webm', 'ffv1.mkv']) {
      expect(OutputFormat.parse(raw).toString()).toBe(raw)
    }
  })

  it("understands the legacy short forms", () => {
    expect(OutputFormat.parse('jpeg').toString()).toBe('jpeg(85)')
    expect(OutputFormat.parse('mov').toString()).toBe('prores.mov')
    expect(OutputFormat.parse('mp4').toString()).toBe('libx264.mp4')
  })

  it("rejects invalid formats", () => {
    expect(OutputFormat.tryParse('gif')).toBeNull()
    expect(OutputFormat.tryParse('jpeg(0)')).toBeNull()
    expect(OutputFormat.tryParse('jpeg(101)')).toBeNull()
    expect(OutputFormat.tryParse('png(50)')).toBeNull()
    expect(OutputFormat.tryParse('prores.png')).toBeNull()
  })

  it("knows its kind and losslessness", () => {
    expect(OutputFormat.png().isImage).toBe(true)
    expect(OutputFormat.png().lossless).toBe(true)
    expect(OutputFormat.webp().lossless).toBe(true)
    expect(OutputFormat.webp(80).lossless).toBe(false)
    expect(OutputFormat.video('prores').isVideo).toBe(true)
    expect(OutputFormat.video('prores').fileType).toBe(OutputFiletype.QuickTime)
    expect(OutputFormat.video('libx264').fileType).toBe(OutputFiletype.MP4)
  })

  it("uses jpg as the JPEG extension", () => {
    expect(OutputFormat.jpeg(80).extension).toBe('jpg')
    expect(OutputFormat.video('libvpx-vp9').extension).toBe('webm')
  })

})

describe("templateOutputs", () => {

  const defaults = {image: OutputFormat.png(), video: OutputFormat.video('prores')}

  const track = {component_id: 'a', prop: AnimProperty.Opacity, keyframes: []}

  function outputs(animations: AnimationsSpec) {
    const result = templateOutputs(animations, defaults)
    return {
      main:   result.main.toString(),
      phases: result.phases.map(it => [it.phase.name, it.format.toString()]),
      stills: result.stills.map(it => [it.still.name, it.format.toString()]),
    }
  }

  it("outputs one image for a template without animations", () => {
    expect(outputs({phases: [], tracks: [], stills: [{name: 'still', frame: 0}]})).toEqual({
      main:   'png',
      phases: [],
      stills: [['still', 'png']],
    })
  })

  it("outputs a video per phase for an animated template", () => {
    const animations: AnimationsSpec = {
      tracks: [track],
      phases: [
        {name: 'in', type: PhaseType.BuildIn, from: 0, to: 10},
        {name: 'out', type: PhaseType.BuildOut, from: 10, to: 20, format: 'libx264.mp4'},
      ],
      stills: [{name: 'still', frame: 5, format: 'jpeg(70)'}],
    }
    expect(outputs(animations)).toEqual({
      main:   'prores.mov',
      phases: [['in', 'prores.mov'], ['out', 'libx264.mp4']],
      stills: [['still', 'jpeg(70)']],
    })
  })

  it("ignores formats of the wrong kind", () => {
    const animations: AnimationsSpec = {
      tracks: [track],
      phases: [{name: 'in', type: PhaseType.BuildIn, from: 0, to: 10, format: 'png'}],
      stills: [{name: 'still', frame: 5, format: 'prores.mov'}],
    }
    expect(outputs(animations)).toEqual({
      main:   'prores.mov',
      phases: [['in', 'prores.mov']],
      stills: [['still', 'png']],
    })
  })

})

describe("output enabling", () => {

  const phase = {name: 'in', type: PhaseType.BuildIn, from: 0, to: 10}

  it("enables phases and stills unless switched off", () => {
    expect(isOutputEnabled(phase)).toBe(true)
    expect(isOutputEnabled({...phase, enabled: false})).toBe(false)
    expect(isOutputEnabled({name: 'still', frame: 0, enabled: true})).toBe(true)
  })

  it("outputs the full animation by default only without phases", () => {
    expect(isFullOutputEnabled({phases: [], tracks: []})).toBe(true)
    expect(isFullOutputEnabled({phases: [phase], tracks: []})).toBe(false)
    expect(isFullOutputEnabled({phases: [phase], tracks: [], full: true})).toBe(true)
    expect(isFullOutputEnabled({phases: [], tracks: [], full: false})).toBe(false)
  })

  it("lists disabled outputs as well", () => {
    const outputs = templateOutputs({
      phases: [{...phase, enabled: false}],
      stills: [{name: 'still', frame: 5}],
      tracks: [{component_id: 'a', prop: AnimProperty.Opacity, keyframes: []}],
      full:   true,
    }, {image: OutputFormat.png(), video: OutputFormat.video('prores')})

    expect(outputs.full).toBe(true)
    expect(outputs.phases.map(it => it.enabled)).toEqual([false])
    expect(outputs.stills.map(it => it.enabled)).toEqual([true])
  })

})

describe("videoCodecs", () => {

  it("lists each codec once", () => {
    const ids = videoCodecList.map(it => it.id)
    expect(ids).toEqual([...new Set(ids)])
  })

})
