import { Button, Space } from 'antd'
import { type FC } from 'react'
import { NodeProps } from 'reactflow'

import { generateId } from '@modou/core'
import {
  FlowNodeFile,
  FlowNodeFileMeta,
} from '@modou/meta-vfs/src/FlowNodeFile'
import { runInAction } from '@modou/reactivity'
import { observer } from '@modou/reactivity-react'
import { mr } from '@modou/refine'

import { FlowNodeHandles } from '../_/components/FlowNodeHandles'
import { FlowNodeWrapper } from '../_/components/FlowNodeWrapper'
import { CaseBlock } from './CaseBlock'
import { DEFAULT_LASE_ELSE_SCRIPT } from './constants'
import { MRSchemeBranchNodeProps, branchNodeNodeMetadata } from './metadata'

const _BranchNode: FC<
  NodeProps<
    FlowNodeFile<FlowNodeFileMeta<mr.infer<typeof MRSchemeBranchNodeProps>>>
  >
> = (props) => {
  console.log('_BranchNode')

  return (
    <>
      <FlowNodeWrapper meta={branchNodeNodeMetadata} node={props}>
        <Space direction="vertical" style={{ display: 'flex' }}>
          {props.data.meta.props.branches.map((branch, index, branches) => (
            <CaseBlock
              key={branch.port}
              isHead={index === 0}
              isLast={index === branches.length - 1}
              onlyOne={branches.length === 1}
              branch={branch}
              onChangeBranch={(branch) => {
                runInAction(() => {
                  props.data.meta.props.branches =
                    props.data.meta.props.branches.map((br) => {
                      if (br.port !== branch.port) {
                        return br
                      }
                      return branch
                    })
                })
              }}
              onDeleteBranch={(branch) => {
                // TODO 删除 branch 的同时删除相关的边
                runInAction(() => {
                  props.data.meta.props.branches =
                    props.data.meta.props.branches
                      .filter((br) => br.port !== branch.port)
                      .map((br, index) => {
                        if (
                          index === 0 &&
                          br.script === DEFAULT_LASE_ELSE_SCRIPT
                        ) {
                          return {
                            ...br,
                            script: '',
                          }
                        }
                        return br
                      })
                  props.data.meta.sources = props.data.meta.sources.filter(
                    (s) => s.name !== branch.port,
                  )
                })
              }}
            />
          ))}
          <Button
            block
            type="primary"
            onClick={() => {
              const portId = generateId()
              runInAction(() => {
                props.data.meta.sources.push({
                  name: portId,
                })
                props.data.meta.props.branches =
                  props.data.meta.props.branches.map((branch) => ({
                    ...branch,
                    script:
                      branch.script === DEFAULT_LASE_ELSE_SCRIPT
                        ? ''
                        : branch.script,
                  }))
                props.data.meta.props.branches.push({
                  port: portId,
                  script: DEFAULT_LASE_ELSE_SCRIPT,
                })
              })
            }}
          >
            添加分支
          </Button>
        </Space>
      </FlowNodeWrapper>
      <FlowNodeHandles
        sources={[]}
        targets={props.data.meta.targets}
        isConnectable={props.isConnectable}
      />
    </>
  )
}
export const BranchNode = observer(_BranchNode)
