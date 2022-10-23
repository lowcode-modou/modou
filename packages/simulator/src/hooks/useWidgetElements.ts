// import { useMutationObserver } from 'ahooks'
// import { useContext } from 'react'
//
// import { WidgetElementsContext } from '../contexts'
//
// export const useWidgetElements = (document?: HTMLDocument) => {
//   const { update } = useContext(WidgetElementsContext)
//   useMutationObserver(
//     () => {
//       const elements = [
//         ...(document?.querySelectorAll?.('[data-widget-id]') ?? []),
//       ] as HTMLElement[]
//       update(elements)
//     },
//     // TODO update widget element
//     document?.body,
//     {
//       childList: true,
//       subtree: true,
//     },
//   )
// }
