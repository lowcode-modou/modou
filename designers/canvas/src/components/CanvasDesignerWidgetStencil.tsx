import { Card, Col, Row, Typography } from 'antd'
import { isEmpty } from 'lodash'
import { FC, useContext, useEffect, useMemo, useRef } from 'react'
import { useDrag } from 'react-dnd'

import {
  AppFactory,
  AppFactoryContext,
  WidgetBaseProps,
  WidgetGroupEnum,
  WidgetMetadata,
} from '@modou/core'
import { generateId, getWidgetGroupLabel } from '@modou/core/src/utils'
import { mcss } from '@modou/css-in-js'

import { WidgetDragType } from '../types'

const WidgetBlock: FC<{
  metadata: WidgetMetadata<any, any>
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
      console.log('drag_end', item, dropResult)
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
    <Col className={classes.widgetWrapper} style={{ opacity }} span={12}>
      <Card
        ref={previewRef}
        size="small"
        className={`${classes.widget} ${classes.previewWidget}`}
        style={{
          fontSize: '12px',
        }}
        bodyStyle={{
          padding: '4px',
          width: '80px',
          backgroundColor: 'rgba(0,0,0,.04)',
        }}
      >
        <div className={classes.previewWidgetIcon}>{metadata.icon}</div>
        <div>{metadata.widgetName}</div>
      </Card>
      <Card
        ref={drag}
        size="small"
        className={classes.widget}
        bodyStyle={{
          padding: '8px 0',
          backgroundColor: 'rgba(0,0,0,.04)',
        }}
      >
        <div className={classes.widgetIcon}>{metadata.icon}</div>
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
    <div>
      {Object.entries(widgetsByGroup).map(([group, { name, widgets }]) => (
        <div className={classes.widgetsPanel} key={group}>
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

const classes = {
  widgetWrapper: mcss`
    background-color: white;
  `,
  widget: mcss`
    text-align: center;
    cursor: move;
    user-select: none;
    overflow: hidden;
  `,
  previewWidget: mcss`
		position: absolute;
		z-index: 0;
  `,
  previewWidgetIcon: mcss`
    font-size: 14px;
    line-height: 14px;
  `,
  widgetIcon: mcss`
    font-size: 24px;
    line-height: 24px;
  `,
  widgetsPanel: mcss`
    padding: 16px;
  `,
  widgetGroup: mcss`
    padding: 16px;
  `,
}
