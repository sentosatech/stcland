import { cns } from '@stcland/utils'

//*****************************************************************************
// Interface
//*****************************************************************************
interface Props {
  title?: string;
  muted?: boolean;
  children: React.ReactNode;
  className?: string;
}

//*****************************************************************************
// Components
//*****************************************************************************
const Panel = ({ title, className, children, muted = false }: Props) => {
  const cn = {
    root: cns('mb-6 rounded bg-zinc-850 p-6', className, muted && 'opacity-80'),
    title: 'text-primary-light mb-2',
  }
  return (
    <div className={cn.root}>
      {title && <div className={cn.title}>{title}</div>}
      {children}
    </div>
  )
}
export default Panel
