import { ReactRenderHost } from '@modou/render'

export {}
declare global {
  interface Window {
    reactRenderHost: ReactRenderHost
  }
}
