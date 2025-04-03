import * as React from 'react'
import { AccordionStyles } from 'src/styles'

//*****************************************************************************
// Interface
//*****************************************************************************

interface AccordionContextType {
  expanded: boolean;
  toggle: () => void;
  summaryId: string;
  detailsId: string;
  expandAll?: boolean;
  customStyles?: Partial<AccordionStyles>;
}

interface AccordionProviderProps extends Omit<AccordionContextType, 'toggle' | 'expanded' | 'toggleAll'> {
  children: React.ReactNode;
  defaultExpanded?: boolean;
  expandAll?: boolean
}

const AccordionContext = React.createContext<AccordionContextType | undefined>(undefined)

//*****************************************************************************
// Hooks
//*****************************************************************************

export const useAccordionContext = () => {
  const context = React.useContext(AccordionContext)
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion.')
  }
  return context
}

//*****************************************************************************
// Components
//*****************************************************************************

export const AccordionProvider = ({ children, summaryId, detailsId, defaultExpanded = false, customStyles, expandAll }: AccordionProviderProps) => {
  const [expanded, setExpanded] = React.useState(defaultExpanded)

  const toggle = () => setExpanded(prev => !prev)

  React.useEffect(() => {
    if (expandAll !== undefined) {
      setExpanded(expandAll)
    }
  }, [expandAll])

  return (
    <AccordionContext.Provider value={{ expanded, toggle, summaryId, detailsId, customStyles, expandAll }}>
      {children}
    </AccordionContext.Provider>
  )
}
