import type { TableProps } from '..'
import Table  from '../Table'
import { useStyles } from '../../styles/StylesProvider'

//*****************************************************************************
  // Components
//*****************************************************************************

const TableWithStyles = ( props: TableProps) => {
  const { styles }  = useStyles()

  console.log('IN TABLE WRAPPER------------', styles)

  return (
    <Table {...props} customStyles={styles?.table}/>
  )
}

export default TableWithStyles
