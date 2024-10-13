import type { Meta, StoryFn } from '@storybook/react'
import {
  NumberInput,
  StcStylesProvider,
  NumberProps,
} from '@stcland/components'
import * as React from 'react'
import customStyles from '../stc.config'

const meta: Meta<typeof NumberInput> = {
  title: 'Components/Form/Input/Number',
  component: NumberInput,
  argTypes: {
    name: {
      type: 'string',
      value: 'number',
    },
    value: {
      type: 'number',
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

const NumberInputTemplate: StoryFn<NumberProps> = (args) => (
  <NumberInput {...args} />
)

export const Default = NumberInputTemplate.bind({})
Default.args = {
  name: 'number',
  placeholder: 'Number',
  label: 'Number Input',
}

export const Disabled = NumberInputTemplate.bind({})
Disabled.args = {
  name: 'number',
  placeholder: 'Number',
  label: 'Number Input',
  disabled: true,
}

export const Required = NumberInputTemplate.bind({})
Required.args = {
  name: 'number',
  placeholder: 'Number',
  label: 'Number Input',
  required: true,
}

export const Hidden = NumberInputTemplate.bind({})
Hidden.args = {
  name: 'number',
  placeholder: 'Number',
  label: 'Number Input',
  hidden: true,
}

export const Touched = NumberInputTemplate.bind({})
Touched.args = {
  name: 'number',
  placeholder: 'Number',
  label: 'Number Input',
  touched: true,
}

export const Dirty = NumberInputTemplate.bind({})
Dirty.args = {
  name: 'number',
  placeholder: 'Number',
  label: 'Number Input',
  touched: true,
}
