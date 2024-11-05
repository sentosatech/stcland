import type { Meta, StoryFn } from '@storybook/react'
import {
  RadioButtonGroup,
  StcStylesProvider,
  RadioButtonGroupProps,
  Form,
} from '@stcland/components'
import { RadioButtonGroup as RadioButtonGroupWithStyles } from '@stcland/components'
import * as React from 'react'
import customStyles from '../stc.config'

const meta: Meta<typeof RadioButtonGroup> = {
  title: 'Components/Form/Input/RadioButtonGroup',
  component: RadioButtonGroup,
  parameters: {
    backgrounds: {
      default: 'Dark',
    },
  },
  argTypes: {
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
    direction: {
      type: 'boolean',
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
  },
}

export default meta

const RadioButtonGroupTemplate: StoryFn<RadioButtonGroupProps> = (args) => (
  <Form withPanel>
    <RadioButtonGroup {...args} />
  </Form>
)

export const Default = RadioButtonGroupTemplate.bind({})
Default.args = {
  name: 'gender',
  label: 'Gender Input',
  radioButtons: [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ],
}

export const Disabled = RadioButtonGroupTemplate.bind({})
Disabled.args = {
  name: 'gender',
  label: 'Gender Input',
  disabled: true,
  radioButtons: [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ],
}

export const Required = RadioButtonGroupTemplate.bind({})
Required.args = {
  name: 'gender',
  label: 'Gender Input',
  required: true,
  radioButtons: [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ],
}

export const Hidden = RadioButtonGroupTemplate.bind({})
Hidden.args = {
  name: 'gender',
  label: 'Gender Input',
  hidden: true,
  radioButtons: [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ],
}

export const Vertical = RadioButtonGroupTemplate.bind({})
Vertical.args = {
  name: 'options',
  label: 'Gender Input',
  direction: 'vertical',
  radioButtons: [
    { value: 'option 1', label: 'Option 1' },
    { value: 'option 2', label: 'Option 2' },
    { value: 'option 3', label: 'Option 3' },
    { value: 'option 4', label: 'Option 4' },
  ],
}

const TemplateWithStyles: StoryFn<RadioButtonGroupProps> = (args) => (
  <StcStylesProvider customStyles={customStyles}>
    <Form withPanel>
      <RadioButtonGroupWithStyles {...args} />
    </Form>
  </StcStylesProvider>
)

export const WithStyles = TemplateWithStyles.bind({})
WithStyles.args = {
  name: 'options',
  label: 'Gender Input',
  radioButtons: [
    { value: 'option 1', label: 'Option 1' },
    { value: 'option 2', label: 'Option 2' },
    { value: 'option 3', label: 'Option 3' },
    { value: 'option 4', label: 'Option 4' },
  ],
}
