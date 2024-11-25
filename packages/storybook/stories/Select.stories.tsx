import React from 'react'
import { Meta, StoryFn } from '@storybook/react'
import { Select, SelectProps, StcStylesProvider } from '@stcland/components'
import { Select as SelectWithStyles } from '@stcland/components/withStyles'
import { Icon } from '@stcland/components/icon'
import customStyles from '../stc.config'

export default {
  title: 'Components/Select',
  component: Select,
  argTypes: {
    options: { value: [
      {
        value: 'option 1',
        label: 'Option 1',
      },
      {
        value: 'option 2',
        label: 'Option 2',
      },
    ], },
    selected: { control: 'text' },
    placeholder: { control: 'text' },
    label: { control: 'text' },
    onChange: { action: 'changed' },
  },
} as Meta

// Utility to create the Select component stories
const Template: StoryFn<typeof Select> = (args) => {
  const [selected, setSelected] = React.useState(args.selected || '')

  const handleChange = (value: string) => {
    setSelected(value)
    args.onChange?.(value)
  }

  return (
    <div className='min-h-[200px]'>
      <Select
        {...args}
        selected={selected}
        onChange={handleChange}
      />
    </div>
  )
}

// Default Select
export const Default = Template.bind({})
Default.args = {
  options: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ],
  placeholder: 'Select an option',
  label: 'Choose an option',
}

// Select with placeholder
export const WithPlaceholder = Template.bind({})
WithPlaceholder.args = {
  options: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ],
  selected: '',
  placeholder: 'Select an option',
  label: 'Choose an option',
}

// Select with no label
export const WithoutLabel = Template.bind({})
WithoutLabel.args = {
  options: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ],
  selected: 'option3',
  placeholder: 'Select an option',
  label: '',
}

// Select with icons
export const WithIcons= Template.bind({})
WithIcons.args = {
  options: [
    { value: 'apple', label: 'Apple', icon: <Icon secondary iconName='FaceSmileIcon'/> },
    { value: 'banana', label: 'Banana',  icon: <Icon solid secondary iconName='EyeIcon'/> },
    { value: 'cherry', label: 'Cherry',  icon: <Icon solid secondary iconName='LightBulbIcon'/>  },
  ],
  selected: 'banana',
  placeholder: 'Select a fruit',
  label: 'Fruit Selector',
}


export const WithSelectedIcon= Template.bind({})
WithSelectedIcon.args = {
  options: [
    { value: 'heart', label: 'Heart', selectedIcon: <Icon secondary iconName='HeartIcon'/> },
    { value: 'fire', label: 'Fire',  selectedIcon: <Icon solid secondary iconName='FireIcon'/> },
    { value: 'moon', label: 'Moon',  selectedIcon: <Icon solid secondary iconName='MoonIcon'/>  },
  ],
  selected: 'moon',
  placeholder: 'Select an option',
  label: 'Random Selector',
}


const TemplateWithStyles: StoryFn<SelectProps> = (args) => {
  const [selected, setSelected] = React.useState(args.selected || '')

  const handleChange = (value: string) => {
    setSelected(value)
    args.onChange?.(value)
  }

  return <StcStylesProvider customStyles={customStyles}>
    <div className='min-h-[200px]'>
      <SelectWithStyles {...args}
        selected={selected}
        onChange={handleChange} />
    </div>
  </StcStylesProvider>
}

export const WithStyles = TemplateWithStyles.bind({})
WithStyles.args = {
  label: 'With Styles Example',
  options: [
    { value: 'music', label: 'Music', icon: <Icon neutral iconName='MusicalNoteIcon'/> },
    { value: 'radio', label: 'Radio', icon: <Icon neutral iconName='RadioIcon' /> },
  ],
  placeholder: 'Please pick an option'
}
