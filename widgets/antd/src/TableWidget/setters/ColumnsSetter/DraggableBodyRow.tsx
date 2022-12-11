import { FC, HTMLAttributes, useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'

const type = 'DraggableBodyRow'
interface DraggableBodyRowProps extends HTMLAttributes<HTMLTableRowElement> {
  index: number
  moveRow: (dragIndex: number, hoverIndex: number) => void
}
export const DraggableBodyRow: FC<DraggableBodyRowProps> = ({
  index,
  moveRow,
  className,
  style,
  ...restProps
}) => {
  const ref = useRef<HTMLTableRowElement>(null)
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || {}
      if (dragIndex === index) {
        return {}
      }
      return {
        isOver: monitor.isOver(),
        dropClassName:
          dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      }
    },
    drop: (item: { index: number }) => {
      moveRow(item.index, index)
    },
  })
  const [, drag] = useDrag({
    type,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })
  drop(drag(ref))

  return (
    <tr
      ref={ref}
      className={`${className ?? ''}${isOver ? dropClassName : ''}`}
      style={{ cursor: 'move', ...style }}
      {...restProps}
    />
  )
}
