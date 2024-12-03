import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { cns, appliedStyles } from '@stcland/utils'
import { useCustomDndContext } from '.'
import type { DndStyles } from 'src/styles'

//*****************************************************************************
// Interface
//*****************************************************************************

export interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  onRemove?: (id: string) => void;
  bgColorClass?: string // Talwind bg-color class.
  className?: string; // Additional classes applied to the root.
}

//*****************************************************************************
// Components
//*****************************************************************************

const SortableItem = ({ id, children, onRemove, bgColorClass, className }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const { customStyles } = useCustomDndContext()

  const sortableItemStyles: DndStyles['sortableItem'] = {
    root: 'relative mb-1 p-2 rounded-lg text-white transition-opacity flex items-center justify-between',
    bgColorClass: 'bg-gray-825',
    dragging: 'opacity-50',
    content: 'flex-1',
    removeButton: 'w-6 h-6 text-gray-300 hover:text-gray-500',
  }

  const mergedStyles = appliedStyles(sortableItemStyles, customStyles?.sortableItem)

  const cn = {
    root: cns(mergedStyles.root, isDragging && mergedStyles.dragging, bgColorClass ?? mergedStyles.bgColorClass, className),
    content: mergedStyles.content,
    removeButton: mergedStyles.removeButton
  }

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onRemove) {
      onRemove(id)
    }
  }

  return  (
    <div
      className={cn.root}
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
      }}
    >

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

export default SortableItem
