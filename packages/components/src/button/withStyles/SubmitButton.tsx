import type { Props as ButtonProps } from '../Button'
import SubmitButton  from '../SubmitButton'
import { useStyles } from '../../styles/StylesProvider'

//*****************************************************************************
// Components
//*****************************************************************************

const SubmitButtonWithStyles = ( props: ButtonProps) => {

  const { styles }  = useStyles()

  return (
    <SubmitButton {...props} customStyles={styles?.button}/>
  )
}

export default SubmitButtonWithStyles
