import type {
  AccordionStyles,
  ButtonStyles,
  CheckBoxStyles,
  FieldSetStyles,
  FormInputStyles,
  FormStyles,
  FormTitleStyles,
  IconStyles,
  RadioButtonGroupStyles,
  SelectStyles,
  TableStyles,
} from '.'

export type StclandStyles = {
  table?: Partial<TableStyles>;
  button?: Partial<ButtonStyles>;
  // Do we want this granularity?
  submitButton?: Partial<ButtonStyles>;
  resetButton?: Partial<ButtonStyles>;
  icon?: Partial<IconStyles>;
  accordion?: Partial<AccordionStyles>;

  // Form styles
  form?: Partial<FormStyles>;
  formTitle?: Partial<FormTitleStyles>;
  fieldSet?: Partial<FieldSetStyles>;
  checkbox?: Partial<CheckBoxStyles>;
  date?: Partial<FormInputStyles>;
  email?: Partial<FormInputStyles>;
  number?: Partial<FormInputStyles>;
  password?: Partial<FormInputStyles>;
  radio?: Partial<RadioButtonGroupStyles>;
  select?: Partial<SelectStyles>;
  text?: Partial<FormInputStyles>;
  textArea?: Partial<FormInputStyles>;
  time?: Partial<FormInputStyles>;
};

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
      outlined:
        'border border-primary-dark text-primary-main hover:border-primary-dark hover:bg-primary-range-200',
      solid: 'bg-primary-dark hover:bg-primary-range-900 text-gray-50',
    },
    secondary: {
      outlined:
        'border border-secondary-dark text-secondary-dark hover:border-secondary-main hover:bg-secondary-range-200',
      solid: 'bg-secondary-dark hover:bg-secondary-range-900 text-gray-50',
    },
    neutral: {
      outlined:
        'border border-gray-700 text-gray-500 hover:border-gray-600 hover:bg-gray-200',
      solid: 'bg-gray-700 hover:bg-gray-600 text-gray-300',
    },
    sm: 'p-2 text-1.5xs',
    md: 'p-3 text-sm',
    lg: 'p-3 text-md',
    fullWidth: 'w-full',
    rounded: 'rounded-md',
    highlightOnHover: 'hover:bg-gray-600',
    icon: 'w-1.5 h-1.5 inline',
    disabled: 'bg-gray-300 text-gray-400 hover:bg-gray-350',
    button: 'w-full',
  },
  icon: {
    root: 'p-2',
    secondary: 'text-secondary-main',
    primary: 'text-primary-main',
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
    accordion: { root: 'border rounded bg-gray-825' },
    accordionSummary: {
      root: 'flex justify-between items-center p-4 cursor-pointer bg-gray-825 text-gray-100 border-b border-primary-main',
      icon: 'ml-2 transition-transform duration-300 ease-in-out',
    },
    accordionDetails: { root: 'bg-gray-825 text-gray-400' },
    accordionAction: { root: 'flex justify-end gap-2', spacing: 'p-4' },
  },
  checkbox: {
    root: 'flex-row-reverse justify-end items-center py-4',
    inputRoot: 'accent-sky-500 rounded-sm h-100',
    label: 'pt-0 mb-0',
  },
  date: {
    root: 'flex flex-col w-100 gap-2',
    label: 'text-sm pt-2',
    inputRoot:
      'px-4 py-4 border-gray-600 border-solid rounded-lg bg-neutral-700 text-lg border text-white w-full dark:[color-scheme:dark] disabled:text-zinc-400',
    error: 'text-red-300 italic text-sm',
    info: '',
  },
  email: {
    root: 'flex flex-col w-100 gap-2',
    label: 'text-sm pt-2',
    inputRoot:
      'px-4 py-4 border-gray-600 border-solid rounded-lg bg-neutral-700 text-lg border text-white w-full dark:[color-scheme:dark] disabled:text-zinc-400',
    error: 'text-red-300 italic text-sm',
    info: '',
  },
  number: {
    root: 'flex flex-col w-100 gap-2',
    label: 'text-sm pt-2',
    inputRoot:
      'px-4 py-4 border-gray-600 border-solid rounded-lg bg-neutral-700 text-lg border text-white w-full dark:[color-scheme:dark] disabled:text-zinc-400',
    error: 'text-red-300 italic text-sm',
    info: '',
  },
  password: {
    root: 'flex flex-col w-100 gap-2',
    label: 'text-sm pt-2',
    inputRoot:
      'px-4 py-4 border-gray-600 border-solid rounded-lg bg-neutral-700 text-lg border text-white w-full dark:[color-scheme:dark] disabled:text-zinc-400',
    error: 'text-red-300 italic text-sm',
    info: '',
  },
  text: {
    root: 'flex flex-col w-100 gap-2',
    label: 'text-sm pt-2',
    inputRoot:
      'px-4 py-4 border-gray-600 border-solid rounded-lg bg-neutral-700 text-lg border text-white w-full dark:[color-scheme:dark] disabled:text-zinc-400',
    error: 'text-red-300 italic text-sm',
    info: '',
  },
  textArea: {
    root: 'flex flex-col w-100 gap-2',
    label: 'text-sm pt-2',
    inputRoot:
      'h-14 px-4 py-4 border-gray-600 border-solid rounded-lg bg-neutral-700 text-lg border text-white w-full dark:[color-scheme:dark] disabled:text-zinc-400',
    error: 'text-red-300 italic text-sm',
    info: '',
  },
  time: {
    root: 'flex flex-col w-100 gap-2',
    label: 'text-sm pt-2',
    inputRoot:
      'px-4 py-4 border-gray-600 border-solid rounded-lg bg-neutral-700 text-lg border text-white w-full dark:[color-scheme:dark] disabled:text-zinc-400',
    error: 'text-red-300 italic text-sm',
    info: '',
  },
  radio: {
    root: 'mb-2 flex gap-2 flex-col',
    buttonContainer: 'flex horizontal gap-2',
    label: '',
    radioContainer: 'flex gap-2',
    error: 'text-red-300 italic text-sm',
    radioButton: 'accent-sky-500 h-4 w-4',
  },
  select: {
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
}
