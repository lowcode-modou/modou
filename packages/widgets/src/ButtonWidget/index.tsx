import { FC, useEffect } from 'react'
import { ButtonWidgetState } from './types'
import { Button } from 'antd'

export * from './metadata'
export const ButtonWidget: FC<ButtonWidgetState> = ({
  block,
  danger,
  disabled,
  ghost,
  // href,
  loading,
  shape,
  size,
  type,
  title,
  instance,
}) => {
  useEffect(() => {
    console.log('我是按钮 我重新渲染了', block)
  })
  return (
    <Button
      data-widget-id={instance.widgetId}
      block={block}
      danger={danger}
      disabled={disabled}
      ghost={ghost}
      // href={href === '' ? undefined : href}
      loading={loading}
      shape={shape}
      size={size}
      type={type}
    >
      {title}
    </Button>
  )
}
