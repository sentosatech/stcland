import type { TooltipProps } from '..'
import Tooltip  from '../Tooltip'
import { useStyles } from '../../styles/StylesProvider'

//*****************************************************************************
// Components
//*****************************************************************************

const TooltipWithStyles = ( props: TooltipProps) => {

  const { styles }  = useStyles()

  return (
    <Tooltip {...props} customStyles={styles?.tooltip} />
  )
}

export default TooltipWithStyles
