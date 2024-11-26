import React from 'react'
import type { Meta, StoryFn } from '@storybook/react'
import type { DividerProps } from '@stcland/components'
import { Divider, StcStylesProvider } from '@stcland/components'
import { Divider as DividerWithStyles } from '@stcland/components/withStyles'
import customStyles from '../stc.config'

// Storybook metadata
export default {
  title: 'Components/Divider',
  component: Divider,
  argTypes: {
    type: { control: 'text' },
    thickness: { control: 'text' },
    orientation: { control: 'text' },
    borderColorClass: { control: 'text' }
  },
} as Meta

// Utility to manage checkbox state
const Template: StoryFn<DividerProps> = (args) => {
  return <Divider {...args} />
}


export const Default = Template.bind({})

export const Dashed = Template.bind({})
Dashed.args = {
  type: 'dashed',
  thickness: 'thick',
  borderColorClass: 'border-pink-500'
}

export const Dotted = Template.bind({})
Dotted.args = {
  type: 'dotted',
  thickness: 'thick',
  borderColorClass: 'border-purple-700'
}

export const Thin = Template.bind({})
Thin.args = {
  thickness: 'medium',
  borderColorClass: 'border-secondary-main'
}


export const TemplateWithStyles: StoryFn<DividerProps> = (args) => {
  return<StcStylesProvider customStyles={customStyles}>
    <div className='flex flex-col gap-4'>
      <DividerWithStyles thickness='thin' type='dashed' borderColorClass='border-yellow-500' />
      <DividerWithStyles thickness='medium' type='dotted' borderColorClass='border-green-500' />
      <DividerWithStyles thickness='thick' borderColorClass='border-red-300' />
    </div>
  </StcStylesProvider>
}