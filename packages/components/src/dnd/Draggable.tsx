import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { appliedStyles, cns } from '@stcland/utils'
import { useCustomDndContext } from '.'
import type { DndStyles } from 'src/styles'

//*****************************************************************************
// Interface
//*****************************************************************************

export interface DraggableProps {
  id: string;
  children: React.ReactNode;
  onRemove?: (id: string) => void;
  bgColorClass?: string // Tailwind bg-color class
  className?: string; // Additional classes applied to the root.
  icon?: React.ReactNode
}

//*****************************************************************************
// Components
//*****************************************************************************

const Draggable = ({ id, children, bgColorClass, className, onRemove, icon }: DraggableProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id })
  const { customStyles } = useCustomDndContext()

  const draggableStyles: DndStyles['draggable'] = {
    root: 'cursor-grab  p-2 mb-1 relative rounded-lg text-white transition-opacity flex items-center justify-between',
    bgColorClass: 'bg-gray-825',
    dragging: 'opacity-5',
    content: 'flex-1',
    iconContainer: 'mr-2 cursor-pointer',
    removeButton: 'w-6 h-6 text-gray-300 hover:text-gray-500',
  }

  const mergedStyles = appliedStyles(draggableStyles, customStyles?.draggable)

  const cn = {
    root: cns(mergedStyles.root, isDragging && mergedStyles.dragging, bgColorClass ?? mergedStyles.bgColorClass, className),
    content: mergedStyles.content,
    removeButton: mergedStyles.removeButton,
    iconContainer: icon ? mergedStyles.iconContainer : ''
  }

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onRemove) {
      onRemove(id)
    }
  }

  return (
    <div
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
      }}
      className={cn.root}
    >
      {/* Icon: This will not be part of the draggable area */}
      {icon &&
        <div className={cn.iconContainer}>
          {icon}
        </div>
      }

      {/* Draggable Content: This is the actual draggable part */}
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className={cn.content}
      >
        {children}
      </div>
      {/* Remove Button: This will not be part of the draggable area */}
      {onRemove && (
        <button
          onClick={handleRemoveClick}
          className={cn.removeButton}
          aria-label="Remove item"
        >
          ✕
        </button>
      )}
    </div>
  )
}

export default Draggable
