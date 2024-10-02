import type { Props as ButtonProps } from '../Button'
import Button  from '../Button'
import { useStyles } from '../../styles/StylesProvider'

//*****************************************************************************
// Components
//*****************************************************************************

const ButtonWithStyles = ( props: ButtonProps) => {

  const { styles }  = useStyles()

  return (
    <Button {...props} customStyles={styles?.button}/>
  )
}

export default ButtonWithStyles
