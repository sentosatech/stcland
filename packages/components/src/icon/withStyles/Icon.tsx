import  Icon  from '../Icon'
import  type { IconProps }  from '..'
import { useStyles } from '../../styles/StylesProvider'

//*****************************************************************************
// Components
//*****************************************************************************

const IconWithStyles = ( props: IconProps) => {

  const { styles }  = useStyles()

  return (
    <Icon {...props} customStyles={styles?.icon}/>
  )
}

export default IconWithStyles
