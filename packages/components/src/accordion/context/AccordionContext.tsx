import * as React from 'react'

interface AccordionContextType {
  expanded: boolean;
  toggle: () => void;
  summaryId: string;
  detailsId: string;
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
}

export const AccordionProvider = ({ children, summaryId, detailsId, defaultExpanded = false }: AccordionProviderProps) => {
  const [expanded, setExpanded] = React.useState(defaultExpanded)
  const toggle = () => setExpanded((prev) => !prev)

  return (
    <AccordionContext.Provider value={{ expanded, toggle, summaryId, detailsId }}>
      {children}
    </AccordionContext.Provider>
  )
}
