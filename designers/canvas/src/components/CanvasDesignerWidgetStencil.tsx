import { FC, useContext, useEffect, useMemo, useRef } from 'react'
import {
  WidgetMetadata,
  WidgetBaseProps,
  AppFactoryContext,
  WidgetGroupEnum,
  AppFactory,
} from '@modou/core'
import { Card, Col, Row, Typography } from 'antd'
import { useDrag } from 'react-dnd'
import { generateId, getWidgetGroupLabel } from '@modou/core/src/utils'
import { WidgetDragType } from '../types'
import { isEmpty } from 'lodash'

const WidgetBlock: FC<{
  metadata: WidgetMetadata
}> = ({ metadata }) => {
  const widgetFactory = useContext(AppFactoryContext)
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: metadata.widgetType,
    item: () => {
      const widget = WidgetMetadata.mrSchemeToDefaultJson(
        widgetFactory.widgetByType[metadata.widgetType].metadata
          .jsonPropsSchema,
      )
      const newWidget: WidgetBaseProps = {
        ...widget,
        widgetId: generateId(),
        widgetName: `${widget.widgetName}-${generateId(4)}`,
      }
      return {
        type: WidgetDragType.Add,
        widget: newWidget,
      }
    },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<WidgetBaseProps>()
      if (item && dropResult) {
        // console.log(item, dropResult)
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
    options: {
      dropEffect: 'copy',
    },
  }))

  const previewRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    preview(previewRef, {
      offsetX: 0,
      offsetY: 0,
    })
  }, [preview])

  const opacity = isDragging ? 0.3 : 1
  return (
    <Col className="bg-white" style={{ opacity }} span={12}>
      <Card
        ref={previewRef}
        size="small"
        className="text-center cursor-move select-none overflow-hidden absolute z-0"
        style={{
          fontSize: '12px',
        }}
        bodyStyle={{
          padding: '4px',
          width: '80px',
          backgroundColor: 'rgba(0,0,0,.04)',
        }}
      >
        <div style={{ fontSize: '14px', lineHeight: '14px' }}>
          {metadata.icon}
        </div>
        <div>{metadata.widgetName}</div>
      </Card>
      <Card
        ref={drag}
        size="small"
        className="text-center cursor-move select-none overflow-hidden"
        bodyStyle={{
          padding: '8px 0',
          backgroundColor: 'rgba(0,0,0,.04)',
        }}
      >
        <div style={{ fontSize: '24px', lineHeight: '24px' }}>
          {metadata.icon}
        </div>
        <div>{metadata.widgetName}</div>
      </Card>
    </Col>
  )
}

export const CanvasDesignerWidgetStencil: FC = () => {
  const widgetFactory = useContext(AppFactoryContext)
  const widgetsByGroup = useMemo(() => {
    return Object.values(widgetFactory.widgetByType).reduce<
      Record<
        WidgetGroupEnum,
        {
          name: string
          widgets: ConstructorParameters<typeof AppFactory>[0]['widgets']
        }
      >
    >(
      (pre, cur) => {
        if (!isEmpty(pre[cur.group])) {
          pre[cur.group].widgets.push(cur)
        } else {
          pre[cur.group] = {
            name: getWidgetGroupLabel(cur.group),
            widgets: [cur],
          }
        }
        return pre
      },
      {
        [WidgetGroupEnum.Container]: {
          name: getWidgetGroupLabel(WidgetGroupEnum.Container),
          widgets: [],
        },
        [WidgetGroupEnum.Input]: {
          name: getWidgetGroupLabel(WidgetGroupEnum.Input),
          widgets: [],
        },
        [WidgetGroupEnum.Button]: {
          name: getWidgetGroupLabel(WidgetGroupEnum.Button),
          widgets: [],
        },
      },
    )
  }, [widgetFactory.widgetByType])
  // console.log('widgetsByGroup', widgetsByGroup)
  return (
    <div style={{ padding: '16px' }}>
      {Object.entries(widgetsByGroup).map(([group, { name, widgets }]) => (
        <div style={{ marginBottom: '16px' }} key={group}>
          <Typography.Title level={5}>{name}</Typography.Title>
          <Row gutter={[8, 8]}>
            {widgets.map(({ metadata }) => {
              return (
                <WidgetBlock metadata={metadata} key={metadata.widgetType} />
              )
            })}
          </Row>
        </div>
      ))}
    </div>
  )
}
