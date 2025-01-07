
import type { StclandStyles } from '.'

const customStyles : StclandStyles = {
  table: {
    root: 'bg-secondary-main',
    table: 'table-fixed',
    header: 'text-s text-primary-main text-left',
    headerRow: '',
    headerCell: 'font-medium pl-6 pb-4',
    body: 'text-gray-100 px-6',
    row: 'border-t last:border-b border-primary-dark',
    cell: 'px-6 py-6',
    selectedRow: 'bg-gray-500',
    subRow: 'text-secondary-main border-none',
  },
  button: {
    root: 'flex w-fit items-center gap-1 min-w-32 p-2.5 text-sm font-medium text-gray-800',
    primary: {
      default: 'bg-primary-surface-default text-white',
      hover: 'hover:bg-primary-surface-light hover:text-white',
      pressed: 'pressed:bg-primary-surface-dark pressed:text-white',
      disabled: 'disabled:bg-neutral-surface-disabled disabled:text-neutral-text-icon-disabled'
    },
    secondary:{
      default: 'border-2 border-primary-surface-default text-primary-surface-subtle',
      hover: 'border hover:border-primary-surface-light hover:text-primary-text-icon-default',
      pressed: 'border pressed:border-primary-surface-light pressed:bg-primary-surface-default',
      disabled: 'border disabled:border-neutral-text-icon-disabled disabled:text-neutral-text-icon-disabled'
    },
    tertiary: {
      default: 'text-primary-surface-default',
      hover: 'hover:text-primary-text-icon-default',
      pressed: 'pressed:text-primary-surface-dark',
      disabled: 'disabled:text-text-icon-disabled'
    },
    sm: 'p-2 text-1.5xs',
    md: 'p-3 text-sm',
    lg: 'p-3 text-md',
    fullWidth: 'w-full',
    rounded: 'rounded-md',
    highlightOnHover: 'hover:bg-gray-600',
    leftIcon: 'w-3.5 h-3.5 inline',
    rightIcon: 'w-3.5 h-3.5 inline',
    disabled: 'bg-gray-300 text-gray-400 hover:bg-gray-350',
    button: 'w-full'
  },
}

export default customStyles