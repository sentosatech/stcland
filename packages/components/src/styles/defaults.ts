import type {  AccordionStyles,
  ButtonStyles,
  CheckBoxStyles,
  FieldSetStyles,
  FormInputStyles,
  FormStyles,
  FormTitleStyles,
  IconStyles,
  RadioButtonGroupStyles,
  SelectInputStyles,
  TableStyles, ListStyles,
  CheckboxStyles,
  ModalStyles,
  DndStyles,
  RadioGroupStyles,
  SelectStyles,
  DividerStyles,
  CheckboxGroupStyles,
  TooltipStyles,
  TabsStyles
} from '.'

export type StclandStyles = {
  table?: Partial<TableStyles>;
  button?: Partial<ButtonStyles>;
  // Do we want this granularity?
  submitButton?: Partial<ButtonStyles>
  resetButton?: Partial<ButtonStyles>
  icon?: Partial<IconStyles>
  accordion?: Partial<AccordionStyles>
  list?: Partial<ListStyles>
  checkbox?: Partial<CheckboxStyles>
  checkboxGroup?: Partial<CheckboxGroupStyles>
  modal?: Partial<ModalStyles>
  dnd?: Partial<DndStyles>
  radioGroup?: Partial<RadioGroupStyles>
  select?: Partial<SelectStyles>
  divider?: Partial<DividerStyles>
  tooltip?: Partial<TooltipStyles>
  tabs?: Partial<TabsStyles>

   // Form styles
   form?: Partial<FormStyles>;
   formTitle?: Partial<FormTitleStyles>;
   fieldSet?: Partial<FieldSetStyles>;
   checkBox?: Partial<CheckBoxStyles>;
   date?: Partial<FormInputStyles>;
   email?: Partial<FormInputStyles>;
   number?: Partial<FormInputStyles>;
   password?: Partial<FormInputStyles>;
   radio?: Partial<RadioButtonGroupStyles>;
   selectInput?: Partial<SelectInputStyles>;
   text?: Partial<FormInputStyles>;
   textArea?: Partial<FormInputStyles>;
   time?: Partial<FormInputStyles>;
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
    subRow: 'text-secondary-main border-none',
  },
  button: {
    root: 'flex w-fit items-center gap-1 min-w-32 p-2.5 text-sm font-medium text-gray-800',
    primary: {
      default: 'text-primary-surface-default',
      hover: 'hover:bg-primary-surface-light hover:text-white',
      pressed: 'pressed:bg-primary-surface-dark pressed:text-white',
      disabled: 'disabled:bg-neutral-surface-disabled disabled:text-neutral-text-icon-disabled'
    },
    secondary:{
      default: 'border border-primary-surface-default text-primary-surface-default',
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
  icon: {
    root: 'p-2',
    secondary:{
      default: 'text-primary-surface-dark',
      hover: 'hover:text-primary-text-icon-default',
      pressed: 'active:text-primary-surface-dark',
      disabled: 'disabled:bg-neutral-surface-disabled disabled:text-neutral-text-icon-disabled'
    },
    primary: {
      default: 'text-primary-surface-default',
      hover: 'hover:text-primary-surface-light',
      pressed: 'active:text-primary-surface-dark',
      disabled: 'disabled:bg-neutral-surface-disabled disabled:text-neutral-text-icon-disabled'
    },
    tertiary: {
      default: 'text-primary-surface-light',
      hover: 'hover:text-primary-surface-subtle',
      pressed: 'active:text-primary-surface-dark',
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
    accordion: { root: 'border rounded bg-gray-825' },
    accordionSummary: {
      root: 'flex justify-between items-center p-4 bg-gray-825 text-gray-100 border-b border-primary-main',
      icon: 'ml-2 transition-transform duration-300 ease-in-out',
    },
    accordionDetails: { root: 'bg-gray-825 text-gray-400' },
    accordionAction: { root: 'flex justify-end gap-2', spacing: 'p-4' },
  },
  list: {
    list: {
      root: 'w-full max-w-lg bg-gray-825 text-gray-100 rounded-md shadow-md',
      dense: 'space-y-1',
      padding: 'p-4',
      gutters: 'px-4',
      ordered: 'list-decimal list-inside',
      divider: 'border-b border-primary-main',
      subheader: 'px-4 text-primary-main',
    },
    listItem: {
      root: '',
      padding: 'p-4',
      divider: 'border-b border-primary-main',
      dense: 'py-1',
    },
    listItemButton: {
      root: 'w-full flex rounded',
      dense: 'py-1',
      divider: 'border-b border-gray-200',
      selected: 'bg-gray-700',
      hover: 'hover:bg-gray-700',
      disabled: 'disabled:bg-gray-750',
      disabledChilds: 'group disabled:text-gray-600'
    },
    listItemText: {
      root: 'flex flex-col w-full',
      inset: 'pl-8',
      disabledByParent: 'group-disabled:text-gray-500',
      primaryText: 'text-base font-medium text-gray-200',
      secondaryText: 'text-sm text-gray-400',
    },
  },
  checkBox: {
    root: 'flex-row-reverse justify-end items-center py-4',
    inputRoot: {
      default: 'w-5 h-5 rounded-sm h-100',
      hover: '',
      pressed: '',
      disabled: ''
    },
    label: 'pt-0 mb-0',
  },
  date: {
    root: 'flex flex-col w-100 gap-2',
    label: 'text-sm pt-2',
    inputRoot: {
      default: 'text-base px-4 py-4 border-neutral-stroke-default border-2 rounded-lg bg-neutral-surface-2 text-neutral-text-icon-body border w-full',
      hover: 'hover:border-neutral-stroke-dark',
      pressed: 'active:text-neutral-text-icon-body',
      disabled: 'disabled:text-neutral-stroke-default disabled:bg-neutral-surface-disabled'
    },
    error: 'text-red-300 italic text-sm',
    info: '',
  },
  email: {
    root: 'flex flex-col w-100 gap-2',
    label: 'text-sm pt-2',
    inputRoot: {
      default: 'text-base px-4 py-4 border-neutral-stroke-default border-2 rounded-lg bg-neutral-surface-2 text-neutral-text-icon-body border w-full',
      hover: 'hover:border-neutral-stroke-dark',
      pressed: 'active:text-neutral-text-icon-body',
      disabled: 'disabled:text-neutral-stroke-default disabled:bg-neutral-surface-disabled'
    },
    error: 'text-red-300 italic text-sm',
    info: '',
  },
  number: {
    root: 'flex flex-col w-100 gap-2',
    label: 'text-sm pt-2',
    inputRoot: {
      default: 'text-base px-4 py-4 border-neutral-stroke-default border-2 rounded-lg bg-neutral-surface-2 text-neutral-text-icon-body border w-full',
      hover: 'hover:border-neutral-stroke-dark',
      pressed: 'active:text-neutral-text-icon-body',
      disabled: 'disabled:text-neutral-stroke-default disabled:bg-neutral-surface-disabled'
    },
    error: 'text-red-300 italic text-sm',
    info: '',
  },
  password: {
    root: 'flex flex-col w-100 gap-2',
    label: 'text-sm pt-2',
    inputRoot: {
      default: 'text-base px-4 py-4 border-neutral-stroke-default border-2 rounded-lg bg-neutral-surface-2 text-neutral-text-icon-body border w-full',
      hover: 'hover:border-neutral-stroke-dark',
      pressed: 'active:text-neutral-text-icon-body',
      disabled: 'disabled:text-neutral-stroke-default disabled:bg-neutral-surface-disabled'
    },
    error: 'text-red-300 italic text-sm',
    info: '',
  },
  text: {
    root: 'flex flex-col w-100 gap-2',
    label: 'text-sm pt-2',
    inputRoot: {
      default: 'text-base px-4 py-4 border-neutral-stroke-default border-2 rounded-lg bg-neutral-surface-2 text-neutral-text-icon-body border w-full',
      hover: 'hover:border-neutral-stroke-dark',
      pressed: 'active:text-neutral-text-icon-body',
      disabled: 'disabled:text-neutral-stroke-default disabled:bg-neutral-surface-disabled'
    },
    error: 'text-red-300 italic text-sm',
    info: '',
  },
  textArea: {
    root: 'flex flex-col w-100 gap-2',
    label: 'text-sm pt-2',
    inputRoot: {
      default: 'text-base px-4 py-4 border-neutral-stroke-default border-2 rounded-lg bg-neutral-surface-2 text-neutral-text-icon-body border w-full',
      hover: 'hover:border-neutral-stroke-dark',
      pressed: 'active:text-neutral-text-icon-body',
      disabled: 'disabled:text-neutral-stroke-default disabled:bg-neutral-surface-disabled'
    },
    error: 'text-red-300 italic text-sm',
    info: '',
  },
  time: {
    root: 'flex flex-col w-100 gap-2',
    label: 'text-sm pt-2',
    inputRoot: {
      default: 'text-base px-4 py-4 border-neutral-stroke-default border-2 rounded-lg bg-neutral-surface-2 text-neutral-text-icon-body border w-full',
      hover: 'hover:border-neutral-stroke-dark',
      pressed: 'active:text-neutral-text-icon-body',
      disabled: 'disabled:text-neutral-stroke-default disabled:bg-neutral-surface-disabled'
    },
    error: 'text-red-300 italic text-sm',
    info: '',
  },
  radio: {
    root: 'mb-2 flex gap-2 flex-col',
    buttonContainer: 'flex horizontal gap-2',
    label: '',
    radioContainer: 'flex gap-2',
    error: 'text-red-300 italic text-sm',
    radioButton: 'accent-sky-500 h-4 w-4 rounded-full focus:ring-offset-2 focus:ring-2 focus:ring-primary-surface-default',
  },
  selectInput: {
    root: 'flex flex-col gap-2',
    label: '',
    menuButton:
        'flex px-4 py-1 border-gray-600 border-solid rounded-lg bg-neutral-700 text-lg border text-white w-full items-center [&>*:first-child]:grow',
    menu: 'absolute z-10 min-w-full bg-zinc-700 rounded py-1 mt-1.5 text-base',
    listItem: {
      base: 'block transition duration-200 px-2 cursor-pointer select-none truncate rounded text-lg text-zinc-400 bg-zinc-700 hover:bg-zinc-600 py-2',
      selected: 'text-white hover:opacity-80',
    },
  },
  form: {
    root: '',
    form: '',
    panelStyle: {
      root: 'p-4 flex flex-col gap-2 bg-gray-800 text-xl',
    },
  },
  formTitle: {
    root: 'font-bold text-sky-500 text-2xl mb-3',
  },
  fieldSet: {
    label: 'text-sky-500 text-md',
    root: 'py-4 flex flex-col gap-2 text-xl',
    fieldset: 'grid gap-2 disabled:cursor-disabled grid-cols-4',
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
  modal : {
    root: 'fixed inset-0 z-50 flex items-center justify-center',
    modal: 'z-20 bg-gray-850 text-primary-main p-6 shadow-lg transition-all relative rounded min-w-[500px] flex flex-col space-y-16',
    backdrop: 'absolute inset-0 bg-black opacity-50',
    fullScreen: 'w-screen h-screen',
    closeButton: 'absolute top-4 right-4 text-3xl text-gray-500 hover:text-gray-800 focus:outline-none',
    headerContentContainer: 'flex flex-col flex-1 space-y-4',
    header: 'border-b border-primary-main text-2xl pb-4',
    content: 'text-gray-400',
    actions: 'flex justify-end'
  },
  dnd: {
    sortableList: {
      grid: 'grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-md'
    },
    sortableItem: {
      root: 'relative mb-1 p-2 rounded-lg text-white transition-opacity flex items-center justify-between',
      bgColorClass: 'bg-gray-825',
      dragging: 'opacity-50',
      content: 'flex-1',
      removeButton: 'w-6 h-6 text-gray-300 hover:text-gray-500',
      iconContainer: ''
    },
    droppable: {
      root: '',
      dropping: 'opacity-50'
    },
    draggable: {
      root: 'cursor-grab relative mb-1 p-2 rounded-lg text-white transition-opacity flex items-center justify-between',
      bgColorClass: 'bg-gray-825',
      dragging: 'opacity-50',
      content: 'flex-1',
      removeButton: 'w-6 h-6 text-gray-300 hover:text-gray-500',
      iconContainer: ''
    }
  },
  radioGroup: {
    radio: {
      root: 'flex items-center gap-2',
      inputRoot: 'accent-primary-surface-default h-4 w-4 rounded-full',
      radioDisabled: 'border-gray-400 bg-gray-100 cursor-not-allowed',
      selected: 'bg-primary-main',
      text: 'text-sm text-gray-825',
      textDisabled: 'text-gray-400'
    },
    radioGroup: {
      root: 'flex',
      vertical: 'flex-col space-y-2',
      horizontal: 'flex-row space-x-4'
    }
  },
  select: {
    root: 'relative w-64',
    label: 'block mb-2 text-sm font-medium text-gray-700',
    button: 'flex flex-row items-center justify-between w-full px-4 py-2 text-left bg-neutral-900 border border-gray-400 text-neutral-400 rounded focus:border-primary-surface-dark',
    menu: 'absolute z-10 w-full bg-neutral-surface-1 border border-gray-300 text-neutral-text-icon-body rounded shadow-lg max-h-60 overflow-auto',
    disabled: 'disabled:bg-gray-400',
    optionContainer: {
      default: 'flex items-center hover:bg-neutral-surface-2 justify-between p-2 bg-primary-surface-subtle cursor-pointer',
      selected: 'bg-primary-surface-subtle'
    },
    listItem: {
      base: 'ml-10',
      selected: 'ml-0',
    },
    selectedDefaultIcon: 'h-4.5 w-4.5 ml-2 mr-3 stroke-2'
  },
  divider: {
    root: 'border-0',
    horizontal: 'w-full border-t',
    vertical: 'h-full border-l',
    thin: 'border-[1px]',
    medium: 'border-[2px]',
    thick: 'border-[4px]',
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
    root: 'relative',
    tooltipContainer: 'absolute z-50 p-3 rounded-md shadow-md text-sm w-max',
    colorClass: 'bg-zinc-600 text-white',
    arrow: 'absolute w-3.5 h-2.5 border-t-2 border-r-2 border-transparent',
    arrowColor: 'bg-zinc-600',
  },
  tabs: {
    tabs: {
      root: 'p-2 overflow-auto bg-white whitespace-nowrap w-full flex gap-2 relative',
      colorClass: 'bg-white text-neutral-text-icon-body',
      rootWidth: 'w-max',
      indicator: 'absolute transition-transform duration-300 ease-in-out',
      horizontalIndicator: 'bottom-0 left-0 h-1 w-full',
      verticalIndicator: 'right-0 w-1 h-full',
      colorClassIndicator: 'bg-primary-surface-default',
      tabWrapper: 'w-full relative',
      scrollButton: 'relative z-10 text-white rounded-full p-2',
      scrollableIcon: 'text-neutral-text-icon-body h-4.5 w-4.5',
      scrollableWrapper: 'flex items-center'
    },
    tab: {
      root: 'px-6 py-3',
      activeStyle: 'font-bold text-primary-surface-default',
      colorClass: 'bg-white text-neutral-text-icon-body',
      disabled: 'text-gray-500 bg-white cursor-not-allowed'
    },
    tabPanel: {
      root: 'p-4',
      colorClass: 'bg-white text-primary-surface-default'
    }
  }
}
