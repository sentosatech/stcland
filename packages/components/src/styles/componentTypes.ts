type DivElementClassName = React.HTMLAttributes<HTMLDivElement>['className'];

export interface BaseStyles {
  root: DivElementClassName;
}

export type AccordionStyles = {
  accordion: {
    root: DivElementClassName;
  };
  accordionSummary: {
    root: DivElementClassName;
    icon: string;
  };
  accordionDetails: {
    root: DivElementClassName;
  };
  accordionAction: {
    root: DivElementClassName;
    spacing: string;
  };
};

export interface TableStyles extends BaseStyles {
  table: string;
  header: string;
  headerRow: string;
  headerCell: string;
  body: string;
  cell: string;
  row: string;
  selectedRow: string;
  subRow: string;
}

type StateVariant = {
  default: string;
  hover: string;
  pressed: string;
  disabled: string;
}

export interface ButtonStyles extends BaseStyles {
  root: string
  primary: StateVariant;
  secondary: StateVariant;
  tertiary: StateVariant;
  sm: string;
  md: string;
  lg: string;
  fullWidth: string;
  rounded: string;
  highlightOnHover: string;
  leftIcon: string;
  rightIcon: string;
  disabled: string;
  button: string;
}

export interface IconStyles extends BaseStyles {
  primary: StateVariant;
  secondary: StateVariant;
  tertiary: StateVariant;
  sm: string;
  md: string;
  lg: string;
  rounded: string;
  highlightOnHover: string;
  bright: string,
  brightenOnHover: string
  muted: string
  icon: string;
  button: string;
}

export interface FieldSetStyles extends BaseStyles {
  label: DivElementClassName;
  title: DivElementClassName;
  fieldset: React.HTMLAttributes<HTMLFieldSetElement>['className'];
}

export interface PanelStyles extends BaseStyles {
  title: DivElementClassName;
}

export interface FormInputStyles extends BaseStyles {
  root: DivElementClassName;
  inputRoot: StateVariant;
  inputContainer: DivElementClassName;
  label: DivElementClassName;
  error: DivElementClassName;
  errorContainer: DivElementClassName;
  errorInput: DivElementClassName;
  icon: {
    icon: DivElementClassName;
    root: DivElementClassName;
  }
  info: DivElementClassName;
}

export interface FormLabelStyles extends BaseStyles {
  required: React.HTMLAttributes<HTMLSpanElement>['className'];
}

export type FormTitleStyles = BaseStyles;

export interface RadioButtonGroupStyles extends BaseStyles {
  label: DivElementClassName;
  buttonContainer: DivElementClassName;
  radioContainer: DivElementClassName;
  errorInput: DivElementClassName;
  errorContainer: DivElementClassName;
  error: DivElementClassName;
  icon: {
    icon: DivElementClassName;
    root: DivElementClassName;
  }
  radioButton: React.HTMLAttributes<HTMLInputElement>['className'];
}

export interface FormStyles extends BaseStyles {
  panelStyle?: Partial<PanelStyles>;
  form: React.HTMLAttributes<HTMLFormElement>['className'];
}

export interface CheckBoxStyles extends BaseStyles {
  inputRoot: StateVariant;
  label: DivElementClassName;
}

export type SelectInputStyles = {
  root: DivElementClassName;
  label: DivElementClassName;
  menuButton: string;
  menu: string;
  listItem: {
    base: string;
    selected: string;
  };
};


export type ListStyles = {
  list: {
    root: DivElementClassName
    dense: string
    padding: string
    divider: string
    gutters: string
    ordered: string
    subheader: DivElementClassName,
  }
  listItem: {
    root: DivElementClassName
    padding: string
    divider: string
    dense: string
  }
  listItemButton: {
    root: DivElementClassName
    dense: string
    divider: string
    selected: string
    hover: string
    disabled: string
    disabledChilds: string
  }
  listItemText: {
    root: DivElementClassName
    inset: string
    disabledByParent: string
    primaryText: DivElementClassName
    secondaryText: DivElementClassName
  }
}

export interface CheckboxStyles extends BaseStyles {
  container: string
  rootWithoutCustomIcons: DivElementClassName
  primary: string
  secondary: string
  tertiary: string
  uncheckedPrimary: string
  uncheckedSecondary: string
  uncheckedTertiary: string
  sm: string
  md: string
  lg: string
  smChecked: string
  mdChecked: string
  lgChecked: string
  disabled: DivElementClassName
  indeterminatePrimary: string
  indeterminateSecondary: string
  indeterminateTertiary: string
  labelPrimary: string
  labelSecondary: string
  labelNeutral: string
  labelCustomIcon: string
}

export interface ModalStyles extends BaseStyles {
  modal: string
  backdrop: string
  fullScreen: string
  closeButton: string
  headerContentContainer: string
  header: DivElementClassName
  content: DivElementClassName
  actions: DivElementClassName
}

export interface DndStyles {
  sortableList: {
    grid: string
  },
  sortableItem: {
    root: string
    bgColorClass: string
    dragging: string
    content: string
    removeButton: string
  },
  droppable: {
    root: string
    dropping: string
  },
  draggable: {
    root: string
    bgColorClass: string
    dragging: string
    content: string
    removeButton: string
  }
}

type RadioStyles = {
  root: DivElementClassName
  inputRoot: DivElementClassName
  radioDisabled: DivElementClassName
  selected: DivElementClassName
  text: DivElementClassName
  textDisabled: DivElementClassName
}

export interface RadioGroupStyles {
  radio: RadioStyles,
  radioGroup: {
    root: DivElementClassName
    vertical: DivElementClassName
    horizontal: DivElementClassName
  },
  isolatedRadio: RadioStyles
}

export interface SelectStyles extends BaseStyles {
  label: DivElementClassName
  menu:  DivElementClassName
  button: DivElementClassName
  disabled: DivElementClassName
  optionContainer: {
    default: DivElementClassName
    selected: DivElementClassName
  }
  listItem: {
    base: DivElementClassName
    selected: DivElementClassName
  },
  selectedDefaultIcon: DivElementClassName
}

export interface DividerStyles extends BaseStyles {
  horizontal: DivElementClassName
  vertical: DivElementClassName
  thin: DivElementClassName
  medium: DivElementClassName
  thick: DivElementClassName
}


export interface CheckboxGroupStyles extends BaseStyles {
  vertical: DivElementClassName
  horizontal: DivElementClassName
  checkbox: CheckboxStyles
}

export interface TooltipStyles extends BaseStyles {
  tooltipContainer: DivElementClassName
  colorClass: DivElementClassName
  arrow: DivElementClassName
  arrowColor: DivElementClassName
}