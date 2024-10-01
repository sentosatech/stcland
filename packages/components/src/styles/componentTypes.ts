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
    brightenOnHover: string,
    icon: Partial<{
        width: string,
        height: string,
        display: string
    }>,
    disabled:  string,
    button: string,
  }
