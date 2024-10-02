import './index.css'

// Tailwind Theme
export { config as themeConfig } from '../tailwind.config'

// Styles
export { StcStylesProvider, useStyles, getStyles } from './styles'
export type { StclandStyles, TableStyles } from './styles'

// Components
export type { TableProps } from './table'
export { Table } from './table'

export type { ButtonProps, ResetButtonProps, SubmitButtonProps } from './button'
export { Button, ResetButton, SubmitButton } from './button'

