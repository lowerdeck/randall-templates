/**
 * The arithmetic and comparison operators of template expressions. They differ from JavaScript in how they treat
 * a missing value (`null` or `undefined`): as the empty value of the other operand's type, so `''` next to a string
 * and `0` next to a number. Template data is often incomplete, and `"Hello " + undefined` should give `"Hello "`
 * rather than `"Hello undefined"`, and `undefined * 2` should give `0` rather than `NaN`.
 *
 * Equality operators are left alone, so that `x == null` still tells whether something is missing.
 */
export function binary(operator: BinaryOperator, left: unknown, right: unknown): unknown {
  switch (operator) {
  case '+': {
    // Without anything to go by, the result is missing as well.
    if (left == null && right == null) { return null }

    const [l, r] = operands(left, right, '')
    return l + r
  }

  case '-': return number(left) - number(right)
  case '*': return number(left) * number(right)
  case '/': return number(left) / number(right)
  case '%': return number(left) % number(right)
  case '**': return number(left) ** number(right)

  case '<': {
    const [l, r] = operands(left, right, 0)
    return l < r
  }
  case '<=': {
    const [l, r] = operands(left, right, 0)
    return l <= r
  }
  case '>': {
    const [l, r] = operands(left, right, 0)
    return l > r
  }
  case '>=': {
    const [l, r] = operands(left, right, 0)
    return l >= r
  }
  }
}

export function unary(operator: UnaryOperator, argument: unknown): unknown {
  switch (operator) {
  case '!': return !argument
  case '+': return number(argument)
  case '-': return argument == null ? 0 : -Number(argument)
  }
}

export type BinaryOperator = '+' | '-' | '*' | '/' | '%' | '**' | '<' | '<=' | '>' | '>='
export type UnaryOperator = '!' | '+' | '-'

export const binaryOperators = new Set<string>(['+', '-', '*', '/', '%', '**', '<', '<=', '>', '>='])
export const unaryOperators = new Set<string>(['!', '+', '-'])

/**
 * Replaces a missing operand by the empty value of the other operand's type: `0` for a number, and `''` otherwise.
 * If both are missing, they become `fallback`.
 */
function operands(left: unknown, right: unknown, fallback: unknown): [any, any] {
  return [left ?? emptyLike(right, fallback), right ?? emptyLike(left, fallback)]
}

function emptyLike(other: unknown, fallback: unknown): unknown {
  if (other == null) { return fallback }
  return typeof other === 'number' ? 0 : ''
}

function number(value: unknown): number {
  return value == null ? 0 : Number(value)
}
