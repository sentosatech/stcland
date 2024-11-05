export type TableStyles = {
    root: string
    table: string
    header: string
    headerRow: string
    headerCell: string
    body: string
    cell: string
    row: string
    selectedRow: string
    subRow: string
  }

type StyleVariant = {
    solid: string
    outlined: string
}

export type ButtonStyles = {
    root: string
    primary: StyleVariant
    secondary: StyleVariant
    neutral: StyleVariant
    sm: string
    md: string
    lg: string
    fullWidth: string
    rounded: string
    highlightOnHover: string
    icon: string
    disabled:  string
    button: string
  }

export type IconStyles = {
    root: string
    primary: string
    secondary: string
    neutral: string
    sm: string
    md: string
    lg: string
    muted: string
    rounded: string
    highlightOnHover: string
    brightenOnHover: string
    bright:  string
  }

export type AccordionStyles = {
    accordion: {
      root: string
    }
    accordionSummary: {
      root: string,
      icon: string
    }
    accordionDetails: {
      root: string }
    accordionAction: {
      root: string,
      spacing: string }
  }

export type ListStyles = {
    list: {
      root: string,
      dense: string,
      padding: string,
      gutters: string,
      ordered: string,
    }
    listItem: {
      root: string,
      padding: string,
      divider: string,
      dense: string,
      listItem: string,
      secondaryAction: string,
    }
    listItemButton: {
      root: string,
      dense: string,
      divider: string,
      selected: string,
      hover: string,
      disabled: string,
      disabledChilds: string,
    }
    listItemIcon: {
      root: string,
    },
    listItemText: {
      root: string,
      inset: string,
      disabledByParent: string,
      primaryContent: string,
      secondaryContent: string,
    },
    listItemSubheader: {
      root: string,
      neutral: string,
      primary: string,
      secondary: string,
      sticky: string,
      inset: string,
    }
  }