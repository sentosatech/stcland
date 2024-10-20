import type { Meta, StoryFn } from '@storybook/react'
import {
  TextArea,
  StcStylesProvider,
  TextAreaProps,
  Fieldset,
} from '@stcland/components'
import * as React from 'react'
import customStyles from '../stc.config'

const meta: Meta<typeof TextArea> = {
  title: 'Components/Form/Input/TextArea',
  component: TextArea,
  parameters: {
    backgrounds: {
      default: 'Dark',
    },
  },
  argTypes: {
    name: {
      type: 'string',
      value: 'textArea',
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
    rows: {
      type: 'number',
      value: 1,
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

const TextTemplate: StoryFn<TextAreaProps> = (args) => (
  <Fieldset withPanel>
    <TextArea {...args} />
  </Fieldset>
)

export const Default = TextTemplate.bind({})
Default.args = {
  name: 'textArea',
  placeholder: 'TextArea',
  label: 'TextArea Input',
  rows: 4,
}

export const Disabled = TextTemplate.bind({})
Disabled.args = {
  name: 'textArea',
  placeholder: 'TextArea',
  label: 'TextArea Input',
  disabled: true,
  rows: 4,
}

export const Required = TextTemplate.bind({})
Required.args = {
  name: 'textArea',
  placeholder: 'TextArea',
  label: 'TextArea Input',
  required: true,
  rows: 4,
}

export const Hidden = TextTemplate.bind({})
Hidden.args = {
  name: 'textArea',
  placeholder: 'TextArea',
  label: 'TextArea Input',
  hidden: true,
  rows: 4,
}

export const Touched = TextTemplate.bind({})
Touched.args = {
  name: 'textArea',
  placeholder: 'TextArea',
  label: 'TextArea Input',
  touched: true,
  rows: 4,
}

export const Dirty = TextTemplate.bind({})
Dirty.args = {
  name: 'textArea',
  placeholder: 'TextArea',
  label: 'TextArea Input',
  touched: true,
  rows: 4,
}
