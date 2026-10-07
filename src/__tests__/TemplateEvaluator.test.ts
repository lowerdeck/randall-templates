import { TemplateEvaluator } from '../TemplateEvaluator'

const evaluator = new TemplateEvaluator({
  name:    'Jane',
  count:   3,
  missing: undefined,
  empty:   null,
  person:  {first: 'Jane'},
})

function evaluate(expression: string) {
  return evaluator.evaluateExpression(expression)
}

describe("missing values", () => {

  it("are empty strings in concatenation", () => {
    expect(evaluate("'Hello ' + missing")).toEqual('Hello ')
    expect(evaluate("missing + ' there'")).toEqual(' there')
    expect(evaluate("name + ' ' + empty")).toEqual('Jane ')
    expect(evaluate("person.first + ' ' + person.last")).toEqual('Jane ')
    expect(evaluate("unknown + '!'")).toEqual('!')
  })

  it("are zero in arithmetic", () => {
    expect(evaluate("count + missing")).toEqual(3)
    expect(evaluate("missing + count")).toEqual(3)
    expect(evaluate("missing * 2")).toEqual(0)
    expect(evaluate("count - empty")).toEqual(3)
    expect(evaluate("2 ** missing")).toEqual(1)
    expect(evaluate("-missing")).toEqual(0)
    expect(evaluate("+missing")).toEqual(0)
  })

  it("stay missing when added to each other", () => {
    expect(evaluate("missing + empty")).toBeNull()
  })

  it("compare as the empty value of the other side", () => {
    expect(evaluate("missing < 1")).toBe(true)
    expect(evaluate("count > missing")).toBe(true)
    expect(evaluate("missing < 'a'")).toBe(true)
    expect(evaluate("missing >= empty")).toBe(true)
  })

  it("are still missing for equality and logic", () => {
    expect(evaluate("missing == null")).toBe(true)
    expect(evaluate("missing === ''")).toBe(false)
    expect(evaluate("missing ?? 'fallback'")).toEqual('fallback')
    expect(evaluate("!missing")).toBe(true)
    expect(evaluate("missing || 'fallback'")).toEqual('fallback')
  })

})

describe("present values", () => {

  it("behave as in JavaScript", () => {
    expect(evaluate("name + ' ' + count")).toEqual('Jane 3')
    expect(evaluate("count * 2 - 1")).toEqual(5)
    expect(evaluate("count % 2")).toEqual(1)
    expect(evaluate("'b' > 'a'")).toBe(true)
    expect(evaluate("-count")).toEqual(-3)
  })

})
