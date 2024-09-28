import type { Meta, StoryFn } from '@storybook/react'
import type { ColumnDef } from '@tanstack/react-table'
import { TableProps } from '@stcland/components'
import { StcStylesProvider, getStyles } from '@stcland/components'
import { Table } from '@stcland/components/withStyles'
import * as React from 'react'
import customStyles from '../stc.config'

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
  {
    name: 'Juanito Doe',
    age: 30,
    subRows: [
      { name: 'Juanito Jr.', age: 5 },
      { name: 'Luna Doe', age: 8 },
    ],
  },
  {
    name: 'Jane Moreno',
    age: 25,
    subRows: [
      { name: 'Maria Moreno', age: 2 },
    ],
  },
]


const meta: Meta<typeof Table> = {
  title: 'Components/Test',
  component: Table,
  decorators: [
    (Story) => (
      <StcStylesProvider customStyles={customStyles}>
        <Story />
      </StcStylesProvider>
    ),
  ],
}
export default meta

export const MinimalTable: StoryFn<TableProps> = () => <Table columns={columns} data={data} />
