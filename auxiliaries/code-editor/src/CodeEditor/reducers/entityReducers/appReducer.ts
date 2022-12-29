import { APP_MODE } from '@modou/code-editor/CodeEditor/entities/App'

export interface AuthUserState {
  username: string
  email: string
  id: string
}
export interface UrlDataState {
  queryParams: Record<string, string>
  protocol: string
  host: string
  hostname: string
  port: string
  pathname: string
  hash: string
  fullPath: string
}

export interface AppStoreState {
  transient: Record<string, unknown>
  persistent: Record<string, unknown>
}
export interface AppDataState {
  mode?: APP_MODE
  user: AuthUserState
  URL: UrlDataState
  store: AppStoreState
  geolocation: {
    canBeRequested: boolean
    currentPosition?: Partial<GeolocationPosition>
  }
}
