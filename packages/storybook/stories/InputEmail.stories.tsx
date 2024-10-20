import type { Meta, StoryFn } from '@storybook/react'
import {
  Email,
  StcStylesProvider,
  EmailProps,
  Fieldset,
} from '@stcland/components'
import * as React from 'react'
import customStyles from '../stc.config'

const meta: Meta<typeof Email> = {
  title: 'Components/Form/Input/Email',
  component: Email,
  parameters: {
    backgrounds: {
      default: 'Dark',
    },
  },
  argTypes: {
    name: {
      type: 'string',
      value: 'email',
    },
    value: {
      type: 'string',
      value: 'test@gmail.com',
    },
    defaultValue: {
      type: 'string',
      value: '',
    },
    id: {
      type: 'string',
      value: 'email_id',
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

const EmailTemplate: StoryFn<EmailProps> = (args) => (
  <Fieldset withPanel>
    <Email {...args} />
  </Fieldset>
)
export const Default = EmailTemplate.bind({})
Default.args = {
  name: 'email',
  placeholder: 'steve@sentosatech.com',
  label: 'Email Input',
}

export const Disabled = EmailTemplate.bind({})
Disabled.args = {
  name: 'email',
  placeholder: 'steve@sentosatech.com',
  label: 'Email Input',
  disabled: true,
}

export const Required = EmailTemplate.bind({})
Required.args = {
  name: 'email',
  placeholder: 'steve@sentosatech.com',
  label: 'Email Input',
  required: true,
}

export const Hidden = EmailTemplate.bind({})
Hidden.args = {
  name: 'email',
  placeholder: 'steve@sentosatech.com',
  label: 'Email Input',
  hidden: true,
}

export const Touched = EmailTemplate.bind({})
Touched.args = {
  name: 'email',
  placeholder: 'steve@sentosatech.com',
  label: 'Email Input',
  touched: true,
}

export const Dirty = EmailTemplate.bind({})
Dirty.args = {
  name: 'email',
  placeholder: 'steve@sentosatech.com',
  label: 'Email Input',
  touched: true,
}
