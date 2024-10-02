import type { Meta, StoryFn } from '@storybook/react'
import type { IconProps } from '@stcland/components/icons'
import { StcStylesProvider } from '@stcland/components'
import { HomeIcon, CustomersIcon } from '@stcland/components/icons'
import { ProjectionsIcon } from '@stcland/components/icons/withStyles'
import * as React from 'react'
import customStyles from '../stc.config'


const meta : Meta<typeof HomeIcon> = {
  title: 'Components/Icon',
  component: HomeIcon,
}

export default meta

const HomeIconTemplate: StoryFn<IconProps> = (args) => <HomeIcon {...args} />

export const Home = HomeIconTemplate.bind({})
Home.args = {
  solid: true,
  md: true,
}

const CustomersIconTemplate: StoryFn<IconProps> = (args) => <CustomersIcon {...args} />
export const Customers = CustomersIconTemplate.bind({})
Customers.args = {
  md: true,
  secondaryColor: true
}

const TemplateWithStyles: StoryFn<IconProps> = (args) =>
  <StcStylesProvider customStyles={customStyles}>
    <ProjectionsIcon {...args} />
  </StcStylesProvider>


export const WithStyles = TemplateWithStyles.bind({})
WithStyles.args = {
  lg: true,
  solid: true,
  secondaryColor: true
}