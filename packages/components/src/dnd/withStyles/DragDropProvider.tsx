import type { CustomDndContextProps } from '..'
import { DragDropProvider }  from '..'
import { useStyles } from '../../styles/StylesProvider'

//*****************************************************************************
// Components
//*****************************************************************************

const DragDropProviderWithStyles = ( props: CustomDndContextProps) => {

  const { styles }  = useStyles()

  return (
    <DragDropProvider {...props} customStyles={styles?.dnd}/>
  )
}

export default DragDropProviderWithStyles
