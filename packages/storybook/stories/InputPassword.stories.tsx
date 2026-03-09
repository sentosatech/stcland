import type { Meta, StoryFn } from '@storybook/react'
import {
  Password,
  StcStylesProvider,
  PasswordProps,
  Form,
} from '@stcland/components'
import { Password as PasswordWithStyles } from '@stcland/components/withStyles'
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
  <Form withPanel>
    <Password {...args} />
  </Form>
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

const TemplateWithStyles: StoryFn<PasswordProps> = (args) => (
  <StcStylesProvider customStyles={customStyles}>
    <Form withPanel>
      <PasswordWithStyles {...args} />
    </Form>
  </StcStylesProvider>
)

export const WithStyles = TemplateWithStyles.bind({})
WithStyles.args = {
  name: 'password',
  placeholder: 'Password',
  label: 'Password Input',
}
