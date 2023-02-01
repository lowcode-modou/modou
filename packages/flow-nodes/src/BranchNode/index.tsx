import { Button, Space } from 'antd'
import produce from 'immer'
import { type FC, memo } from 'react'
import { NodeProps } from 'reactflow'

import { generateId } from '@modou/core'
import { mr } from '@modou/refine'

import { FlowNodeHandles } from '../_/components/FlowNodeHandles'
import { FlowNodeWrapper } from '../_/components/FlowNodeWrapper'
import { useFlowNodeId } from '../_/hooks'
import { FlowNodeProps } from '../_/types'
import { CaseBlock } from './CaseBlock'
import { DEFAULT_LASE_ELSE_SCRIPT } from './constants'
import { MRSchemeBranchNodeProps, branchNodeNodeMetadata } from './metadata'

const _BranchNode: FC<
  NodeProps<FlowNodeProps<mr.infer<typeof MRSchemeBranchNodeProps>>>
> = (props) => {
  const id = useFlowNodeId()
  console.log('_BranchNode')

  return (
    <>
      <FlowNodeWrapper meta={branchNodeNodeMetadata} node={props}>
        <Space direction="vertical" style={{ display: 'flex' }}>
          {props.data.props.branches.map((branch, index, branches) => (
            <CaseBlock
              key={branch.port}
              isHead={index === 0}
              isLast={index === branches.length - 1}
              onlyOne={branches.length === 1}
              branch={branch}
              onChangeBranch={(branch) => {
                props.data._onChangeNode({
                  id,
                  data: {
                    ...props.data,
                    props: {
                      ...props.data.props,
                      branches: props.data.props.branches.map((br) => {
                        if (br.port !== branch.port) {
                          return br
                        }
                        return branch
                      }),
                    },
                  },
                })
              }}
              onDeleteBranch={(branch) => {
                // TODO 删除 branch 的同时删除相关的边
                props.data._onChangeNode({
                  id,
                  data: produce(props.data, (draft) => {
                    draft.props.branches = draft.props.branches
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
                    draft.sources = draft.sources.filter(
                      (s) => s.name !== branch.port,
                    )
                  }),
                })
              }}
            />
          ))}
          <Button
            block
            type="primary"
            onClick={() => {
              const portId = generateId()
              props.data._onChangeNode({
                id,
                data: produce(props.data, (draft) => {
                  draft.sources.push({
                    name: portId,
                  })
                  draft.props.branches = draft.props.branches.map((branch) => ({
                    ...branch,
                    script:
                      branch.script === DEFAULT_LASE_ELSE_SCRIPT
                        ? ''
                        : branch.script,
                  }))
                  draft.props.branches.push({
                    port: portId,
                    script: DEFAULT_LASE_ELSE_SCRIPT,
                  })
                }),
              })
            }}
          >
            添加分支
          </Button>
        </Space>
      </FlowNodeWrapper>
      <FlowNodeHandles {...props} filterSources={() => false} />
    </>
  )
}
export const BranchNode = memo(_BranchNode)
