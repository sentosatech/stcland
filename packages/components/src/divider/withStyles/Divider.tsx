import type { DividerProps } from '../Divider'
import Divider  from '../Divider'
import { useStyles } from '../../styles/StylesProvider'

//*****************************************************************************
// Components
//*****************************************************************************

const CheckboxWithStyles = ( props: DividerProps) => {

  const { styles }  = useStyles()

  return (
    <Divider {...props} customStyles={styles?.divider}/>
  )
}

export default CheckboxWithStyles
