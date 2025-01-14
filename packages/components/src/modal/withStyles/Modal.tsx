import type { ModalProps } from '../Modal'
import Modal  from '../Modal'
import { useStyles } from '../../styles/StylesProvider'

//*****************************************************************************
// Components
//*****************************************************************************

const ModalWithStyles = ( props: ModalProps) => {

  const { styles }  = useStyles()

  return (
    <Modal {...props} customStyles={styles?.modal}/>
  )
}

export default ModalWithStyles
