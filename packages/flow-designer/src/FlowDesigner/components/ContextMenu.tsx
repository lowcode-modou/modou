import { useClickAway } from 'ahooks'
import { Card } from 'antd'
import { FC, useRef } from 'react'
import { useReactFlow } from 'reactflow'

import { useAppFactory } from '@modou/asset-vfs'
import { FlowNodeMetadata } from '@modou/core'
import { mcss } from '@modou/css-in-js'
import { FlowNodeEnum } from '@modou/flow-nodes'
import { FlowFile } from '@modou/meta-vfs/src/FlowFile'
import { FlowNodeFile } from '@modou/meta-vfs/src/FlowNodeFile'
import { generateId } from '@modou/shared'

export const ContextMenu: FC<{
  position: { x: number; y: number }
  open: boolean
  setOpen: (open: boolean) => void
  file: FlowFile
}> = ({ position, open, file, setOpen }) => {
  const { appFactory } = useAppFactory()

  const { project } = useReactFlow()

  const flowNodes = Object.values(appFactory.flowNodeByType).filter(
    (node) =>
      ![FlowNodeEnum.START_NODE].includes(
        node.metadata.type as unknown as FlowNodeEnum,
      ),
  )

  const wrapperRef = useRef<HTMLDivElement>(null)

  useClickAway(() => {
    setOpen(false)
  }, wrapperRef)

  return open ? (
    <Card
      ref={wrapperRef}
      size={'small'}
      className={classes.wrapper}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {flowNodes.map((node) => (
        <div
          key={node.metadata.type}
          className={classes.node}
          onClick={() => {
            console.log('position', position)
            FlowNodeFile.create(
              {
                ...FlowNodeMetadata.mrSchemeToDefaultJson(
                  appFactory.flowNodeByType[node.metadata.type].metadata
                    .jsonPropsSchema,
                ),
                id: generateId(),
                position: project({
                  x: position.x,
                  y: position.y,
                }),
              },
              file,
            )
            setOpen(false)
          }}
        >
          {node.metadata.name}
        </div>
      ))}
    </Card>
  ) : null
}

const classes = {
  wrapper: mcss`
    position: absolute;
    left: 0;
    top: 0;
    z-index: 999999;
    .ant-card-body{
      padding: 0;
    }
  `,
  node: mcss`
    font-size: 12px;
    padding: 4px 16px;
    cursor: default;
    &+&{
      border-top: 1px solid rgba(0,0,0,.1);
    }
  `,
}
