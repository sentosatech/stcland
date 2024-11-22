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

type StyleVariant = {
  solid: string;
  outlined: string;
};

export interface ButtonStyles extends BaseStyles {
  primary: StyleVariant;
  secondary: StyleVariant;
  neutral: StyleVariant;
  sm: string;
  md: string;
  lg: string;
  fullWidth: string;
  rounded: string;
  highlightOnHover: string;
  icon: string;
  disabled: string;
  button: string;
}

export interface IconStyles extends BaseStyles {
  primary: string;
  secondary: string;
  neutral: string;
  sm: string;
  md: string;
  lg: string;
  muted: string;
  rounded: string;
  highlightOnHover: string;
  brightenOnHover: string;
  bright: string;
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
  inputRoot: React.HTMLAttributes<HTMLInputElement>['className'];
  inputContainer: DivElementClassName;
  label: DivElementClassName;
  error: DivElementClassName;
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
  error: DivElementClassName;
  radioButton: React.HTMLAttributes<HTMLInputElement>['className'];
}

export interface FormStyles extends BaseStyles {
  panelStyle?: Partial<PanelStyles>;
  form: React.HTMLAttributes<HTMLFormElement>['className'];
}

export interface CheckBoxStyles extends BaseStyles {
  inputRoot: DivElementClassName;
  label: DivElementClassName;
}

export type SelectStyles = {
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
  neutral: string
  uncheckedPrimary: string
  uncheckedSecondary: string
  uncheckedNeutral: string
  sm: string
  md: string
  lg: string
  smChecked: string
  mdChecked: string
  lgChecked: string
  disabled: DivElementClassName
  indeterminatePrimary: string
  indeterminateSecondary: string
  indeterminateNeutral: string
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