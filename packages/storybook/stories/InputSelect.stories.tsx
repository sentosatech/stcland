import type { Meta, StoryFn } from '@storybook/react'
import {
  Select,
  SelectProps,
  StcStylesProvider,
  Form,
} from '@stcland/components'
import { Select as SelectWithStyles } from '@stcland/components/withStyles'
import * as React from 'react'
import customStyles from '../stc.config'

const meta: Meta<typeof Select> = {
  title: 'Components/Form/Input/Select',
  component: Select,
  parameters: {
    backgrounds: {
      default: 'Dark',
    },
  },
  argTypes: {
    options: {
      value: [
        {
          value: 'option 1',
          label: 'Option 1',
        },
        {
          value: 'option 2',
          label: 'Option 2',
        },
      ],
    },
    name: {
      type: 'string',
      value: 'gender',
    },
    required: {
      type: 'boolean',
      control: 'check',
      value: false,
    },
    disabled: {
      type: 'boolean',
      control: 'check',
      value: false,
    },
    hidden: {
      type: 'boolean',
      control: 'check',
      value: false,
    },
  },
}

export default meta

const RadioButtonGroupTemplate: StoryFn<SelectProps> = (args) => (
  <Form withPanel>
    <Select {...args} onSelectionChange={console.log} />
  </Form>
)

export const Default = RadioButtonGroupTemplate.bind({})
Default.args = {
  name: 'gender',
  label: 'Gender Input',
  options: [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ],
}

export const Required = RadioButtonGroupTemplate.bind({})
Required.args = {
  name: 'gender',
  label: 'Gender Input',
  required: true,
  options: [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ],
}

export const Disabled = RadioButtonGroupTemplate.bind({})
Disabled.args = {
  name: 'gender',
  label: 'Gender Input',
  disabled: true,
  options: [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ],
}

export const Hidden = RadioButtonGroupTemplate.bind({})
Hidden.args = {
  name: 'gender',
  label: 'Gender Input',
  hidden: true,
  options: [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ],
}

const TemplateWithStyles: StoryFn<SelectProps> = (args) => (
  <StcStylesProvider customStyles={customStyles}>
    <Form withPanel>
      <SelectWithStyles {...args} />
    </Form>
  </StcStylesProvider>
)

export const WithStyles = TemplateWithStyles.bind({})
WithStyles.args = {
  name: 'gender',
  label: 'Gender Input',
  options: [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ],
}
