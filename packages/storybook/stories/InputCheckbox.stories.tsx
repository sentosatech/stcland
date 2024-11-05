import type { Meta, StoryFn } from '@storybook/react'
import {
  CheckBox,
  CheckBoxProps,
  Form,
  StcStylesProvider,
} from '@stcland/components'
import { CheckBox as CheckBoxWithStyles } from '@stcland/components/withStyles'
import * as React from 'react'
import customStyles from '../stc.config'

const meta: Meta<typeof CheckBox> = {
  title: 'Components/Form/Input/Checkbox',
  component: CheckBox,
  argTypes: {
    name: {
      type: 'string',
      value: 'checkbox',
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

const CheckboxInput: StoryFn<CheckBoxProps> = (args) => (
  <Form withPanel>
    <CheckBox {...args} />
  </Form>
)

export const Default = CheckboxInput.bind({})
Default.args = {
  name: 'checkBoxInput',
  placeholder: 'Checkbox',
  label: 'Checkbox Input',
}

export const Disabled = CheckboxInput.bind({})
Disabled.args = {
  name: 'checkBoxInput',
  placeholder: 'Checkbox',
  label: 'Checkbox Input',
  disabled: true,
}

export const Required = CheckboxInput.bind({})
Required.args = {
  name: 'checkBoxInput',
  placeholder: 'Checkbox',
  label: 'Checkbox Input',
  required: true,
}

export const Hidden = CheckboxInput.bind({})
Hidden.args = {
  name: 'checkBoxInput',
  placeholder: 'Checkbox',
  label: 'Checkbox Input',
  hidden: true,
}

const CheckboxInputWithStyles: StoryFn<CheckBoxProps> = (args) => (
  <StcStylesProvider customStyles={customStyles}>
    <Form withPanel>
      <CheckBoxWithStyles {...args} />
    </Form>
  </StcStylesProvider>
)

export const WithStyles = CheckboxInputWithStyles.bind({})
WithStyles.args = {
  name: 'checkBoxInput',
  placeholder: 'Checkbox',
  label: 'Checkbox Input',
}
