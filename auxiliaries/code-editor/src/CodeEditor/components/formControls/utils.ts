export enum ViewTypes {
  JSON = 'json',
  COMPONENT = 'component',
}
export const extractEvalConfigFromFormConfig = (
  formConfig: FormConfigType,
  paths: string[],
  parentPath = '',
  bindingsFound: FormConfigEvalObject = {},
) => {
  paths.forEach((path: string) => {
    if (!(path in formConfig)) return
    const config = get(formConfig, path, '')
    if (typeof config === 'string') {
      bindingsFound = {
        ...bindingsFound,
        ...extractExpressionObject(config, path, parentPath),
      }
    } else if (typeof config === 'object') {
      bindingsFound = {
        ...bindingsFound,
        ...extractEvalConfigFromFormConfig(
          config,
          Object.keys(config),
          parentPath.length > 0 ? `${parentPath}.${path}` : path,
          bindingsFound,
        ),
      }
    }
  })

  return bindingsFound
}
