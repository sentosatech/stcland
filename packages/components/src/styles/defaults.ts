import type { ButtonStyles, TableStyles } from '.'

export type StclandStyles = {
  table?: Partial<TableStyles>,
  button?: Partial<ButtonStyles>,
  // Do we want this granularity?
  submitButton?: Partial<ButtonStyles>
  resetButton?: Partial<ButtonStyles>
}

// Default styles
export const defaultStyles: StclandStyles = {
  table: {
    root: 'border border-gray-825 bg-gray-825 px-4 pt-8 pb-14',
    table: 'table-fixed',
    header: 'text-s text-gray-100 text-left',
    headerRow: '',
    headerCell: 'font-medium pl-6 pb-4',
    body: 'text-s text-gray-400',
    row: 'border-t last:border-b border-primary-dark',
    cell: 'px-6 py-6',
    selectedRow: 'bg-gray-500',
    subRow: 'text-secondary-main border-none'
  },
  button: {
    root: 'flex w-fit items-center gap-1 min-w-32 p-2.5 text-sm font-medium text-gray-800',
    primary: {
      outlined: 'border border-primary-dark text-primary-main hover:border-primary-dark hover:bg-primary-range-200',
      solid: 'bg-primary-dark hover:bg-primary-range-900 text-gray-50'
    },
    secondary:{
      outlined: 'border border-secondary-dark text-secondary-dark hover:border-secondary-main hover:bg-secondary-range-200',
      solid: 'bg-secondary-dark hover:bg-secondary-range-900 text-gray-50',
    },
    neutral: {
      outlined: 'border border-gray-700 text-gray-500 hover:border-gray-600 hover:bg-gray-200',
      solid: 'bg-gray-700 hover:bg-gray-600 text-gray-300'
    },
    sm: 'p-2 text-1.5xs',
    md: 'p-3 text-sm',
    lg: 'p-3 text-md',
    fullWidth: 'w-full',
    rounded: 'rounded-md',
    brightenOnHover: 'hover:brightness-200',
    icon: 'w-1.5 h-1.5 inline',
    disabled: 'bg-gray-300 text-gray-400 hover:bg-gray-350',
    button: 'w-full'
  },
}
