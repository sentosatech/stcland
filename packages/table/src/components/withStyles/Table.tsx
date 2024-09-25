import '../../index.css'
import { useStyles } from '@stcland/theme'
import { TableProps } from '@/index'
import Table  from '../Table'

//*****************************************************************************
  // Components
//*****************************************************************************

const TableWithStyles = ( props: TableProps) => {

  const { styles } = useStyles()

  return (
    <Table {...props} customStyles={styles?.table}/>
  )
}

export default TableWithStyles
