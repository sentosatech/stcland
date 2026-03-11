import type { RadioProps } from '../Radio'
import Radio  from '../Radio'
import { useStyles } from '../../styles/StylesProvider'

//*****************************************************************************
// Components
//*****************************************************************************

const RadioGroupWithStyles = ( props: RadioProps) => {

  const { styles }  = useStyles()

  return (
    <Radio {...props} customStyles={styles?.radioGroup?.['isolatedRadio']}/>
  )
}

export default RadioGroupWithStyles
