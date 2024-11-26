import React, { useState } from 'react'
import type { Meta, StoryFn } from '@storybook/react'
import type { CheckboxGroupProps } from '@stcland/components'
import { CheckboxGroup, Checkbox, StcStylesProvider } from '@stcland/components'
import { CheckboxGroup as CheckboxGroupWithStyles } from '@stcland/components/withStyles'
import { Icon } from '@stcland/components/icon'
import customStyles from '../stc.config'

// Storybook metadata
export default {
  title: 'Components/CheckboxGroup',
  component: CheckboxGroup,
  subcomponents: { Checkbox },
  argTypes: {
    options: { label: 'text',
      value: 'text',
      checked: 'boolean',
      disabled: 'boolean' },
    onChange: { action: 'changed' },
  },
} as Meta

// Utility to manage checkbox group state
const Template: StoryFn<CheckboxGroupProps> = (args) => {
  const [options, setOptions] = useState(args.options)

  const handleChange = (updatedOptions: typeof options) => {
    setOptions(updatedOptions)
    args.onChange(updatedOptions)
  }

  return <CheckboxGroup {...args} options={options} onChange={handleChange} />
}

  // Default CheckboxGroup story
export const Default = Template.bind({})
Default.args = {
  options: [
    { label: 'Option 1', value: 'option1', checked: true },
    { label: 'Option 2', value: 'option2', checked: true },
    { label: 'Option 3', value: 'option3', checked: false },
  ],
}

// Horizontal Layout
export const DefaultHorizontal = Template.bind({})
DefaultHorizontal.args = {
  orientation: 'horizontal',
  className: 'bg-gray-900 p-4',
  options: [
    { label: 'Option 1', value: 'option1', checked: true, sm: true, secondary: true },
    { label: 'Option 2', value: 'option2', checked: true , sm: true, secondary: true },
    { label: 'Option 3', value: 'option3', checked: false, sm: true, secondary: true },
  ],
}
  // CheckboxGroup with custom icons
export const WithIcons = Template.bind({})
WithIcons.args = {
  options: [
    {
      label: 'Option 1',
      value: 'option1',
      checked: false,
      icon: <Icon neutral lg iconName="HeartIcon" />,
      checkedIcon: <Icon neutral lg solid iconName="HeartIcon" />,
    },
    {
      label: 'Option 2',
      value: 'option2',
      checked: true,
      icon: <Icon neutral lg iconName="ChatBubbleOvalLeftIcon" />,
      checkedIcon: <Icon neutral lg solid iconName="ChatBubbleOvalLeftIcon" />,
    },
    {
      label: 'Option 3',
      value: 'option3',
      icon: <Icon neutral lg iconName="ShieldCheckIcon" />,
      checkedIcon: <Icon neutral lg solid iconName="ShieldCheckIcon" />,
      checked: false,
    },
  ],
}

  // Disabled CheckboxGroup
export const Disabled = Template.bind({})
Disabled.args = {
  options: [
    { label: 'Option 1', value: 'option1', checked: false, disabled: true },
    { label: 'Option 2', value: 'option2', checked: true, disabled: true },
    { label: 'Option 3', value: 'option3', checked: false, disabled: true },
  ],
}


// CheckboxGroup with Custom Styles
export const WithStyles = (args: CheckboxGroupProps) => {
  const [options, setOptions] = useState(args.options)

  const handleChange = (updatedOptions: typeof options) => {
    setOptions(updatedOptions)
    args.onChange(updatedOptions)
  }

  return (
    <StcStylesProvider customStyles={customStyles}>
      <CheckboxGroupWithStyles {...args} options={options} onChange={handleChange} />
    </StcStylesProvider>
  )
}

WithStyles.args = {
  options: [
    { label: 'Option 1', value: 'option1', checked: false, primary: true, sm: true },
    { label: 'Option 2', value: 'option2', checked: true, secondary: true, sm: true },
    { label: 'Option 3', value: 'option3', checked: false, neutral: true, sm: true },
  ],
}