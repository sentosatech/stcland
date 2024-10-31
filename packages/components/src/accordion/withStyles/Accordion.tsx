import type { AccordionProps } from '..'
import { Accordion }  from '../Accordion'
import { useStyles } from '../../styles/StylesProvider'

//*****************************************************************************
// Components
//*****************************************************************************

const AccordionWithStyles = ( props: AccordionProps) => {

  const { styles }  = useStyles()

  return (
    <Accordion {...props} customStyles={styles?.accordion}/>
  )
}

export default AccordionWithStyles
