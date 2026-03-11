import React, { useState } from 'react'
import { Meta, StoryFn } from '@storybook/react'
import { DragDropProvider, SortableList, SortableItem,
  Draggable, Droppable, arrayMove, StcStylesProvider, Tooltip } from '@stcland/components'
import { DragDropProvider as DragDropProviderWithStyles } from '@stcland/components/withStyles'
import customStyles from '../stc.config'
import { Icon } from '@stcland/components/icon'

const meta: Meta = {
  title: 'Components/DragAndDrop',
  component: SortableList,
}

export default meta

// Sortable Example
const SortableExample: StoryFn = () => {
  const [items, setItems] = useState([
    { id: 'item-1', name: 'Item 1' },
    { id: 'item-2', name: 'Item 2' },
    { id: 'item-3', name: 'Item 3' },
  ])

  const handleDragEnd = ({ active, over }: { active: { id: string }; over: { id: string } | null }) => {
    if (!over || active.id === over.id) return

    setItems((prevItems) => {
      const oldIndex = prevItems.findIndex((item) => item.id === active.id)
      const newIndex = prevItems.findIndex((item) => item.id === over.id)
      return arrayMove(prevItems, oldIndex, newIndex)
    })
  }

  return (
    <DragDropProvider onDragEnd={handleDragEnd as any}>
      <SortableList items={items.map((item) => item.id)}>
        {items.map((item) => (
          <SortableItem key={item.id} id={item.id}>
            {item.name}
          </SortableItem>
        ))}
      </SortableList>
    </DragDropProvider>
  )
}

export const SortableListExample = SortableExample


// Sortable with Remove Button
export const SortableWithRemoveButton: StoryFn = () => {
  const [items, setItems] = useState([
    { id: 'item-1', name: 'Item 1' },
    { id: 'item-2', name: 'Item 2' },
    { id: 'item-3', name: 'Item 3' },
  ])

  const handleDragEnd = ({ active, over }: { active: { id: string }; over: { id: string } | null }) => {
    if (!over || active.id === over.id) return

    setItems((prevItems) => {
      const oldIndex = prevItems.findIndex((item) => item.id === active.id)
      const newIndex = prevItems.findIndex((item) => item.id === over.id)
      return arrayMove(prevItems, oldIndex, newIndex)
    })
  }

  const handleRemove = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  return (
    <div className='ml-40'>
      <DragDropProvider onDragEnd={handleDragEnd as any}>
        <SortableList items={items.map((item) => item.id)}>
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id} onRemove={handleRemove} icon={<Tooltip
              placement='left'
              trigger='click'
              title='I am a tooltip!'>
              <Icon solid sm iconName='InformationCircleIcon' className='p-0'/>
            </Tooltip>}>
              {item.name}
            </SortableItem>
          ))}
        </SortableList>
      </DragDropProvider>
    </div>
  )
}

// Sortable Example with Grid Layout
export const SortableGridExample: StoryFn = () => {
  const [items, setItems] = useState([
    { id: 'item-1', name: 'Item 1' },
    { id: 'item-2', name: 'Item 2' },
    { id: 'item-3', name: 'Item 3' },
    { id: 'item-4', name: 'Item 4' },
    { id: 'item-5', name: 'Item 5' },
    { id: 'item-6', name: 'Item 6' },
  ])

  const handleDragEnd = ({ active, over }: { active: { id: string }; over: { id: string } | null }) => {
    if (!over || active.id === over.id) return

    setItems((prevItems) => {
      const oldIndex = prevItems.findIndex((item) => item.id === active.id)
      const newIndex = prevItems.findIndex((item) => item.id === over.id)
      return arrayMove(prevItems, oldIndex, newIndex)
    })
  }

  return (
    <DragDropProvider onDragEnd={handleDragEnd as any}>
      <SortableList
        items={items.map((item) => item.id)}
        strategy='grid'
      >
        {items.map((item) => (
          <SortableItem
            key={item.id}
            id={item.id}
            className="flex items-center justify-center bg-primary-range-200  text-gray-825 border rounded-md shadow-sm hover:bg-gray-300"
          >
            {item.name}
          </SortableItem>
        ))}
      </SortableList>
    </DragDropProvider>
  )
}
// Draggable and Droppable Example
const DraggableDroppableExample: StoryFn = () => {
  const [items, setItems] = useState([
    { id: 'item-1', content: 'Draggable Item 1' },
    { id: 'item-2', content: 'Draggable Item 2' },
    { id: 'item-3', content: 'Draggable Item 3' },
  ])

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex((item) => item.id === active.id)
    const newIndex = items.findIndex((item) => item.id === over.id)

    const updatedItems = [...items]
    const [movedItem] = updatedItems.splice(oldIndex, 1)
    updatedItems.splice(newIndex, 0, movedItem)

    setItems(updatedItems)
  }

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      {items.map((item) => (
        <Droppable
          key={item.id}
          id={item.id}
        >
          <Draggable id={item.id}>
            {item.content}
          </Draggable>
        </Droppable>
      ))}
    </DragDropProvider>
  )
}

export const DraggableDroppableExampleStory = DraggableDroppableExample

// Draggable and Droppable Example with Remove Button & Tooltip triggered by Icon onHover.
const DraggableDroppableWithRemoveButton: StoryFn = () => {
  const [items, setItems] = useState([
    { id: 'item-1', content: 'Draggable Item 1' },
    { id: 'item-2', content: 'Draggable Item 2' },
    { id: 'item-3', content: 'Draggable Item 3' },
  ])

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex((item) => item.id === active.id)
    const newIndex = items.findIndex((item) => item.id === over.id)

    const updatedItems = [...items]
    const [movedItem] = updatedItems.splice(oldIndex, 1)
    updatedItems.splice(newIndex, 0, movedItem)

    setItems(updatedItems)
  }

  const handleRemove = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      {items.map((item) => (
        <Droppable
          key={item.id}
          id={item.id}
        >
          <Draggable id={item.id} onRemove={handleRemove}  icon={<Tooltip title='Hover Me!'><Icon solid iconName='HeartIcon'/></Tooltip>}>
            {item.content}
          </Draggable>
        </Droppable>
      ))}
    </DragDropProvider>
  )
}

export const DraggableDroppableWithRemove = DraggableDroppableWithRemoveButton


// Sortable Grid with Custom Styles
export const SortableGridWithCustomStyles: StoryFn = () => {
  const [items, setItems] = useState([
    { id: 'item-1', name: 'Item 1' },
    { id: 'item-2', name: 'Item 2' },
    { id: 'item-3', name: 'Item 3' },
    { id: 'item-4', name: 'Item 4' },
    { id: 'item-5', name: 'Item 5' },
    { id: 'item-6', name: 'Item 6' },
  ])

  const handleDragEnd = ({ active, over }: { active: { id: string }; over: { id: string } | null }) => {
    if (!over || active.id === over.id) return

    setItems((prevItems) => {
      const oldIndex = prevItems.findIndex((item) => item.id === active.id)
      const newIndex = prevItems.findIndex((item) => item.id === over.id)
      return arrayMove(prevItems, oldIndex, newIndex)
    })
  }

  return (
    <StcStylesProvider customStyles={customStyles}>
      <DragDropProviderWithStyles onDragEnd={handleDragEnd as any}>
        <SortableList
          items={items.map((item) => item.id)}
          strategy='grid'
        >
          {items.map((item) => (
            <SortableItem
              key={item.id}
              id={item.id}
            >
              {item.name}
            </SortableItem>
          ))}
        </SortableList>
      </DragDropProviderWithStyles>
    </StcStylesProvider>
  )
}