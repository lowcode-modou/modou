export const AppsmithConsole = {
  addLogs: (...args: any) => {
    console.log('AppsmithConsole__addLogs', args)
  },
  info: (...args: any) => {
    console.log('AppsmithConsole__info', args)
  },
  warning: (...args: any) => {
    console.log('AppsmithConsole__warning', args)
  },
  error: (...args: any) => {
    console.log('AppsmithConsole__error', args)
  },
  addErrors: (...args: any) => {
    console.log('AppsmithConsole__addErrors', args)
  },
  deleteErrors: (...args: any) => {
    console.log('AppsmithConsole__deleteErrors', args)
  },
}
