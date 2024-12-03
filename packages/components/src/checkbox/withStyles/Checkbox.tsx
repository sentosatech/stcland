import type { CheckboxProps } from '../Checkbox'
import Checkbox  from '../Checkbox'
import { useStyles } from '../../styles/StylesProvider'

//*****************************************************************************
// Components
//*****************************************************************************

const CheckboxWithStyles = ( props: CheckboxProps) => {

  const { styles }  = useStyles()

  return (
    <Checkbox {...props} customStyles={styles?.checkbox}/>
  )
}

export default CheckboxWithStyles
