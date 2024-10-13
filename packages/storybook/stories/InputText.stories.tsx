import type { Meta, StoryFn } from '@storybook/react'
import { Text, StcStylesProvider, TextProps } from '@stcland/components'
import * as React from 'react'
import customStyles from '../stc.config'

const meta: Meta<typeof Text> = {
  title: 'Components/Form/Input/Text',
  component: Text,
  argTypes: {
    name: {
      type: 'string',
      value: 'text',
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

const TextTemplate: StoryFn<TextProps> = (args) => <Text {...args} />

export const Default = TextTemplate.bind({})
Default.args = {
  name: 'text',
  placeholder: 'Text',
  label: 'Text Input',
}

export const Disabled = TextTemplate.bind({})
Disabled.args = {
  name: 'text',
  placeholder: 'Text',
  label: 'Text Input',
  disabled: true,
}

export const Required = TextTemplate.bind({})
Required.args = {
  name: 'text',
  placeholder: 'Text',
  label: 'Text Input',
  required: true,
}

export const Hidden = TextTemplate.bind({})
Hidden.args = {
  name: 'text',
  placeholder: 'Text',
  label: 'Text Input',
  hidden: true,
}

export const Touched = TextTemplate.bind({})
Touched.args = {
  name: 'text',
  placeholder: 'Text',
  label: 'Text Input',
  touched: true,
}

export const Dirty = TextTemplate.bind({})
Dirty.args = {
  name: 'text',
  placeholder: 'Text',
  label: 'Text Input',
  touched: true,
}
