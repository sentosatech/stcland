import type { TabPanelProps } from '..'
import TabPanel from '../TabPanel'
import { useStyles } from '../../styles/StylesProvider'

//*****************************************************************************
// Components
//*****************************************************************************

const TabPanelWithStyles = ( props: TabPanelProps) => {

  const { styles }  = useStyles()

  return (
    <TabPanel {...props} customStyles={styles?.tabs?.tabPanel}/>
  )
}

export default TabPanelWithStyles
