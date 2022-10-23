import { FC, ReactNode } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { FrameContextConsumer } from 'react-frame-component'

export const FrameBindingContext: FC<{ children: ReactNode }> = ({
  children,
}) => (
  <FrameContextConsumer>
    {({ window, document }: any) => (
      <DndProvider backend={HTML5Backend} context={window}>
        {children}
      </DndProvider>
    )}
  </FrameContextConsumer>
)
