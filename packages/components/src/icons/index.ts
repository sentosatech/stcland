
//*****************************************************************************
// Interface
//*****************************************************************************

import { IconStyles } from 'src/styles/componentTypes'

export interface IconProps {
    // defaults to md, otherwise specify desired size
    sm?: boolean  // small icon
    md?: boolean // medium icon
    lg?: boolean // large icon

    solid?: boolean // if true renders solid icon otherwise renders outline icon, defaults to false
    secondaryColor?: boolean // use secondaryColor color, if false, defaults to primary color
    bright?: boolean // brighten icon color, defaults to false
    muted?: boolean // display color as muted, defaults to false
    highlightOnHover?: boolean // change bg icon color on hover, defaults to false
    brightenOnHover?: boolean // brighten icon color on hover, defaults to false

    onClick?: () => void // fxn to call when icon is clicked
    className?: string // applied to root container

    customStyles?: Partial<IconStyles>
  }


  //*****************************************************************************
  // IconSet
  //*****************************************************************************

export {
  HomeIcon,
  ProjectionsIcon,
  StaffIcon,
  CustomersIcon,
  ProjectsIcon,
  ContractsIcon,
  PaymentsIcon,
  ExpensesIcon,
  RateCalculatorIcon,
  ExpandIcon
} from './IconSet'
