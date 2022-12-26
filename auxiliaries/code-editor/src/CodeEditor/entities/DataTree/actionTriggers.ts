import { TypeOptions } from 'react-toastify'

import { NavigationTargetType } from '@modou/code-editor/CodeEditor/sagas/ActionExecution/NavigateActionSaga'

export enum ActionTriggerType {
  RUN_PLUGIN_ACTION = 'RUN_PLUGIN_ACTION',
  CLEAR_PLUGIN_ACTION = 'CLEAR_PLUGIN_ACTION',
  NAVIGATE_TO = 'NAVIGATE_TO',
  SHOW_ALERT = 'SHOW_ALERT',
  SHOW_MODAL_BY_NAME = 'SHOW_MODAL_BY_NAME',
  CLOSE_MODAL = 'CLOSE_MODAL',
  STORE_VALUE = 'STORE_VALUE',
  REMOVE_VALUE = 'REMOVE_VALUE',
  CLEAR_STORE = 'CLEAR_STORE',
  DOWNLOAD = 'DOWNLOAD',
  COPY_TO_CLIPBOARD = 'COPY_TO_CLIPBOARD',
  RESET_WIDGET_META_RECURSIVE_BY_NAME = 'RESET_WIDGET_META_RECURSIVE_BY_NAME',
  SET_INTERVAL = 'SET_INTERVAL',
  CLEAR_INTERVAL = 'CLEAR_INTERVAL',
  GET_CURRENT_LOCATION = 'GET_CURRENT_LOCATION',
  WATCH_CURRENT_LOCATION = 'WATCH_CURRENT_LOCATION',
  STOP_WATCHING_CURRENT_LOCATION = 'STOP_WATCHING_CURRENT_LOCATION',
  CONFIRMATION_MODAL = 'CONFIRMATION_MODAL',
  POST_MESSAGE = 'POST_MESSAGE',
}

export const ActionTriggerFunctionNames: Record<ActionTriggerType, string> = {
  [ActionTriggerType.CLEAR_INTERVAL]: 'clearInterval',
  [ActionTriggerType.CLEAR_PLUGIN_ACTION]: 'action.clear',
  [ActionTriggerType.CLOSE_MODAL]: 'closeModal',
  [ActionTriggerType.COPY_TO_CLIPBOARD]: 'copyToClipboard',
  [ActionTriggerType.DOWNLOAD]: 'download',
  [ActionTriggerType.NAVIGATE_TO]: 'navigateTo',
  [ActionTriggerType.RESET_WIDGET_META_RECURSIVE_BY_NAME]: 'resetWidget',
  [ActionTriggerType.RUN_PLUGIN_ACTION]: 'action.run',
  [ActionTriggerType.SET_INTERVAL]: 'setInterval',
  [ActionTriggerType.SHOW_ALERT]: 'showAlert',
  [ActionTriggerType.SHOW_MODAL_BY_NAME]: 'showModal',
  [ActionTriggerType.STORE_VALUE]: 'storeValue',
  [ActionTriggerType.REMOVE_VALUE]: 'removeValue',
  [ActionTriggerType.CLEAR_STORE]: 'clearStore',
  [ActionTriggerType.GET_CURRENT_LOCATION]: 'getCurrentLocation',
  [ActionTriggerType.WATCH_CURRENT_LOCATION]: 'watchLocation',
  [ActionTriggerType.STOP_WATCHING_CURRENT_LOCATION]: 'stopWatch',
  [ActionTriggerType.CONFIRMATION_MODAL]: 'ConfirmationModal',
  [ActionTriggerType.POST_MESSAGE]: 'postWindowMessage',
}

export interface RunPluginActionDescription {
  type: ActionTriggerType.RUN_PLUGIN_ACTION
  payload: {
    actionId: string
    params?: Record<string, unknown>
    onSuccess?: string
    onError?: string
  }
}

export interface ClearPluginActionDescription {
  type: ActionTriggerType.CLEAR_PLUGIN_ACTION
  payload: {
    actionId: string
  }
}

export interface NavigateActionDescription {
  type: ActionTriggerType.NAVIGATE_TO
  payload: {
    pageNameOrUrl: string
    params?: Record<string, string>
    target?: NavigationTargetType
  }
}

export interface ShowAlertActionDescription {
  type: ActionTriggerType.SHOW_ALERT
  payload: {
    message: string | unknown
    style?: TypeOptions
  }
}

export interface ShowModalActionDescription {
  type: ActionTriggerType.SHOW_MODAL_BY_NAME
  payload: { modalName: string }
}

export interface CloseModalActionDescription {
  type: ActionTriggerType.CLOSE_MODAL
  payload: { modalName: string }
}

export interface StoreValueActionDescription {
  type: ActionTriggerType.STORE_VALUE
  payload: {
    key: string
    value: string
    persist: boolean
    uniqueActionRequestId: string
  }
}

export interface RemoveValueActionDescription {
  type: ActionTriggerType.REMOVE_VALUE
  payload: {
    key: string
  }
}

export interface ClearStoreActionDescription {
  type: ActionTriggerType.CLEAR_STORE
  payload: null
}

export interface DownloadActionDescription {
  type: ActionTriggerType.DOWNLOAD
  payload: {
    data: any
    name: string
    type: string
  }
}

export interface CopyToClipboardDescription {
  type: ActionTriggerType.COPY_TO_CLIPBOARD
  payload: {
    data: string
    options: { debug?: boolean; format?: string }
  }
}

export interface ResetWidgetDescription {
  type: ActionTriggerType.RESET_WIDGET_META_RECURSIVE_BY_NAME
  payload: {
    widgetName: string
    resetChildren: boolean
  }
}

export interface SetIntervalDescription {
  type: ActionTriggerType.SET_INTERVAL
  payload: {
    callback: string
    interval: number
    id?: string
  }
}

export interface ClearIntervalDescription {
  type: ActionTriggerType.CLEAR_INTERVAL
  payload: {
    id: string
  }
}

interface GeolocationOptions {
  maximumAge?: number
  timeout?: number
  enableHighAccuracy?: boolean
}

interface GeolocationPayload {
  onSuccess?: string
  onError?: string
  options?: GeolocationOptions
}

export interface GetCurrentLocationDescription {
  type: ActionTriggerType.GET_CURRENT_LOCATION
  payload: GeolocationPayload
}

export interface WatchCurrentLocationDescription {
  type: ActionTriggerType.WATCH_CURRENT_LOCATION
  payload: GeolocationPayload
}

export interface StopWatchingCurrentLocationDescription {
  type: ActionTriggerType.STOP_WATCHING_CURRENT_LOCATION
  payload?: Record<string, never>
}

export interface ConfirmationModal {
  type: ActionTriggerType.CONFIRMATION_MODAL
  payload?: Record<string, any>
}

export interface PostMessageDescription {
  type: ActionTriggerType.POST_MESSAGE
  payload: {
    message: unknown
    source: string
    targetOrigin: string
  }
}

export type ActionDescription =
  | RunPluginActionDescription
  | ClearPluginActionDescription
  | NavigateActionDescription
  | ShowAlertActionDescription
  | ShowModalActionDescription
  | CloseModalActionDescription
  | StoreValueActionDescription
  | RemoveValueActionDescription
  | ClearStoreActionDescription
  | DownloadActionDescription
  | CopyToClipboardDescription
  | ResetWidgetDescription
  | SetIntervalDescription
  | ClearIntervalDescription
  | GetCurrentLocationDescription
  | WatchCurrentLocationDescription
  | StopWatchingCurrentLocationDescription
  | ConfirmationModal
  | PostMessageDescription
