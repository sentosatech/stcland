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
      default: 'bg-yellow-900 text-white',
      hover: 'hover:bg-green-400 hover:text-yellow-900 border-2 border-yellow-900',
      pressed: 'active:bg-primary-surface-dark active:text-yellow-700',
      disabled: 'disabled:bg-neutral-surface-disabled disabled:text-neutral-text-icon-disabled'
    },
    secondary:{
      default: 'border-2 border-primary-surface-subtle text-primary-surface-default',
      hover: 'border-2 hover:border-primary-surface-subtle hover:text-primary-text-icon-default',
      pressed: 'border-2 active:border-primary-surface-light active:bg-primary-surface-default active:text-primary-text-icon-default',
      disabled: 'border-2 disabled:border-neutral-text-icon-disabled disabled:text-neutral-text-icon-disabled'
    },
    tertiary: {
      default: 'text-primary-surface-default',
      hover: 'hover:text-primary-text-icon-default',
      pressed: 'active:text-primary-surface-dark',
      disabled: 'disabled:text-text-icon-disabled'
    },
    sm: 'p-2 text-1.5xs',
    md: 'p-3 text-sm',
    lg: 'p-3 text-md',
    fullWidth: 'w-full',
    rounded: 'rounded-md',
    highlightOnHover: 'hover:bg-gray-600',
    leftIcon: 'w-5 h-5 inline',
    rightIcon: 'w-5 h-5 inline',
    disabled: 'bg-gray-300 text-gray-400 hover:bg-gray-350',
    button: 'w-full'
  },
  icon: {
    root: 'p-2',
    secondary:{
      default: 'text-pink-700',
      hover: 'hover:text-pink-500',
      pressed: 'active:text-pink-900',
      disabled: 'disabled:bg-neutral-surface-disabled disabled:text-neutral-text-icon-disabled'
    },
    primary: {
      default: 'text-cyan-700',
      hover: 'hover:text-cyan-300',
      pressed: 'active:text-cyan-900',
      disabled: 'disabled:bg-neutral-surface-disabled disabled:text-neutral-text-icon-disabled'
    },
    tertiary: {
      default: 'text-gray-700',
      hover: 'hover:text-gray-900',
      pressed: 'active:text-text-500',
      disabled: 'disabled:bg-neutral-surface-disabled disabled:text-neutral-text-icon-disabled'
    },
    sm: 'h-4.5 w-4.5',
    md: 'h-6 w-6',
    lg: 'h-7 w-7',
    rounded: 'rounded-md',
    bright: 'brightness-125',
    highlightOnHover: 'hover:bg-gray-600',
    brightenOnHover: 'hover:brightness-125',
    muted: 'opacity-50',
    icon: '',
    button: ''
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
  checkBox: {
    root: 'flex-row-reverse justify-end items-center py-4',
    inputRoot:
      'accent-sky-500 rounded-sm h-100 bg-white border-white dark:[color-scheme:light]',
    label: 'pt-0 mb-0 text-sky-500 text-md',
  },
  selectInput: {
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
  },
  checkbox: {
    container: 'flex flex-row gap-2',
    root: '',
    rootWithoutCustomIcons: 'rounded-sm border-2 flex items-center justify-center border-gray-800',
    primary: 'bg-pink-400 border-pink-400',
    secondary: 'bg-purple-400 border-purple-400',
    neutral: 'bg-gray-600 border-gray-600',
    uncheckedPrimary: 'border-pink-400',
    uncheckedSecondary: 'border-purple-400',
    uncheckedNeutral: 'border-gray-600',
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    smChecked: 'text-xs',
    mdChecked: 'text-md',
    lgChecked: 'text-lg',
    disabled: 'bg-gray-800 border-gray-800 text-gray-600 hover:bg-gray-750',
    indeterminatePrimary: 'absolute w-3/4 h-0.5 bg-gray-200',
    indeterminateSecondary: 'absolute w-3/4 h-0.5',
    indeterminateNeutral: 'absolute w-3/4 h-0.5',
    labelPrimary: 'text-pink-400'
  },
  modal: {
    root: 'fixed inset-0 z-50 flex items-center justify-center',
    modal: 'z-20 bg-pink-800 text-gray-300 p-6 shadow-lg transition-all relative rounded min-w-[500px] flex flex-col space-y-16',
    backdrop: 'absolute inset-0 bg-black opacity-50',
    fullScreen: 'w-screen h-screen',
    closeButton: 'absolute top-4 right-4 text-3xl text-gray-500 hover:text-gray-800 focus:outline-none',
    headerContentContainer: 'flex flex-col flex-1 space-y-4',
    header: 'border-b border-primary-main',
    content: 'text-gray-400',
    actions: 'flex justify-end'
  },
  dnd: {
    sortableList: {
      grid: 'grid grid-cols-3 gap-4 p-4 bg-gray-200 rounded-md'
    },
    sortableItem: {
      root: 'relative p-2 rounded text-pink-900 transition-opacity flex items-center justify-between',
      bgColorClass: 'bg-pink-200',
      dragging: 'opacity-50',
      content: 'flex-1',
      removeButton: 'w-6 h-6 text-gray-300 hover:text-gray-500',
    },
    droppable: {
      root: '',
      dropping: 'opacity-50'
    },
    draggable: {
      root: 'cursor-grab relative p-2 rounded text-primary-main transition-opacity flex items-center justify-between',
      bgColorClass: 'bg-pink-200',
      dragging: 'opacity-50',
      content: 'flex-1',
      removeButton: 'w-6 h-6 text-gray-300 hover:text-gray-500'
    }
  },
  radioGroup: {
    radio: {
      root: 'flex items-center gap-2',
      inputRoot: 'sr-only',
      radio: 'w-4 h-4 rounded-full border-2 flex justify-center items-center border-primary-main bg-none',
      radioDisabled: 'border-gray-400 bg-gray-100 cursor-not-allowed',
      selected: 'bg-primary-main',
      innerCircle: 'w-1.5 h-1.5 rounded-full bg-gray-800',
      text: 'text-sm text-gray-200',
      textDisabled: 'text-gray-400'
    },
    radioGroup: {
      root: 'flex bg-gray-800 p-4 rounded-lg',
      vertical: 'flex-col space-y-2',
      horizontal: 'flex-row space-x-4'
    },
    isolatedRadio: {
      root: 'flex items-center gap-2',
      inputRoot: 'sr-only',
      radio: 'w-4 h-4 rounded-full border-2 flex justify-center items-center border-gray-800 bg-none',
      radioDisabled: 'border-gray-400 bg-gray-100 cursor-not-allowed',
      selected: 'bg-pink-500',
      innerCircle: 'w-1.5 h-1.5 rounded-full bg-gray-800',
      text: 'text-sm text-pink-500',
      textDisabled: 'text-gray-200'
    }
  },
  select: {
    root: 'relative w-64',
    label: 'block mb-2 text-sm font-medium text-pink-700',
    button: 'flex flex-row items-center justify-between w-full px-4 py-2 text-left bg-pink-900 border border-gray-400 text-neutral-200 rounded focus:outline-none',
    menu: 'absolute z-10 w-full bg-pink-600 border border-gray-300 text-neutral-700 rounded shadow-lg max-h-60 overflow-auto',
    disabled: 'disabled:bg-gray-400',
    optionContainer: 'flex items-center p-2',
    listItem: {
      base: 'ml-10',
      selected: 'ml-0',
    },
    selectedDefaultIcon: 'text-green-300'
  },
  divider: {
    root: 'border-0',
    horizontal: 'w-full border-t',
    vertical: 'h-full border-l',
    thin: 'border-0.5',
    medium: 'border-[1px]',
    thick: 'border-[2px]',
  },
  checkboxGroup: {
    root: 'flex',
    vertical: 'flex-col gap-2',
    horizontal: 'flex-row gap-4',
    checkbox: {
      container: 'flex flex-row items-center gap-2',
      root: 'cursor-pointer',
      rootWithoutCustomIcons: 'rounded-sm border-2 flex items-center justify-center border-gray-400',
      primary: 'bg-purple-500 border-purple-500 text-white',
      secondary: 'bg-green-500 border-green-500 text-white',
      neutral: 'bg-gray-600 border-gray-600 text-white',
      uncheckedPrimary: 'border-purple-500',
      uncheckedSecondary: 'border-green-500',
      uncheckedNeutral: 'border-gray-600',
      sm: 'w-5 h-5',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      smChecked: 'text-xs',
      mdChecked: 'text-md',
      lgChecked: 'text-lg',
      disabled: 'bg-gray-300 border-gray-300 text-gray-400 hover:bg-gray-350 cursor-auto',
      indeterminatePrimary: 'absolute w-3/4 h-0.5 bg-primary-main',
      indeterminateSecondary: 'absolute w-3/4 h-0.5',
      indeterminateNeutral: 'absolute w-3/4 h-0.5',
      labelPrimary: 'text-purple-500',
      labelSecondary: 'text-green-500',
      labelNeutral: 'text-gray-700',
      labelCustomIcon: 'text-gray-925'
    }
  },
  tooltip: {
    root: 'relative inline-block',
    tooltipContainer: 'absolute z-50 p-3 rounded-md shadow-md text-sm w-max',
    colorClass: 'bg-indigo-600 text-white',
    arrow: 'absolute w-3.5 h-2.5 border-t-2 border-r-2 border-transparent',
    arrowColor: 'bg-indigo-600',
  }
}

export default styles
