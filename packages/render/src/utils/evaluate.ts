import { PageState } from '@modou/state-manager'

const EXPRESSION_REG = /[\s\S]*{{[\s\S]*}}[\s\S]*/m

export const isExpression = (str: unknown): str is string => {
  return typeof str === 'string' && EXPRESSION_REG.test(str)
}
// TODO 完善 store 类型
export const evalExpression = (expression: string, canvasState: PageState) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval,no-new-func,no-useless-call
    return new Function(
      'state',
      `with(state){
      return ${expression}
    }`,
    ).call(null, canvasState.subState.widget)
  } catch (e) {
    return String((e as SyntaxError)?.message) ?? 'Error'
  }
}
