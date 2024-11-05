import type { Meta, StoryFn } from '@storybook/react'
import {
  DateInput,
  StcStylesProvider,
  DateInputProps,
  Form,
} from '@stcland/components'
import * as React from 'react'
import { DateInput as DateInputWithStyles } from '@stcland/components/withStyles'
import customStyles from '../stc.config'

const meta: Meta<typeof DateInput> = {
  title: 'Components/Form/Input/DateInput',
  component: DateInput,
  argTypes: {
    name: {
      type: 'string',
      value: 'dateInput',
    },
    value: {
      type: 'string',
      value: 1,
    },
    defaultValue: {
      type: 'string',
      value: '',
    },
    id: {
      type: 'string',
      value: 'number_id',
    },
    valueAsNumber: {
      type: 'boolean',
      value: false,
    },
    required: {
      type: 'boolean',
      value: false,
    },
    disabled: {
      type: 'boolean',
      value: false,
    },
    hidden: {
      type: 'boolean',
      value: false,
    },
    touched: {
      type: 'boolean',
      value: false,
    },
    dirty: {
      type: 'boolean',
      value: false,
    },
    onFocus: {
      type: 'function',
      value: (e: unknown) => console.log(e),
    },
    onChange: {
      type: 'function',
      value: (e: unknown) => console.log(e),
    },
  },
}

export default meta

const DateInputTemplate: StoryFn<DateInputProps> = (args) => (
  <Form withPanel>
    <DateInput {...args} />
  </Form>
)

export const Default = DateInputTemplate.bind({})
Default.args = {
  name: 'dateInput',
  placeholder: 'DateInput',
  label: 'DateInput Input',
}

export const Disabled = DateInputTemplate.bind({})
Disabled.args = {
  name: 'dateInput',
  placeholder: 'DateInput',
  label: 'DateInput Input',
  disabled: true,
}

export const Required = DateInputTemplate.bind({})
Required.args = {
  name: 'dateInput',
  placeholder: 'DateInput',
  label: 'DateInput Input',
  required: true,
}

export const Hidden = DateInputTemplate.bind({})
Hidden.args = {
  name: 'dateInput',
  placeholder: 'DateInput',
  label: 'DateInput Input',
  hidden: true,
}

const TemplateWithStyles: StoryFn<DateInputProps> = (args) => (
  <StcStylesProvider customStyles={customStyles}>
    <Form withPanel>
      <DateInputWithStyles {...args} />
    </Form>
  </StcStylesProvider>
)

export const WithStyles = TemplateWithStyles.bind({})
WithStyles.args = {
  name: 'dateInput',
  placeholder: 'DateInput',
  label: 'DateInput Input',
}
