import { FC, useContext, useMemo } from 'react'
import { WidgetMetadata, WidgetBaseProps, WidgetFactoryContext, WidgetGroupEnum, AppFactory } from '@modou/core'
import { Card, Col, Row, Typography } from 'antd'
import { useDrag } from 'react-dnd'
import { generateId, getWidgetGroupLabel } from '@modou/core/src/utils'
import { WidgetDragType } from '../types'
import { isArray, isEmpty } from 'lodash'
import { object } from '@recoiljs/refine'

const WidgetBlock: FC<{
  metadata: WidgetMetadata
}> = ({ metadata }) => {
  const widgetFactory = useContext(WidgetFactoryContext)
  const [{ isDragging }, drag] = useDrag(() => ({
    type: metadata.widgetType,
    item: () => ({
      type: WidgetDragType.Add,
      widget: {
        ...WidgetMetadata.mrSchemeToDefaultJson(widgetFactory.widgetByType[metadata.widgetType].metadata.jsonPropsSchema),
        widgetId: generateId()
      }
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<WidgetBaseProps>()
      if (item && dropResult) {
        // console.log(item, dropResult)
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId()
    }),
    options: {
      dropEffect: 'copy'
    }
  }))

  const opacity = isDragging ? 0.3 : 1
  return <Col
    className='bg-white'
    style={{ opacity }}
    span={12}>
    <Card
      ref={drag}
      size='small'
      className='text-center cursor-move select-none overflow-hidden'
      bodyStyle={{
        padding: '8px 0',
        backgroundColor: 'rgba(0,0,0,.04)'
      }}
    >
      <div style={{ fontSize: '24px', lineHeight: '24px' }}>{metadata.icon}</div>
      <div>{metadata.widgetName}</div>
    </Card>
  </Col>
}

export const CanvasDesignerWidgetStencil: FC = () => {
  const widgetFactory = useContext(WidgetFactoryContext)
  const widgetsByGroup = useMemo(() => {
    return Object.values(widgetFactory.widgetByType).reduce<Record<WidgetGroupEnum, {
      name: string
      widgets: ConstructorParameters<typeof AppFactory>[0]['widgets']
    }>>((pre, cur) => {
      if (!isEmpty(pre[cur.group])) {
        pre[cur.group].widgets.push(cur)
      } else {
        pre[cur.group] = {
          name: getWidgetGroupLabel(cur.group),
          widgets: [cur]
        }
      }
      return pre
    }, {
      [WidgetGroupEnum.Container]: {
        name: getWidgetGroupLabel(WidgetGroupEnum.Container),
        widgets: []
      },
      [WidgetGroupEnum.Input]: {
        name: getWidgetGroupLabel(WidgetGroupEnum.Input),
        widgets: []
      },
      [WidgetGroupEnum.Button]: {
        name: getWidgetGroupLabel(WidgetGroupEnum.Button),
        widgets: []
      }
    })
  }, [widgetFactory.widgetByType])
  return <div style={{ padding: '16px' }}>
    {
      Object.entries(widgetsByGroup).map(([group, { name, widgets }]) =>
        <div style={{ marginBottom: '16px' }} key={group}>
          <Typography.Title level={5}>{name}</Typography.Title>
          <Row
            gutter={[8, 8]}>
            {
              widgets.map(({ metadata }) => {
                return <WidgetBlock metadata={metadata} key={metadata.widgetType} />
              })
            }
          </Row>
        </div>)
    }
  </div>
}
