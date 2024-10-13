import type { Meta, StoryFn } from '@storybook/react'
import {
  TimeInput,
  StcStylesProvider,
  TimeInputProps,
} from '@stcland/components'
import * as React from 'react'
import customStyles from '../stc.config'

const meta: Meta<typeof TimeInput> = {
  title: 'Components/Form/Input/TimeInput',
  component: TimeInput,
  argTypes: {
    name: {
      type: 'string',
      value: 'timeInput',
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

const TimeInputTemplate: StoryFn<TimeInputProps> = (args) => (
  <TimeInput {...args} />
)

export const Default = TimeInputTemplate.bind({})
Default.args = {
  name: 'timeInput',
  placeholder: 'TimeInput',
  label: 'TimeInput Input',
}

export const Disabled = TimeInputTemplate.bind({})
Disabled.args = {
  name: 'timeInput',
  placeholder: 'TimeInput',
  label: 'TimeInput Input',
  disabled: true,
}

export const Required = TimeInputTemplate.bind({})
Required.args = {
  name: 'timeInput',
  placeholder: 'TimeInput',
  label: 'TimeInput Input',
  required: true,
}

export const Hidden = TimeInputTemplate.bind({})
Hidden.args = {
  name: 'timeInput',
  placeholder: 'TimeInput',
  label: 'TimeInput Input',
  hidden: true,
}

export const Touched = TimeInputTemplate.bind({})
Touched.args = {
  name: 'timeInput',
  placeholder: 'TimeInput',
  label: 'TimeInput Input',
  touched: true,
}

export const Dirty = TimeInputTemplate.bind({})
Dirty.args = {
  name: 'timeInput',
  placeholder: 'TimeInput',
  label: 'TimeInput Input',
  touched: true,
}
