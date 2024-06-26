import { Tabs } from 'antd'
import { FC, ReactElement } from 'react'

import { mcss } from '@modou/css-in-js'
import { observer } from '@modou/reactivity-react'

import { useCanvasDesignerStore } from '../contexts/CanvasDesignerStoreContext'
import { CanvasDesignerCanvas } from './CanvasDesignerCanvas'
import { CanvasDesignerOutlineTree } from './CanvasDesignerOutlineTree'
import { CanvasDesignerPropsPanel } from './CanvasDesignerPropsPanel'
import { CanvasDesignerWidgetStencil } from './CanvasDesignerWidgetStencil'

const _CanvasDesignerImpl: FC<{ children: ReactElement }> = ({ children }) => {
  const { canvasDesignerStore } = useCanvasDesignerStore()
  return (
    <div className={classes.wrapper}>
      <div className={`${classes.section} ${classes.sectionLeft}`}>
        <Tabs
          className={classes.designerPanelTabs}
          type="card"
          tabBarGutter={0}
          items={[
            {
              key: 'CanvasDesignerOutlineTree',
              label: '大纲树',
              children: <CanvasDesignerOutlineTree />,
            },
          ]}
        />
      </div>
      <div
        className={`${classes.section} ${classes.canvasWrapper}`}
        onClick={() => canvasDesignerStore.setSelectedWidgetId('')}
      >
        <CanvasDesignerCanvas>{children}</CanvasDesignerCanvas>
      </div>
      <div className={`${classes.section} ${classes.sectionRight}`}>
        <Tabs
          className={classes.designerPanelTabs}
          type="card"
          tabBarGutter={0}
          items={[
            {
              key: 'CanvasDesignerPropsPanel',
              label: '属性',
              children: <CanvasDesignerPropsPanel />,
            },
            {
              key: 'CanvasDesignerWidgetStencil',
              label: '组件列表',
              children: <CanvasDesignerWidgetStencil />,
            },
          ]}
        />
      </div>
    </div>
  )
}

export const CanvasDesignerImpl = observer(_CanvasDesignerImpl)
const classes = {
  wrapper: mcss`
    height: 100%;
    display: flex;
    justify-content: space-between;
  `,
  section: mcss`
    height: 100%;
    background-color: white;
  `,
  sectionLeft: mcss`
    width: 220px;
  `,
  sectionRight: mcss`
    width: 280px;
  `,
  canvasWrapper: mcss`
		position: relative;
    flex: 1;
    border: 1px solid rgba(0,0,0,.05);
    border-top: none;
    border-bottom: 0;
  `,
  designerPanelTabs: mcss`
    height: 100%;
		& > .ant-tabs-nav {
			margin-bottom: 0;
		}
		& .ant-tabs-nav-list {
			display: flex;
			width: 100%;
			& .ant-tabs-tab {
				flex: 1;
				border-radius: 0 !important;
				display: flex;
				justify-content: center;
				align-items: center;
				&.ant-tabs-tab-active {
					border-bottom-color: rgba(5, 5, 5, 0.13) !important;
				}
			}
		}
    & .ant-tabs-content-holder{
      height: 100%;
      overflow-y: auto;
    }
  `,
}
