import type { Meta, StoryFn } from '@storybook/react'
import {
  Password,
  StcStylesProvider,
  PasswordProps,
  Fieldset,
} from '@stcland/components'
import * as React from 'react'
import customStyles from '../stc.config'

const meta: Meta<typeof Password> = {
  title: 'Components/Form/Input/Password',
  component: Password,
  parameters: {
    backgrounds: {
      default: 'Dark',
    },
  },
  argTypes: {
    name: {
      type: 'string',
      value: 'password',
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

const PasswordTemplate: StoryFn<PasswordProps> = (args) => (
  <Fieldset withPanel>
    <Password {...args} />
  </Fieldset>
)

export const Default = PasswordTemplate.bind({})
Default.args = {
  name: 'password',
  placeholder: 'Password',
  label: 'Password Input',
}

export const Disabled = PasswordTemplate.bind({})
Disabled.args = {
  name: 'password',
  placeholder: 'Password',
  label: 'Password Input',
  disabled: true,
}

export const Required = PasswordTemplate.bind({})
Required.args = {
  name: 'password',
  placeholder: 'Password',
  label: 'Password Input',
  required: true,
}

export const Hidden = PasswordTemplate.bind({})
Hidden.args = {
  name: 'password',
  placeholder: 'Password',
  label: 'Password Input',
  hidden: true,
}

export const Touched = PasswordTemplate.bind({})
Touched.args = {
  name: 'password',
  placeholder: 'Password',
  label: 'Password Input',
  touched: true,
}

export const Dirty = PasswordTemplate.bind({})
Dirty.args = {
  name: 'password',
  placeholder: 'Password',
  label: 'Password Input',
  touched: true,
}
