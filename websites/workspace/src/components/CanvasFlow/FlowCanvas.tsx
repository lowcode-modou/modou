import { FC } from 'react'

import { mcss } from '@modou/css-in-js'
import { FlowDesigner } from '@modou/flow-designer'
import { FlowFile } from '@modou/meta-vfs/src/FlowFile'

export const FlowCanvas: FC<{ file: FlowFile }> = ({ file }) => {
  return (
    <div className={classes.wrapper}>
      <FlowDesigner file={file} />
    </div>
  )
}

const classes = {
  wrapper: mcss`
    height: 100%;
    flex: 1;
    border: 1px solid red;
  `,
}
