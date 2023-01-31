import { Typography } from 'antd'
import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  widgetName: string
  widgetId: string
}
interface State {
  hasError: boolean
  errorMessage: string
}
const initialState = { hasError: false, errorMessage: '' }

export class WidgetErrorBoundary extends Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props)
    this.state = { ...initialState }
  }

  updatedWithError = false

  // eslint-disable-next-line n/handle-callback-err
  static getDerivedStateFromError(error: Error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true, errorMessage: error.message }
  }

  // componentDidCatch(error, errorInfo) {
  //   // 你同样可以将错误日志上报给服务器
  //   // logErrorToMyService(error, errorInfo)
  // }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>,
    snapshot?: any,
  ) {
    // 已经存在错误，并且是第一次由于 error 而引发的 render/update，那么设置 flag=true，不会重置
    if (this.state.hasError && !this.updatedWithError) {
      this.updatedWithError = true
      return
    }
    // 已经存在错误，并且是普通的组件 render，则检查 resetKeys 是否有改动，改了就重置
    if (this.state.hasError) {
      this.reset()
    }
  }

  reset = () => {
    this.updatedWithError = false
    this.setState(initialState)
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return (
        <div data-widget-root data-widget-id={this.props.widgetId}>
          <Typography.Text type="danger">
            【{this.props.widgetName}】渲染错误
          </Typography.Text>
          <br />
          <Typography.Text type="danger">
            错误信息：{this.state.errorMessage}
          </Typography.Text>
        </div>
      )
    }

    return this.props.children
  }
}
