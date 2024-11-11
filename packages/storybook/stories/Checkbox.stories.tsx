import React, { useState } from 'react'
import type { Meta, StoryFn } from '@storybook/react'
import type { CheckboxProps } from '@stcland/components'
import { Checkbox, StcStylesProvider } from '@stcland/components'
import { Checkbox as CheckboxWithStyles } from '@stcland/components/withStyles'
import { Icon } from '@stcland/components/icon'
import customStyles from '../stc.config'

// Storybook metadata
export default {
  title: 'Components/Checkbox',
  component: Checkbox,
  argTypes: {
    onChange: { action: 'changed' },
    checked: { control: 'boolean' },
  },
} as Meta

// Utility to manage checkbox state
const Template: StoryFn<CheckboxProps> = (args) => {
  const [checked, setChecked] = useState(args.checked || false)
  const handleChange = () => {
    setChecked(!checked)
    args.onChange()
  }

  return <Checkbox {...args} checked={checked} onChange={handleChange} />
}


export const Default = Template.bind({})
Default.args = {
  checked: false,
  disabled: false,
  required: false,
  sm: true,
  secondary: true
}

// Story with custom icons
export const WithIcons = Template.bind({})
WithIcons.args = {
  checked: true,
  icon: <Icon primary lg iconName='HeartIcon'/>,
  checkedIcon: <Icon primary lg solid iconName='HeartIcon' />,
  disabled: false,
  required: false,
}

export const Disabled = Template.bind({})
Disabled.args = {
  checked: false,
  disabled: true,
  required: false,
}

// Wrapper utility to manage checkbox state with custom styles
const TemplateWithStyles: StoryFn<CheckboxProps> = (args) => {
  const [checked, setChecked] = useState(args.checked || false)
  const handleChange = () => {
    setChecked(!checked)
    args.onChange()
  }

  return (
    <StcStylesProvider customStyles={customStyles}>
      <CheckboxWithStyles {...args} checked={checked} onChange={handleChange} />
    </StcStylesProvider>
  )
}

export const WithStyles = TemplateWithStyles.bind({})
WithStyles.args = {
  primary: true,
  lg: true,
  checked: true
}