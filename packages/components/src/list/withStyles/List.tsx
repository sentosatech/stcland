import type { ListProps } from '..'
import { List }  from '../List'
import { useStyles } from '../../styles/StylesProvider'

//*****************************************************************************
// Components
//*****************************************************************************

const ListWithStyles = ( props: ListProps) => {

  const { styles }  = useStyles()

  return (
    <List {...props} customStyles={styles?.list}/>
  )
}

export default ListWithStyles
