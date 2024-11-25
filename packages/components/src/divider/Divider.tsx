import { cns } from '@stcland/utils'

//*****************************************************************************
// Interface
//*****************************************************************************

export interface DividerProps {
  type?: 'solid' | 'dashed' | 'dotted'; // Line style
  thickness?: 'thin' | 'medium' | 'thick'; // Line thickness
  orientation?: 'horizontal' | 'vertical'; // Divider orientation
  borderColorClass?: string; // Tailwind color class
  className?: string; // Additional custom Tailwind classes
}

//*****************************************************************************
// Components
//*****************************************************************************

const Divider = ({
  type = 'solid',
  thickness = 'thin',
  orientation = 'horizontal',
  borderColorClass = 'border-primary-main',
  className,
}: DividerProps) => {

  const styles = {
    root: 'border-0',
    horizontal: 'w-full border-t',
    vertical: 'h-full border-l',
    thin: 'border-[1px]',
    medium: 'border-[2px]',
    thick: 'border-[4px]',
  }

  const typeStyles = {
    solid: '',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
  }

  const thicknessStyles = {
    thin: [styles.thin],
    medium: [styles.medium],
    thick: type === 'dotted' ? 'border-[2px]' : styles.thick,
  }


  const cn = {
    root: cns(
      styles.root,
      orientation === 'horizontal' ? styles.horizontal : styles.vertical,
      typeStyles[type],
      thicknessStyles[thickness],
      borderColorClass,
      className)
  }

  return <div className={cn.root} aria-hidden="true" />
}

export default Divider
