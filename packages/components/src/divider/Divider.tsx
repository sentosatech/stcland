import { cns, appliedStyles } from '@stcland/utils'
import { DividerStyles } from 'src/styles'

//*****************************************************************************
// Interface
//*****************************************************************************

export interface DividerProps {
  type?: 'solid' | 'dashed' | 'dotted'; // Line style
  thickness?: 'thin' | 'medium' | 'thick'; // Line thickness
  orientation?: 'horizontal' | 'vertical'; // Divider orientation
  borderColorClass?: string; // Tailwind color class
  className?: string; // Additional custom Tailwind classes
  customStyles?: Partial<DividerStyles>
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
  customStyles
}: DividerProps) => {

  const dividerStyles: DividerStyles = {
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

  const mergedStyles = appliedStyles(dividerStyles, customStyles)

  const thicknessStyles = {
    thin: [mergedStyles.thin],
    medium: [mergedStyles.medium],
    thick: type === 'dotted' ? 'border-[2px]' : mergedStyles.thick,
  }


  const cn = {
    root: cns(
      mergedStyles.root,
      orientation === 'horizontal' ? mergedStyles.horizontal : mergedStyles.vertical,
      typeStyles[type],
      thicknessStyles[thickness],
      borderColorClass,
      className)
  }

  return <div className={cn.root} aria-hidden="true" />
}

export default Divider
