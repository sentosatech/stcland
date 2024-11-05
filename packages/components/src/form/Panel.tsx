import { appliedStyles } from '@stcland/utils'
import { PanelStyles } from 'src/styles/componentTypes'

//*****************************************************************************
// Interface
//*****************************************************************************
interface Props {
  title?: string;
  children: React.ReactNode[] | React.ReactNode;
  customStyles?: Partial<PanelStyles>;
}

//*****************************************************************************
// Components
//*****************************************************************************
const Panel = ({ title, customStyles, children }: Props) => {
  const cn = appliedStyles(
    {
      root: '',
      title: 'font-bold text-sky-500 text-md',
    },
    customStyles
  )
  return (
    <div className={cn.root}>
      {title && <div className={cn.title}>{title}</div>}
      {children}
    </div>
  )
}
export default Panel
