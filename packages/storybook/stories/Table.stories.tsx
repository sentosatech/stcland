import type { Meta, StoryFn } from '@storybook/react'
import type { ColumnDef, RowSelectionState, ExpandedState } from '@tanstack/react-table'
import { TableProps, Table as TableNoCustomStyles } from '@stcland/components'
import * as React from 'react'
import styles from '../stc.config'

const columns: ColumnDef<any>[] = [
  {
    header: 'Name',
    accessorKey: 'name',
  },
  {
    header: 'Age',
    accessorKey: 'age',
  },
]

const data = [
  { name: 'Juanito Doe', age: 30, subRows: [
    { name: 'Juanito Jr.', age: 5 },
    { name: 'Luna Doe', age: 8 },
  ],
  },
  { name: 'Jane Moreno', age: 25, subRows: [
    { name: 'Maria Moreno', age: 2 },
  ], },
]

const meta : Meta<typeof TableNoCustomStyles> = {
  title: 'Components/Table',
  component: TableNoCustomStyles,
  // decorators: [
  //   (Story) => (
  //     <StcStylesProvider customStyles={styles}>
  //       <Story />
  //     </StcStylesProvider>
  //   ),
  // ],
}

export default meta

const Template: StoryFn<TableProps> = (args) => <TableNoCustomStyles {...args} />

export const Base = Template.bind({})
Base.args = {
  columns,
  data,
}

export const WithCustomStyles = Template.bind({})
WithCustomStyles.args = {
  columns,
  data,
  // customStyles : {
  //   root: 'border border-secondary-main bg-gray-750 px-4 pt-8 pb-14',
  //   table: 'table-fixed',
  //   header: 'text-s text-secondary-main text-left',
  //   headerRow: '',
  //   headerCell: 'font-medium pl-6 pb-4',
  //   body: 'text-s text-gray-400',
  //   row: 'border-t last:border-b border-secondary-main',
  //   cell: 'px-6 py-6',
  // },
}

const WithRowSelectionTemplate: StoryFn<TableProps> = (args) => {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

  return (
    <TableNoCustomStyles
      {...args}
      rowSelection={rowSelection}
      onRowClick={(row: any) => {
        const rowId = row.id
        setRowSelection((prevState) => ({
          ...prevState,
          [rowId]: !prevState[rowId],
        }))
      }}
    />
  )
}

export const WithRowSelected = WithRowSelectionTemplate.bind({})
WithRowSelected.args = {
  columns,
  data,
  customStyles: {
    selectedRow: 'bg-secondary-main text-gray-825'
  }
}

// With Expanded Rows
const sampleColumnsExpandedRows: ColumnDef<any>[] = [
  {
    header: ({ table }) => {
      const isAllExpanded = table.getIsAllRowsExpanded()

      return (
        <div>
          <button
            className='mr-4 cursor-pointer'
            onClick={() => {
              table.toggleAllRowsExpanded(!isAllExpanded)
            }}
          >
            {isAllExpanded ? '▼' : '▶'}
          </button>
      Name
        </div>
      )
    },
    accessorKey: 'name',
    cell: ({ row }) => {
      const isExpanded = row.getIsExpanded()
      const hasSubRows = row.subRows?.length > 0
      const isSubRow = row.depth > 0

      return (
        <div className={isSubRow ? 'pl-6' : ''}>
          {row.depth === 0 && hasSubRows && (
            <span
              className='mr-4 cursor-pointer'
              onClick={row.getToggleExpandedHandler()}
            >
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
          <span>{row.original.name}</span>
        </div>
      )
    },
    size: 200,
  },
  {
    header: 'Age',
    accessorKey: 'age',
  },
]

const sampleDataExpandedRows = [
  { name: 'Juanito Doe', age: 30, subRows: [
    { name: 'Juanito Jr.', age: 5 },
    { name: 'Luna Doe', age: 8 },
  ],
  },
  { name: 'Jane Moreno', age: 25, subRows: [
    { name: 'Maria Moreno', age: 2 },
  ], },
]

const WithExpandedRowsTemplate: StoryFn<TableProps> = (args) => {
  const [expanded, setExpanded] = React.useState<ExpandedState>({})

  return (
    <TableNoCustomStyles
      {...args}
      expanded={expanded}
      setExpanded={setExpanded}
    />
  )
}

export const WithExpandedRows = WithExpandedRowsTemplate.bind({})
WithExpandedRows.args = {
  columns: sampleColumnsExpandedRows,
  data: sampleDataExpandedRows,
  customStyles: {
    subRow: 'text-gray-550',
  }
}