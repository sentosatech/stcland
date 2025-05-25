import * as React from 'react'
import type { Meta, StoryFn } from '@storybook/react'
import { ButtonProps, Button, StcStylesProvider } from '@stcland/components'
import { Button as ButtonWithStyles } from '@stcland/components/withStyles'
import customStyles from '../stc.config'
import { HeartIcon, CheckIcon, ArrowRightIcon, HomeIcon, LinkIcon }  from '@heroicons/react/24/solid'


const meta : Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    text: {
      control: 'text',
      defaultValue: 'Text',
    },
    type: {
      control: 'text',
      defaultValue: 'primary',
    },
    size: {
      control: 'text',
      defaultValue: 'sm'
    }
  },
}

export default meta

const Template: StoryFn<ButtonProps> = (args) => <Button {...args} />


export const Primary = Template.bind({})
Primary.args = {
  disabled: false,
  outlined: false,
  text: 'Change',
  rounded: true,
  leftIcon: HeartIcon,
  size: 'lg',
  customStyles: {
    icon: 'w-5 h-5 inline'
  }
}

export const Secondary = Template.bind({})
Secondary.args = {
  disabled: false,
  rounded: true,
  type: 'secondary',
  leftIcon: HomeIcon,
  outlined: true,
  text: 'Secondary',
}

export const Tertiary = Template.bind({})
Tertiary.args = {
  disabled: false,
  type: 'tertiary',
  outlined: true,
  text: 'Tertiary',
  rightIcon: LinkIcon,
}


export const WithIcons = Template.bind({})
WithIcons.args = {
  type: 'secondary',
  size: 'lg',
  leftIcon: HeartIcon,
  rightIcon: ArrowRightIcon,
  text: 'Hey'
}


export const WithCustomStyles = Template.bind({})
WithCustomStyles.args = {
  primary: true,
  text: 'Custom Styles',
  customStyles: {
    primary: {
      default: 'border border-primary-main text-secondary-main hover:border-secondary-dark hover:bg-primary-range-200',
      pressed: 'active:bg-secondary-dark active:text-secondary-range-900 text-gray-50',
      hover: 'hover:bg-pink-600',
    },
  }
}

const TemplateWithStyles: StoryFn<ButtonProps> = (args) =>
  <StcStylesProvider customStyles={customStyles}>
    <ButtonWithStyles {...args} />
  </StcStylesProvider>


export const WithStyles = TemplateWithStyles.bind({})
WithStyles.args = {
  text: 'With Styles',
  leftIcon: CheckIcon,
}