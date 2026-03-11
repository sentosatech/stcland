import type { RadioGroupProps } from '../RadioGroup'
import RadioGroup  from '../RadioGroup'
import { useStyles } from '../../styles/StylesProvider'

//*****************************************************************************
// Components
//*****************************************************************************

const RadioGroupWithStyles = ( props: RadioGroupProps) => {

  const { styles }  = useStyles()

  return (
    <RadioGroup {...props} customStyles={styles?.radioGroup}/>
  )
}

export default RadioGroupWithStyles
