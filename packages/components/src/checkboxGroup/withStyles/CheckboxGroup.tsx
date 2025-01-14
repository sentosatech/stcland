import type { CheckboxGroupProps } from '../CheckboxGroup'
import CheckboxGroup  from '../CheckboxGroup'
import { useStyles } from '../../styles/StylesProvider'

//*****************************************************************************
// Components
//*****************************************************************************

const CheckboxWithStyles = ( props: CheckboxGroupProps) => {

  const { styles }  = useStyles()

  return (
    <CheckboxGroup {...props} customStyles={styles?.checkboxGroup}/>
  )
}

export default CheckboxWithStyles
