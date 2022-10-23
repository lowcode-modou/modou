import { useMutationObserver } from 'ahooks'

const STYLE_TAG_NAME = 'STYLE'

const updateIframeStyle = (document?: Document) => {
  const styles = [...window.document.head.children]
    .filter((child) => child.tagName === STYLE_TAG_NAME)
    .map((child) => {
      return child.cloneNode(true) as unknown as HTMLStyleElement
    })
  // .map((child) => child.outerHTML)
  // .join('\n')
  if (document?.head) {
    document.head.replaceChildren(...styles)

    const emotionStyleSheet: CSSStyleSheet = [
      ...(document.styleSheets ?? []),
    ].find(
      // @ts-expect-error
      (sheet) => sheet.ownerNode?.dataset?.emotion === 'css',
    ) as CSSStyleSheet

    const rootEmotionStyle: HTMLStyleElement = window.document.querySelector(
      'style[data-emotion=css]',
    ) as HTMLStyleElement

    for (const rule of rootEmotionStyle?.sheet?.cssRules ?? []) {
      emotionStyleSheet?.insertRule(rule.cssText)
    }

    // document.head.querySelector('')
    // ;(document.head as HTMLStyleElement).sheet?.insertRule(
    //   (document.head as HTMLStyleElement)?.sheet?.cssRules[0]?.cssText!,
    // )
  }
}

export const useFrameStyle = (document?: HTMLDocument) => {
  // useMount(() => {
  //   updateIframeStyle(document)
  // })
  useMutationObserver(
    () => {
      updateIframeStyle(document)
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
