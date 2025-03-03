
import { IconStyles } from 'src/styles/componentTypes'
import type { IconName } from './Icon'

//*****************************************************************************
// Interface
//*****************************************************************************

export interface IconProps {
 iconName: IconName
   // Icon name from heroicons
 size?: 'sm' | 'md' | 'lg'
   // Desire size. Defaults to `md`.
 solid?: boolean
   // if true renders solid icon otherwise renders outline icon, defaults to `false`
 type?: 'primary' | 'secondary' | 'tertiary'
   // Variant style. Defaults to `primary`.
 bright?: boolean
   // brighten icon color, defaults to false
 disabled?: boolean
   // disabled state. Defaults to `false`
 muted?: boolean
   // display color as muted, defaults to false
 highlightOnHover?: boolean
   // change bg icon color on hover, defaults to false
 brightenOnHover?: boolean
   // brighten icon color on hover, defaults to false
 onClick?: () => void
   // fxn to call when icon is clicked
 className?: string
   // applied to root container
 customStyles?: Partial<IconStyles>
  }


  //*****************************************************************************
  // Icon Component
  //*****************************************************************************

export { default as Icon } from './Icon'