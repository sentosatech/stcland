import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { appliedStyles, cns } from '@stcland/utils'
import { useCustomDndContext } from '.'
import type { DndStyles } from 'src/styles'

//*****************************************************************************
// Interface
//*****************************************************************************

export interface DroppableProps {
  id: string;
  children: React.ReactNode;
  className?: string; // Additional classes applied to the root.
}

//*****************************************************************************
// Components
//*****************************************************************************

const Droppable = ({ id, children, className }: DroppableProps) => {
  const { setNodeRef, isOver } = useDroppable({ id })
  const { customStyles } = useCustomDndContext()

  const droppableStyles: DndStyles['droppable'] = {
    root: '',
    dropping: 'opacity-50'
  }

  const mergedStyles = appliedStyles(droppableStyles, customStyles?.droppable)

  const cn = {
    root: cns(mergedStyles.root, isOver && mergedStyles.dropping, className)
  }

  return (
    <div
      ref={setNodeRef}
      className={cn.root}
    >
      {children}
    </div>
  )
}

export default Droppable
