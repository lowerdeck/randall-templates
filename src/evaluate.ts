export function evaluateTree<T extends object>(tree: T, vars: Record<string, any>): T {
  return tree
}

export function evaluate<T>(expression: string, vars: Record<string, any>): T {
  return null!
}