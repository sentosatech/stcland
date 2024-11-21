import React from 'react'
import { SortableContext } from '@dnd-kit/sortable'
import type { SortingStrategy } from '@dnd-kit/sortable'
import { verticalListSortingStrategy, horizontalListSortingStrategy, rectSortingStrategy } from '@dnd-kit/sortable'
import { useCustomDndContext } from '.'
import type { DndStyles } from 'src/styles'
import { appliedStyles } from '@stcland/utils'

//*****************************************************************************
// Interface
//*****************************************************************************

type StrategyName = 'grid' | 'vertical' | 'horizontal'

export interface SortableListProps {
  items: string[]
  children: React.ReactNode
  strategy?: StrategyName
}

const strategyMap: Record<StrategyName, SortingStrategy> = {
  grid: rectSortingStrategy,
  vertical: verticalListSortingStrategy,
  horizontal: horizontalListSortingStrategy,
}

//*****************************************************************************
// Components
//*****************************************************************************

const SortableList: React.FC<SortableListProps> = ({ items, strategy = 'vertical', children }) => {
  const { customStyles } = useCustomDndContext()

  const resolvedStrategy = strategyMap[strategy]

  const sortableListStyles: DndStyles['sortableList'] = {
    grid: 'grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-md'
  }

  const mergedStyles = appliedStyles(sortableListStyles, customStyles?.sortableList)

  const cn = {
    grid: strategy === 'grid' ? mergedStyles.grid : ''
  }

  return (
    <div className={cn.grid}>
      <SortableContext items={items} strategy={resolvedStrategy}>
        {children}
      </SortableContext>
    </div>
  )
}

export default SortableList