import type { Meta, StoryFn } from '@storybook/react'
import { ButtonProps, Button, StcStylesProvider } from '@stcland/components'
import { Button as ButtonWithStyles } from '@stcland/components/withStyles'
import * as React from 'react'
import customStyles from '../stc.config'
import { HeartIcon, CheckIcon }  from '@heroicons/react/24/solid'


const meta : Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    text: {
      control: 'text',
      defaultValue: 'Solid',
    },
    outlined: {
      control: 'boolean',
      defaultValue: false,
    },
    primary: {
      control: 'boolean',
      defaultValue: true,
    },
    secondary: {
      control: 'boolean',
      defaultValue: false,
    },
    neutral: {
      control: 'boolean',
      defaultValue: false,
    },
  },
}

export default meta

const Template: StoryFn<ButtonProps> = (args) => <Button {...args} />


export const Primary = Template.bind({})
Primary.args = {
  disabled: false,
  outlined: false,
  text: 'Change',
  icon: HeartIcon,
  md: true,
  brightenOnHover: true,
  customStyles: {
    icon: {
      width: 'replace 1rem'
    }
  }
}

export const Secondary = Template.bind({})
Secondary.args = {
  disabled: false,
  secondary: true,
  outlined: true,
  text: 'Save',
  md: true,
}

export const Disabled = Template.bind({})
Disabled.args = {
  disabled: true,
  text: 'Disabled Variant'
}

export const WithCustomStyles = Template.bind({})
WithCustomStyles.args = {
  disabled: true,
  lg: true,
  text: 'Custom Styles',
  customStyles: {
    primary: {
      outlined: 'border border-primary-main text-secondary-main hover:border-secondary-dark hover:bg-primary-range-200',
      solid: 'bg-secondary-dark hover:bg-secondary-range-900 text-gray-50'
    },
    lg: 'p-3 text-lg'
  }
}

const TemplateWithStyles: StoryFn<ButtonProps> = (args) =>
  <StcStylesProvider customStyles={customStyles}>
    <ButtonWithStyles {...args} />
  </StcStylesProvider>


export const WithStyles = TemplateWithStyles.bind({})
WithStyles.args = {
  text: 'With Styles',
  lg: true,
// icon: CheckIcon,
}