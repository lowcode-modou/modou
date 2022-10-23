import { useMutationObserver } from 'ahooks'

const STYLE_TAG_NAME = 'STYLE'

export const useFrameStyle = (document?: HTMLDocument) => {
  useMutationObserver(
    () => {
      const styles = [...window.document.head.children]
        .filter((child) => child.tagName === STYLE_TAG_NAME)
        .map((child) => child.outerHTML)
        .join('\n')
      if (document?.head) {
        document.head.innerHTML = styles
      }
    },
    window.document.head,
    {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    },
  )
}
