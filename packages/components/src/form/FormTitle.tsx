import { appliedStyles } from '@stcland/utils'
import { FormTitleStyles } from 'src/styles/componentTypes'

//*****************************************************************************
// Interface
//*****************************************************************************
export interface Props {
  title: string;
  customStyles?: FormTitleStyles;
}

//*****************************************************************************
// Components
//*****************************************************************************

const FormTitle = ({ title, customStyles }: Props) => {
  const cn = appliedStyles(
    { root: 'font-bold text-sky-500 text-2xl mb-3' },
    customStyles
  )
  return <div className={cn.root}>{title}</div>
}
export default FormTitle
