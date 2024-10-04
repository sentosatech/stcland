import type { Meta, StoryFn } from '@storybook/react'
import type { IconProps } from '@stcland/components/icon'
import { StcStylesProvider } from '@stcland/components'
import { Icon } from '@stcland/components/icon'
import { Icon as IconWithStyles } from '@stcland/components/icon/withStyles'
import * as React from 'react'
import customStyles from '../stc.config'


const meta : Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
}

export default meta

const IconTemplate: StoryFn<IconProps> = (args) => <Icon {...args} />

export const Primary = IconTemplate.bind({})
Primary.args = {
  iconName: 'HomeIcon',
  solid: true,
  md: true,
}

export const Secondary = Icon.bind({})
Secondary.args = {
  iconName: 'HeartIcon',
  md: true,
  secondaryColor: true
}

const TemplateWithStyles: StoryFn<IconProps> = (args) =>
  <StcStylesProvider customStyles={customStyles}>
    <IconWithStyles {...args} />
  </StcStylesProvider>


export const WithStyles = TemplateWithStyles.bind({})
WithStyles.args = {
  iconName: 'CurrencyDollarIcon',
  lg: true,
  solid: true,
  secondaryColor: true
}