import * as React from 'react'
import { DndContext  } from '@dnd-kit/core'
import type { DndContextProps  } from '@dnd-kit/core'
import { DndStyles } from 'src/styles'

// Extend the original props to include customStyles
export interface CustomDndContextProps extends DndContextProps {
  customStyles?: Partial<DndStyles> // Object to define customStyles for all child components.
}

// Create a React context for custom styles
const CustomDndContext = React.createContext<Partial<CustomDndContextProps>>({})

const DragDropProvider = ({
  children,
  customStyles,
  ...props
}: CustomDndContextProps) => {
  return (
    <CustomDndContext.Provider value={{ customStyles }}>
      <DndContext {...props}>{children}</DndContext>
    </CustomDndContext.Provider>
  )
}

// Custom hook to access custom styles
export const useCustomDndContext = () => {
  const context = React.useContext(CustomDndContext)
  if (!context) {
    throw new Error('useCustomDndContext must be used within a DragDropProvider')
  }
  return context
}

export default DragDropProvider