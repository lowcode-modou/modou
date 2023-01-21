const EXPRESSION_REG = /[\s\S]*{{[\s\S]*}}[\s\S]*/m

export const isExpression = (str: unknown): str is string => {
  return typeof str === 'string' && EXPRESSION_REG.test(str)
}
