import { name } from '../../package.json'

export const generateRecoilKey = (key: string): string => {
  return `@${name}/${key}`
}

export const getWidgetIdFromElement = (element: HTMLElement): string => {
  return element?.dataset?.widgetId ?? ''
}

export const getRawElement = (target: HTMLElement | null, root: HTMLElement | null): HTMLElement | null => {
  if (!target || target === root) {
    return null
  }
  const widgetId = getWidgetIdFromElement(target)
  if (widgetId) {
    return target
  }
  return getRawElement(target.parentElement, root)
}
