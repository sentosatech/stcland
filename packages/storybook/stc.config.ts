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
    icon: 'text-states-error-dark',
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
    inputRoot: {
      default: 'text-base px-4 py-4 border-neutral-stroke-default border-2 rounded-lg bg-neutral-surface-2 text-neutral-text-icon-body border w-full',
      hover: 'hover:border-neutral-stroke-dark',
      pressed: 'active:text-neutral-text-icon-body',
      disabled: 'disabled:text-neutral-stroke-default disabled:bg-neutral-surface-disabled'
    },  },
  number: {
    root: 'flex  w-100 gap-2 ',
    label: 'text-md text-sky-500',
    inputRoot: {
      default: 'text-base px-4 py-4 border-neutral-stroke-default border-2 rounded-lg bg-neutral-surface-2 text-neutral-text-icon-body border w-full',
      hover: 'hover:border-neutral-stroke-dark',
      pressed: 'active:text-neutral-text-icon-body',
      disabled: 'disabled:text-neutral-stroke-default disabled:bg-neutral-surface-disabled'
    },
  },
  password: {
    root: 'flex  w-100 gap-2 ',
    label: 'text-md text-sky-500',
    inputRoot: {
      default: 'text-base px-4 py-4 border-sky-200 border-2 rounded-lg bg-neutral-surface-2 text-neutral-text-icon-body border w-full',
      hover: 'hover:border-neutral-stroke-dark',
      pressed: 'active:text-neutral-text-icon-body',
      disabled: 'disabled:text-neutral-stroke-default disabled:bg-neutral-surface-disabled'
    },
  },
  date: {
    root: 'flex  w-100 gap-2 ',
    label: 'text-md text-sky-500',
    inputRoot: {
      default: 'text-base px-4 py-4 border-neutral-stroke-default border-2 rounded-lg bg-neutral-surface-2 text-neutral-text-icon-body border w-full',
      hover: 'hover:border-neutral-stroke-dark',
      pressed: 'active:text-neutral-text-icon-body',
      disabled: 'disabled:text-neutral-stroke-default disabled:bg-neutral-surface-disabled'
    },
  },
  text: {
    root: 'flex  w-100 gap-2 ',
    label: 'text-md text-sky-500',
    inputRoot: {
      default: 'text-base px-4 py-4 border-neutral-stroke-default border-2 rounded-lg bg-neutral-surface-2 text-neutral-text-icon-body border w-full',
      hover: 'hover:border-neutral-stroke-dark',
      pressed: 'active:text-neutral-text-icon-body',
      disabled: 'disabled:text-neutral-stroke-default disabled:bg-neutral-surface-disabled'
    },
  },
  textArea: {
    root: 'flex  w-100 gap-2 ',
    label: 'text-md text-sky-500',
    inputRoot: {
      default: 'text-base px-4 py-4 border-neutral-stroke-default border-2 rounded-lg bg-neutral-surface-2 text-neutral-text-icon-body border w-full',
      hover: 'hover:border-neutral-stroke-dark',
      pressed: 'active:text-neutral-text-icon-body',
      disabled: 'disabled:text-neutral-stroke-default disabled:bg-neutral-surface-disabled'
    },  },
  time: {
    root: 'flex  w-100 gap-2 ',
    label: 'text-md text-sky-500',
    inputRoot: {
      default: 'p-2 text-base px-4 py-4 border-neutral-stroke-default border-2 rounded-lg bg-neutral-surface-2 text-neutral-text-icon-body border w-full',
      hover: 'hover:border-neutral-stroke-dark',
      pressed: 'active:text-neutral-text-icon-body',
      disabled: 'disabled:text-neutral-stroke-default disabled:bg-neutral-surface-disabled'
    },
  },
  fieldSet: {
    label: 'font-semibold text-sky-700 text-lg',
    fieldset: 'grid-cols-1',
  },
  checkBox: {
    root: 'flex-row-reverse justify-end items-center py-4',
    inputRoot: {
      default: 'w-5 h-5 text-base px-4 py-4 border-pink-600 border-2 rounded-lg  text-pink-900 border',
      hover: 'hover:border-neutral-stroke-dark',
      pressed: 'active:text-pink-600',
      disabled: 'disabled:text-neutral-stroke-default disabled:bg-neutral-surface-disabled'
    },
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
    container: 'flex flex-row',
    root: 'cursor-pointer',
    rootWithoutCustomIcons: 'rounded-sm border-2 flex items-center justify-center border-gray-400',
    primary: 'bg-primary-main border-primary-main',
    secondary: 'bg-secondary-main border-secondary-main',
    tertiary: 'bg-gray-600 border-gray-600',
    uncheckedPrimary: 'border-primary-main',
    uncheckedSecondary: 'border-secondary-main',
    uncheckedTertiary: 'border-gray-600',
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    smChecked: 'text-xs',
    mdChecked: 'text-md',
    lgChecked: 'text-lg',
    disabled: 'bg-gray-300 border-gray-300 text-gray-400 hover:bg-gray-350',
    indeterminatePrimary: 'absolute w-3/4 h-0.5',
    indeterminateSecondary: 'absolute w-3/4 h-0.5',
    indeterminateTertiary: 'absolute w-3/4 h-0.5',
    labelPrimary: 'text-primary-main',
    labelSecondary: 'text-secondary-main',
    labelNeutral: 'text-gray-700',
    labelCustomIcon: 'text-gray-925'
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
      root: 'relative p-1 rounded text-zinc-100 transition-opacity flex items-center justify-between',
      bgColorClass: 'bg-indigo-600',
      dragging: 'opacity-50',
      content: 'flex-1',
      removeButton: 'w-6 h-6 text-zinc-100 hover:text-gray-500',
      iconContainer: ''
    },
    droppable: {
      root: '',
      dropping: 'opacity-50'
    },
    draggable: {
      root: 'cursor-grab relative p-2 rounded text-primary-main transition-opacity flex items-center justify-between',
      bgColorClass: ' bg-pink-200',
      dragging: 'opacity-50',
      content: 'flex-1',
      removeButton: 'w-6 h-6 text-zinc-900 hover:text-gray-500',
      iconContainer: ''
    }
  },
  radioGroup: {
    radio: {
      root: 'flex items-center gap-2',
      inputRoot: 'accent-primary-surface-default h-4 w-4 rounded-full',
      radioDisabled: 'border-gray-400 bg-gray-100 cursor-not-allowed',
      selected: 'bg-primary-main',
      text: 'text-sm text-primary-surface-dark',
      textDisabled: 'text-gray-400'
    },
    radioGroup: {
      root: 'flex bg-primary-surface-subtle p-4 rounded-lg',
      vertical: 'flex-col space-y-2',
      horizontal: 'flex-row space-x-4'
    },
    isolatedRadio: {
      root: 'flex items-center gap-2 rounded-full',
      inputRoot: 'accent-pink-700 h-4 w-4 rounded-full',
      radioDisabled: 'border-gray-400 bg-gray-100 cursor-not-allowed',
      selected: 'bg-pink-500',
      text: 'text-sm text-pink-500',
      textDisabled: 'text-gray-200'
    }
  },
  select: {
    root: 'relative w-64',
    label: 'block mb-2 text-sm font-medium text-pink-700',
    button: 'flex flex-row items-center justify-between w-full px-4 py-2 text-left bg-pink-900 border border-gray-400 text-neutral-200 rounded focus:primary-surface-dark',
    menu: 'absolute z-10 w-full bg-neutral-surface-1 border border-gray-300 text-neutral-text-icon-body rounded shadow-lg max-h-60 overflow-auto',
    disabled: 'text-neutral-text-icon-disabled',
    optionContainer: {
      default: 'flex items-center hover:bg-pink-400 justify-between p-2 bg-pink-900 cursor-pointer',
      selected: 'bg-pink-200'
    },     listItem: {
      base: 'ml-10',
      selected: 'ml-0',
    },
    selectedDefaultIcon: 'text-pink-900'
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
      primary: 'bg-zinc-900 border-zinc-900 text-white',
      secondary: 'bg-yellow-400 border-yellow-600 text-zinc-900',
      tertiary: 'bg-gray-600 border-gray-600 text-white',
      uncheckedPrimary: 'border-zinc-900',
      uncheckedSecondary: 'border-yellow-600',
      uncheckedTertiary: 'border-gray-600',
      sm: 'w-5 h-5',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      smChecked: 'text-xs',
      mdChecked: 'text-md',
      lgChecked: 'text-lg',
      disabled: 'bg-gray-300 border-gray-300 text-gray-400 hover:bg-gray-350 cursor-auto',
      indeterminatePrimary: 'absolute w-3/4 h-0.5 bg-primary-main',
      indeterminateSecondary: 'absolute w-3/4 h-0.5',
      indeterminateTertiary: 'absolute w-3/4 h-0.5',
      labelPrimary: 'text-zinc-900',
      labelSecondary: 'text-yellow-200',
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
  },
  tabs: {
    tabs: {
      root: 'p-2 overflow-auto whitespace-nowrap w-full flex gap-2 relative',
      colorClass: 'bg-pink-600 text-white',
      rootWidth: 'w-max',
      indicator: 'absolute transition-transform duration-300 ease-in-out',
      horizontalIndicator: 'bottom-0 left-0 h-0.5 w-full',
      verticalIndicator: 'right-0 w-0.5 h-full',
      colorClassIndicator: 'bg-gray-600',
      tabWrapper: 'w-full relative',
      scrollButton: 'relative z-10 text-white rounded-full p-2',
      scrollableIcon: 'text-gray-600 h-4.5 w-4.5',
      scrollableWrapper: 'flex items-center'
    },
    tab: {
      root: 'px-6 py-3',
      activeStyle: 'font-bold',
      colorClass: 'bg-pink-600 text-gray-600',
      disabled: 'bg-gray-400'
    },
    tabPanel: {
      root: '',
      colorClass: 'bg-pink-600 text-white'
    }
  }
}

export default styles
