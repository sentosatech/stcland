import * as React from 'react'
import { AccordionStyles } from 'src/styles'

interface AccordionContextType {
  expanded: boolean;
  toggle: () => void;
  summaryId: string;
  detailsId: string;
  customStyles?: Partial<AccordionStyles>
}

const AccordionContext = React.createContext<AccordionContextType | undefined>(undefined)

export const useAccordionContext = () => {
  const context = React.useContext(AccordionContext)
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion.')
  }
  return context
}

interface AccordionProviderProps {
  children: React.ReactNode;
  summaryId: string;
  detailsId: string;
  defaultExpanded?: boolean;
  customStyles?: Partial<AccordionStyles>
}

export const AccordionProvider = ({ children, summaryId, detailsId, defaultExpanded = false, customStyles }: AccordionProviderProps) => {
  const [expanded, setExpanded] = React.useState(defaultExpanded)
  const toggle = () => setExpanded((prev) => !prev)

  return (
    <AccordionContext.Provider value={{ expanded, toggle, summaryId, detailsId, customStyles }}>
      {children}
    </AccordionContext.Provider>
  )
}
