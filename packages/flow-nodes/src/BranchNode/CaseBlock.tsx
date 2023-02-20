import { DeleteOutlined } from '@ant-design/icons'
import { Button, Space } from 'antd'
import { FC, useMemo } from 'react'
import { Handle, Position } from 'reactflow'

import { CodeEditor, CodeEditorModeEnum } from '@modou/code-editor'
import { cx, mcss } from '@modou/css-in-js'

import { nodeClasses } from '../_/styles'
import { DEFAULT_LASE_ELSE_SCRIPT } from './constants'

interface Branch {
  script: string
  port: string
}
export const CaseBlock: FC<{
  branch: Branch
  onChangeBranch: (branch: Branch) => void
  onDeleteBranch: (branch: Branch) => void
  isHead: boolean
  isLast: boolean
  onlyOne: boolean
}> = ({ branch, isHead, isLast, onChangeBranch, onlyOne, onDeleteBranch }) => {
  const hiddenCodeEditor = useMemo(() => {
    return isLast && branch.script === DEFAULT_LASE_ELSE_SCRIPT
  }, [branch.script, isLast])
  return (
    <div className={classes.wrapper}>
      <div className={classes.header}>
        {isHead && <div className={classes.label}>If</div>}
        {!isHead && !isLast && <div className={classes.label}>Else If</div>}
        {!onlyOne && isLast && (
          <div className={classes.label}>
            <Space>
              <span
                className={cx({
                  inactive: !hiddenCodeEditor,
                })}
                onClick={() => {
                  onChangeBranch({
                    ...branch,
                    script: DEFAULT_LASE_ELSE_SCRIPT,
                  })
                }}
              >
                Else
              </span>
              <span
                className={cx({
                  inactive: hiddenCodeEditor,
                })}
                onClick={() => {
                  onChangeBranch({
                    ...branch,
                    script: '',
                  })
                }}
              >
                Else If
              </span>
            </Space>
          </div>
        )}

        {!onlyOne && (
          <Button
            type="text"
            danger
            size="small"
            onClick={() => onDeleteBranch(branch)}
          >
            <DeleteOutlined />
          </Button>
        )}
      </div>
      {!hiddenCodeEditor && (
        <div>
          {/* @ts-expect-error */}
          <CodeEditor
            mode={CodeEditorModeEnum.Javascript}
            value={branch.script}
            onChange={(value) => {
              onChangeBranch({
                ...branch,
                script: value,
              })
            }}
          />
        </div>
      )}
      <Handle
        type="source"
        id={branch.port}
        position={Position.Right}
        className={cx(nodeClasses.nodeSourcePort, classes.sourcePort)}
      />
    </div>
  )
}

const classes = {
  wrapper: mcss`
    background-color: rgba(0,0,0,.08);
    border-radius: 6px;
    padding: 6px;
    position: relative;
  `,
  header: mcss`
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,
  label: mcss`
    font-weight: bold;
    .inactive{
      color: #888888;
    }
  `,
  sourcePort: mcss`
    right: -21px!important;
  `,
}
