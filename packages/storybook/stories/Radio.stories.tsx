import * as React from 'react'
import type { Meta, StoryFn } from '@storybook/react'
import type { RadioProps } from '@stcland/components'
import { Radio, RadioGroup, StcStylesProvider } from '@stcland/components'
import { RadioGroup as RadioGroupWithStyles, Radio as RadioWithStyles } from '@stcland/components/withStyles'
import customStyles from '../stc.config'

// Storybook metadata
export default {
  title: 'Components/RadioAndRadioGroup',
  component: RadioGroup,
  subcomponents: { Radio },
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    disabled: { control: 'boolean' },
    onChange: { action: 'changed' },
  },
} as Meta


export const Default = (args: RadioProps) => {
  const [selectedValue, setSelectedValue] = React.useState<string>('option2')

  const handleChange = (value: string) => {
    setSelectedValue(value)
    args.onChange?.(value)
  }

  return (
    <RadioGroup value={selectedValue} onChange={handleChange}>
      <Radio {...args} value="option1" label="Option 1" />
      <Radio {...args} value="option2" label="Option 2" />
      <Radio {...args} value="option3" label="Option 3" />
    </RadioGroup>
  )
}

// Story with a disabled Radio
export const Disabled = (args: RadioProps) => (
  <RadioGroup>
    <Radio {...args} value="option1" label="Option 1" disabled />
    <Radio {...args} value="option2" label="Option 2" />
  </RadioGroup>
)

// Horizontal layout example
export const HorizontalLayout = (args: RadioProps) => (
  <RadioGroup direction="horizontal">
    <Radio {...args} value="option1" label="H Option 1" />
    <Radio {...args} value="option2" label="H Option 2" />
    <Radio {...args} value="option3" label="H Option 3" />
  </RadioGroup>
)

export const IsolatedRadio: StoryFn<RadioProps> = (args) => {
  const [selectedValue, setSelectedValue] = React.useState<string>()

  const options = [
    { value: 'isolated1', label: 'Isolated Option 1' },
    { value: 'isolated2', label: 'Isolated Option 2' },
    { value: 'isolated3', label: 'Isolated Option 3' },
  ]

  const handleChange = (value: string) => {
    setSelectedValue(value)
  }

  return (
    <div className="space-y-2">
      {options.map((option) => (
        <Radio
          key={option.value}
          {...args}
          value={option.value}
          label={option.label}
          onChange={() => handleChange(option.value)}
          selectedValue={selectedValue}
        />
      ))}
    </div>
  )
}

// Story with custom styles
export const WithCustomStyles = (args: RadioProps) => {
  const [selectedValue, setSelectedValue] = React.useState<string>('custom2')

  const handleChange = (value: string) => {
    setSelectedValue(value)
    args.onChange?.(value)
  }

  const [selectedIsolatedRadioValue, setSelectedIsolatedRadio] = React.useState<string>('isolated3')

  const options = [
    { value: 'isolated1', label: 'Isolated Option 1' },
    { value: 'isolated2', label: 'Isolated Option 2' },
    { value: 'isolated3', label: 'Isolated Option 3' },
  ]

  const handleChangeForIsolatedRadio = (value: string) => {
    setSelectedIsolatedRadio(value)
  }

  return (
    <StcStylesProvider customStyles={customStyles}>
      <div className='flex flex-col gap-2'>
        <p className='text-xl py-3 text-primary-main'> Radio Group with Radio Childrens:</p>
        <RadioGroupWithStyles value={selectedValue} onChange={handleChange} direction='horizontal'>
          <Radio {...args} value="custom1" label="Custom Styled Option 1" />
          <Radio {...args} value="custom2" label="Custom Styled Option 2" />
        </RadioGroupWithStyles>


        <div className="space-y-2">
          <p className='text-xl mt-8 py-3 text-pink-500'> Isolated Radio Buttons (used without RadioGroup):</p>
          {options.map((option) => (
            <RadioWithStyles
              key={option.value}
              {...args}
              value={option.value}
              label={option.label}
              onChange={() => handleChangeForIsolatedRadio(option.value)}
              selectedValue={selectedIsolatedRadioValue}
            />
          ))}
        </div>

      </div>
    </StcStylesProvider>
  )
}



