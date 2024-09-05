import {
  ColumnDef,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  RowData,
  RowSelectionState,
  useReactTable,
} from '@tanstack/react-table'
import { cns, withCustomStyles } from '@stcland/utils'
import '../index.css'


//*****************************************************************************
// Interface
//*****************************************************************************

// To customize styling of specific table elements
export type CustomStylesShape = {
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

export interface Props {
  // title: string
  columns: ColumnDef<any>[]
  data: {[key: string]: any}[]
  className?: string
  customStyles?: Partial<CustomStylesShape>
  expanded?: ExpandedState
  setExpanded?: (value) => void
  rowSelection?: RowSelectionState
  onRowClick?: (row: RowData) => void
}

//*****************************************************************************
// Components
//*****************************************************************************

const Table = ({
  // title,
  columns,
  data = [],
  customStyles = {},
  className,
  expanded,
  setExpanded,
  rowSelection,
  onRowClick,
}: Props) => {

  const tableInstance = useReactTable({
    columns: columns,
    data: data,
    state: {
      rowSelection: rowSelection || {},
      expanded,
    },
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getSubRows: (row) => row.subRows,
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    autoResetExpanded: false,
    getIsRowExpanded(row) {
      if (typeof expanded === 'boolean' && expanded) return true
      return !!expanded?.[row.id]
    },
  })

  const defaultStyles : CustomStylesShape = {
    root: cns('border border-gray-825 bg-gray-825 px-4 pt-8 pb-14', className),
    table: 'table-fixed',
    header: 'text-s text-gray-100 text-left',
    headerRow: '',
    headerCell: 'font-medium pl-6 pb-4',
    body: 'text-s text-gray-400',
    row: 'border-t last:border-b border-primary-dark',
    cell: 'px-6 py-6',
    selectedRow: 'bg-gray-500',
    subRow: 'text-secondary-main border-none',
  }
  const cn  = withCustomStyles<CustomStylesShape>( defaultStyles, customStyles)

  return (
    <div className={cn.root}>
      <table className={cn.table}>
        <thead className={cn.header}>
          {tableInstance.getHeaderGroups().map(function (headerGroup) {
            return (
              /* Current header row */
              <tr key={headerGroup.id} className={cn.headerRow}>
                {headerGroup.headers.map(function (column) {
                  if (column.id === 'extraLine') return null
                  return (
                    /* Current header cell */
                    <th
                      key={column.id}
                      colSpan={column.colSpan}
                      style={{ width: column.getSize() }}
                      className={cn.headerCell}
                    >
                      {column.isPlaceholder !== null &&
                        <div>
                          {flexRender(column.column.columnDef.header, column.getContext())}
                        </div>
                      }
                    </th>
                  )
                })}
              </tr>
            )
          })}
        </thead>

        <tbody className={cn.body}>
          {tableInstance.getRowModel().rows.map(function (row) {
            const isSelected = row.getIsSelected()
            const isSubRow = row.depth > 0
            const rowStyleVariants = {
              [cn.selectedRow] : isSelected,
              [cn.subRow] : isSubRow
            }
            return (
              /* table row */
              <tr
                key={row.id}
                className={cns(cn.row, rowStyleVariants)}
                onClick={() => onRowClick?.(row)}
              >
                {row.getVisibleCells().map((cell) => {
                  // Must be equal to undefined, otherwise may not show zeros
                  if (cell.getValue() === undefined) return null

                  return (
                    <td
                      key={cell.id}
                      colSpan={row.depth > 0 ? row.getAllCells().length - 1 : undefined}
                      style={{ width: cell.column.getSize() }}
                      align={(cell.column.columnDef.meta as any)?.align}
                      className={cns(
                        (cell.column.columnDef.meta as any)?.className,
                        cn.cell,
                        customStyles?.cell
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Table
