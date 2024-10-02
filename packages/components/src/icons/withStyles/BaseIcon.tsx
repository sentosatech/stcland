import  BaseIcon  from '../BaseIcon'
import  type { Props as BaseIconProps }  from '../BaseIcon'
import { useStyles } from '../../styles/StylesProvider'

//*****************************************************************************
// Components
//*****************************************************************************

const IconWithStyles = ( props: BaseIconProps) => {

  const { styles }  = useStyles()

  return (
    <BaseIcon {...props} customStyles={styles?.icon}/>
  )
}

export default IconWithStyles
