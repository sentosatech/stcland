import type { StclandStyles } from '@stcland/components'

const styles: StclandStyles = {
  table: {
    root: 'bg-secondary-main',
    // table: 'table-fixed',
    header: 'text-s text-primary-main text-left',
    // headerRow: '',
    // headerCell: 'font-medium pl-6 pb-4',
    body: 'text-gray-100 px-6',
    // row: 'border-t last:border-b border-primary-dark',
    // cell: 'px-6 py-6',
    // selectedRow: 'bg-gray-500',
    // subRow: 'text-secondary-main border-none',
  },
  button: {
    root: 'flex w-fit items-center gap-1 min-w-32 p-2.5 text-sm font-medium text-gray-800',
    primary: {
      outlined:
        'border border-primary-range-300 text-primary-main hover:border-primary-dark hover:bg-primary-range-200',
      solid: 'bg-secondary-main hover:bg-primary-range-900 text-primary-main',
    },
    secondary: {
      outlined:
        'border border-secondary-main text-secondary-main hover:border-secondary-dark hover:bg-secondary-range-200',
      solid: 'bg-secondary-main hover:bg-secondary-range-900 text-gray-50',
    },
    neutral: {
      outlined:
        'border border-gray-700 text-gray-500 hover:border-gray-600 hover:bg-gray-200',
      solid: 'bg-gray-700 hover:bg-gray-600 text-gray-300',
    },
    sm: 'p-2 text-1.5xs',
    md: 'p-3 text-sm',
    lg: 'p-3 text-md',
    // fullWidth: 'w-full',
    // rounded: 'rounded-md',
    highlightOnHover: 'hover:bg-gray-600',
    icon: 'w-3 h-3 inline',
    // disabled:  'bg-gray-300 text-gray-400 hover:bg-gray-350',
    // button: 'w-full'
  },
  icon: {
    root: 'p-2',
    secondary: 'text-gray-800',
    primary: 'text-gray-100',
    neutral: 'text-gray-600',
    sm: 'h-4.5 w-4.5',
    md: 'h-6 w-6',
    lg: 'h-7 w-7',
    rounded: 'rounded-md',
    bright: 'brightness-125',
    highlightOnHover: 'hover:bg-gray-600',
    brightenOnHover: 'hover:brightness-125',
    muted: 'opacity-50',
  },
  accordion: {
    accordion: { root: 'border rounded bg-gray-700' },
    accordionSummary: {
      root: 'flex justify-between items-center p-4 cursor-pointer bg-secondary-main text-gray-600',
      icon: 'ml-2 transition-transform duration-300 ease-in-out',
    },
    accordionDetails: { root: 'bg-gray-700 text-gray-200' },
    accordionAction: { root: 'flex justify-end gap-2', spacing: 'p-4' },
  },
  form: {
    panelStyle: {
      root: 'p-4 flex flex-col gap-2 bg-slate-200 text-xl',
    },
  },
  email: {
    root: 'flex  w-100 gap-2 ',
    label: 'text-md text-sky-500',
    inputRoot: 'px-2 py-2 bg-slate-300 border-sky-200 bg-white text-slate-800',
  },
  number: {
    root: 'flex  w-100 gap-2 ',
    label: 'text-md text-sky-500',
    inputRoot: 'px-2 py-2 bg-slate-300 border-sky-200 bg-white text-slate-800',
  },
  password: {
    root: 'flex  w-100 gap-2 ',
    label: 'text-md text-sky-500',
    inputRoot: 'px-2 py-2 bg-slate-300 border-sky-200 bg-white text-slate-800',
  },
  date: {
    root: 'flex  w-100 gap-2 ',
    label: 'text-md text-sky-500',
    inputRoot:
      'px-2 py-2 bg-slate-300 border-sky-200 bg-white text-slate-800 dark:[color-scheme:light]',
  },
  text: {
    root: 'flex  w-100 gap-2 ',
    label: 'text-md text-sky-500',
    inputRoot: 'px-2 py-2 bg-slate-300 border-sky-200 bg-white text-slate-800',
  },
  textArea: {
    root: 'flex  w-100 gap-2 ',
    label: 'text-md text-sky-500',
    inputRoot: 'px-2 py-2 bg-slate-300 border-sky-200 bg-white text-slate-800',
  },
  time: {
    root: 'flex  w-100 gap-2 ',
    label: 'text-md text-sky-500',
    inputRoot:
      'px-2 py-2 bg-slate-300 border-sky-200 bg-white text-slate-800 dark:[color-scheme:light]',
  },
  fieldSet: {
    label: 'font-semibold text-sky-700 text-lg',
    fieldset: 'grid-cols-1',
  },
  checkbox: {
    root: 'flex-row-reverse justify-end items-center py-4',
    inputRoot:
      'accent-sky-500 rounded-sm h-100 bg-white border-white dark:[color-scheme:light]',
    label: 'pt-0 mb-0 text-sky-500 text-md',
  },
  select: {
    label: 'text-sky-500 text-md',
    menuButton: 'bg-white text-slate-800 border-sky-200',
    menu: 'bg-slate-100  border border-sky-200',
    listItem: {
      base: 'text-zinc-400 bg-slate-50 hover:bg-slate-100',
      selected: 'text-black',
    },
  },
  radio: {
    label: 'text-sky-500 text-md',
    radioContainer: 'flex gap-2 items-center',
    error: 'text-red-300 italic text-sm',
    radioButton: 'accent-sky-500 h-4 w-4',
  },
  list: {
    list: {
      root: 'w-full max-w-lg bg-gray-900 rounded-md shadow-md',
      dense: 'space-y-1',
      padding: 'p-4',
      gutters: 'px-4',
      ordered: 'list-decimal list-inside',
      divider: 'border-b border-primary-main',
      subheader: 'text-gray-300'
    },
    listItem: {
      root: '',
      padding: 'p-4',
      divider: 'border-b border-secondary-dark',
      dense: 'py-1',
    },
    listItemButton: {
      root: 'w-full flex rounded',
      dense: 'py-1',
      divider: 'border-b border-gray-200',
      selected: 'bg-gray-200',
      hover: 'hover:bg-gray-800',
      disabled: 'disabled:bg-gray-650',
      disabledChilds: 'group disabled:text-gray-700'
    },
    listItemText: {
      root: 'flex flex-col w-full',
      inset: 'pl-8',
      disabledByParent: 'group-disabled:text-gray-750',
      primaryText: 'text-base font-medium text-secondary-main',
      secondaryText: 'text-sm text-gray-500',
    },
  }
}

export default styles
