// 获取DOM到窗口 X Y 轴距离
export const getMonitorWall = (element: HTMLElement) => {
  let ele: HTMLElement | null = element
  let left = ele.offsetLeft
  let top = ele.offsetTop
  while (ele.offsetParent !== null) {
    ele = ele.offsetParent as unknown as HTMLElement
    left += ele.offsetLeft
    top += ele.offsetTop
  }
  return {
    left,
    top,
  }
}
