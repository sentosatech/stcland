import type { Props as ButtonProps } from '../Button'
import ResetButton  from '../ResetButton'
import { useStyles } from '../../styles/StylesProvider'

//*****************************************************************************
// Components
//*****************************************************************************

const RessetButtonWithStyles = ( props: ButtonProps) => {

  const { styles }  = useStyles()

  return (
    <ResetButton {...props} customStyles={styles?.resetButton}/>
  )
}

export default RessetButtonWithStyles
