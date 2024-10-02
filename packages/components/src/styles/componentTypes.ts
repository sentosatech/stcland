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
    solid: string,
    outlined: string
}

export type ButtonStyles = {
    root: string,
    primary: StyleVariant,
    secondary: StyleVariant,
    neutral: StyleVariant,
    sm: string,
    md: string,
    lg: string,
    fullWidth: string,
    rounded: string,
    highlightOnHover: string,
    icon: string,
    disabled:  string,
    button: string,
  }

export type IconStyles = {
    root: string,
    primary: string,
    secondary: string,
    neutral: string,
    sm: string,
    md: string,
    lg: string,
    muted: string,
    rounded: string,
    highlightOnHover: string,
    brightenOnHover: string,
    bright:  string,
  }
