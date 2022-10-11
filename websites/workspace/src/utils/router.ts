import { generatePath } from 'react-router-dom'

type ExtractRouteOptionalParam<
  T extends string,
  U = string | number | boolean,
> = T extends `${infer Param}?`
  ? { [k in Param]?: U }
  : T extends `${infer Param}*`
  ? { [k in Param]?: U }
  : T extends `${infer Param}+`
  ? { [k in Param]: U }
  : { [k in T]: U }
type ExtractRouteParams<
  T extends string,
  U = string | number | boolean,
> = string extends T
  ? { [k in string]?: U }
  : // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends `${infer _Start}:${infer ParamWithOptionalRegExp}/${infer Rest}`
  ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ParamWithOptionalRegExp extends `${infer Param}(${infer _RegExp})`
    ? ExtractRouteOptionalParam<Param, U> & ExtractRouteParams<Rest, U>
    : ExtractRouteOptionalParam<ParamWithOptionalRegExp, U> &
        ExtractRouteParams<Rest, U>
  : // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends `${infer _Start}:${infer ParamWithOptionalRegExp}`
  ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ParamWithOptionalRegExp extends `${infer Param}(${infer _RegExp})`
    ? ExtractRouteOptionalParam<Param, U>
    : ExtractRouteOptionalParam<ParamWithOptionalRegExp, U>
  : {}
export function generateRouterPath<S extends string>(
  path: S,
  params?: ExtractRouteParams<S>,
): string {
  return generatePath(path, params as any)
}
