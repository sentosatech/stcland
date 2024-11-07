
import { IconStyles } from 'src/styles/componentTypes'
import type { IconName } from './Icon'

//*****************************************************************************
// Interface
//*****************************************************************************

export interface IconProps {
    iconName: IconName
    // defaults to md, otherwise specify desired size
    sm?: boolean  // small icon
    md?: boolean // medium icon
    lg?: boolean // large icon

    solid?: boolean // if true renders solid icon otherwise renders outline icon, defaults to false
    secondary?: boolean // use secondary variant
    primary?: boolean // primary variant
    neutral?: boolean // neutral variant

    bright?: boolean // brighten icon color, defaults to false
    muted?: boolean // display color as muted, defaults to false
    highlightOnHover?: boolean // change bg icon color on hover, defaults to false
    brightenOnHover?: boolean // brighten icon color on hover, defaults to false
    onClick?: () => void // fxn to call when icon is clicked
    className?: string // applied to root container

    customStyles?: Partial<IconStyles>
  }


  //*****************************************************************************
  // Icon Component
  //*****************************************************************************

export { default as Icon } from './Icon'