import type { Meta, StoryFn } from '@storybook/react'
import type { ColumnDef, RowSelectionState } from '@tanstack/react-table'
import Table, { Props } from './Table'
import * as React from 'react'

const sampleColumns: ColumnDef<any>[] = [
  {
    header: 'Name',
    accessorKey: 'name',
  },
  {
    header: 'Age',
    accessorKey: 'age',
  },
]

const sampleData = [
  { name: 'Juanito Doe', age: 30 },
  { name: 'Jane Moreno', age: 25 },
]

const meta : Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
}

export default meta

const Template: StoryFn<Props> = (args) => <Table {...args} />

export const Base = Template.bind({})
Base.args = {
  columns: sampleColumns,
  data: sampleData,
  className: 'bg-gray-825'
}

export const WithCustomStyles = Template.bind({})
WithCustomStyles.args = {
  columns: sampleColumns,
  data: sampleData,
  customStyles: {
    root: 'border border-secondary-main bg-gray-750 px-4 pt-8 pb-14',
    table: 'table-fixed',
    header: 'text-s text-secondary-main text-left',
    headerRow: '',
    headerCell: 'font-medium pl-6 pb-4',
    body: 'text-s text-gray-400',
    row: 'border-t last:border-b border-secondary-main',
    cell: 'px-6 py-6',
  },
}

const WithRowSelectionTemplate: StoryFn<Props> = (args) => {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({ '0': true })

  return (
    <Table
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
  columns: sampleColumns,
  data: sampleData,
  customStyles: {
    selectedRow: 'bg-secondary-main text-gray-825'
  }
}
