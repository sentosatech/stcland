import type { TabsProps } from '..'
import Tabs  from '../Tabs'
import { useStyles } from '../../styles/StylesProvider'

//*****************************************************************************
// Components
//*****************************************************************************

const TabsWithStyles = ( props: TabsProps) => {

  const { styles }  = useStyles()

  return (
    <Tabs {...props} customStyles={styles?.tabs}/>
  )
}

export default TabsWithStyles
