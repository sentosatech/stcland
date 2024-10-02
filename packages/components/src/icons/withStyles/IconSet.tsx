import type { IconProps } from '../'
import * as outline from '@heroicons/react/24/outline'
import * as solid from '@heroicons/react/24/solid'
import BaseIcon from './BaseIcon'

export const HomeIcon = (props: IconProps) =>
  BaseIcon({ SolidIcon: solid.HomeIcon, OutlineIcon: outline.HomeIcon, ...props })

export const ProjectionsIcon = (props: IconProps) =>
  BaseIcon({ SolidIcon: solid.CurrencyDollarIcon, OutlineIcon: outline.CurrencyDollarIcon, ...props })

export const StaffIcon = (props: IconProps) =>
  BaseIcon({ SolidIcon: solid.UsersIcon, OutlineIcon: outline.UsersIcon, ...props })

export const CustomersIcon = (props: IconProps) =>
  BaseIcon({ SolidIcon: solid.HeartIcon, OutlineIcon: outline.HeartIcon, ...props })

export const ProjectsIcon = (props: IconProps) =>
  BaseIcon({ SolidIcon: solid.FireIcon, OutlineIcon: outline.FireIcon, ...props })

export const ContractsIcon = (props: IconProps) =>
  BaseIcon({ SolidIcon: solid.ShareIcon, OutlineIcon: outline.ShareIcon, ...props })

export const PaymentsIcon = (props: IconProps) =>
  BaseIcon({ SolidIcon: solid.CreditCardIcon, OutlineIcon: outline.CreditCardIcon, ...props })

export const ExpensesIcon = (props: IconProps) =>
  BaseIcon({ SolidIcon: solid.PencilSquareIcon, OutlineIcon: outline.PencilSquareIcon, ...props })

export const RateCalculatorIcon = (props: IconProps) =>
  BaseIcon({ SolidIcon: solid.CalculatorIcon, OutlineIcon: outline.CalculatorIcon, ...props })

export const ExpandIcon = (props: IconProps) =>
  BaseIcon({ SolidIcon: solid.ChevronRightIcon, OutlineIcon: outline.ChevronRightIcon, ...props })