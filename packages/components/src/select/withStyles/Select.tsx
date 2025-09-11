import type { SelectProps } from '..'
import Select  from '../Select'
import { useStyles } from '../../styles/StylesProvider'

//*****************************************************************************
// Components
//*****************************************************************************

const SelectWithStyles = ( props: SelectProps) => {

  const { styles }  = useStyles()

  return (
    <Select {...props} customStyles={styles?.select}/>
  )
}

export default SelectWithStyles
