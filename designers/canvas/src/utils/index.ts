import { name } from '../../package.json'

export const generateRecoilKey = (key: string): string => {
  return `@${name}/${key}`
}

export const getWidgetIdFromElement = (element: HTMLElement): string => {
  return element?.dataset?.widgetId ?? ''
}
export const getWidgetSlotPathFromElement = (element: HTMLElement): string => {
  return element?.dataset?.widgetSlotPath ?? ''
}

const isRootRawElement = (element: HTMLElement): string => {
  return JSON.parse(element?.dataset?.widgetRoot ?? 'false')
}

export const getElementsFromWidgetId = (
  widgetId: string,
  document: Document,
): Element[] | null => {
  return [...document.querySelectorAll(`[data-widget-id=${widgetId}]`)]
}

export const getRootElementFromWidgetId = (
  widgetId: string,
  document: Document,
): HTMLElement | null => {
  return (
    document.querySelector(
      `[data-widget-id=${widgetId}][data-widget-root=true]`,
    ) ??
    document.querySelector(
      `[data-widget-id=${widgetId}]:not([data-widget-slot-path])`,
    )
  )
}

export const getSlotElementFromWidgetId = (
  widgetId: string,
  slotPath: string,
  document: Document,
): HTMLElement | null => {
  return document.querySelector(
    `[data-widget-id=${widgetId}][data-widget-path=${slotPath}]`,
  )
}

export const getSlotRawElement = (
  target: HTMLElement | null,
  root: HTMLElement | null,
): HTMLElement | null => {
  if (!target || target === root) {
    return null
  }
  const widgetId = getWidgetIdFromElement(target)
  if (widgetId) {
    return target
  }
  return getSlotRawElement(target.parentElement, root)
}

export const getRootRawElement = (
  target: HTMLElement | null,
  root: HTMLElement | null,
): HTMLElement | null => {
  if (!target || target === root) {
    return null
  }
  const widgetId = getWidgetIdFromElement(target)
  if (widgetId && isRootRawElement(target)) {
    return target
  }
  return getRootRawElement(target.parentElement, root)
}
