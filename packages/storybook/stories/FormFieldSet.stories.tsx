import type { Meta, StoryFn } from '@storybook/react'
import {
  Fieldset,
  StcStylesProvider,
  DateInputProps,
  Email,
  Text,
} from '@stcland/components'
import { Fieldset as FieldsetWithStyles } from '@stcland/components/withStyles'
import * as React from 'react'
import customStyles from '../stc.config'

const meta: Meta<typeof Fieldset> = {
  title: 'Components/Form/Fieldset',
  component: Fieldset,
  parameters: {
    backgrounds: {
      default: 'Dark',
    },
  },
  argTypes: {
    name: {
      type: 'string',
      value: 'fieldset',
    },
    title: {
      type: 'string',
      value: 'fieldset',
    },
    label: {
      type: 'string',
      value: 'fieldset label',
    },
    hidden: {
      type: 'boolean',
      value: false,
    },
    disabled: {
      type: 'boolean',
      value: false,
    },
    withPanel: {
      type: 'boolean',
      value: false,
    },
    customStyles: {
      // type: "object",
      value: {},
    },
  },
}

export default meta

const FieldsetTemplate: StoryFn<DateInputProps> = (args) => (
  <Fieldset {...args}>
    <Email name="email" placeholder="steve@sentosatech.com" label="Email" />
    <Text name="name" placeholder="John Doe" label="Name" />
  </Fieldset>
)

export const Default = FieldsetTemplate.bind({})
Default.args = {
  name: 'Default Fieldset',
  title: 'Default Fieldset Title',
  label: 'Default Fieldset Label',
  withPanel: true,
}

export const WithoutPanel = FieldsetTemplate.bind({})
WithoutPanel.args = {
  name: 'Default Fieldset',
  label: 'Default Fieldset Label',
  withPanel: false,
}

export const WithoutTitle = FieldsetTemplate.bind({})
WithoutTitle.args = {
  name: 'Default Fieldset',
  label: 'Default Fieldset Label',
  withPanel: true,
}

export const WithoutLabel = FieldsetTemplate.bind({})
WithoutLabel.args = {
  title: 'Default Fieldset Title',
  name: 'Default Fieldset',
  withPanel: true,
}

const TemplateWithStyles: StoryFn<FieldsetWithStyles> = (args) => (
  <StcStylesProvider customStyles={customStyles}>
    <FieldsetWithStyles {...args}>
      <Email name="email" placeholder="steve@sentosatech.com" label="Email" />
      <Text name="name" placeholder="John Doe" label="Name" />
    </FieldsetWithStyles>
  </StcStylesProvider>
)

export const WithStyles = TemplateWithStyles.bind({})
WithStyles.args = {
  title: 'Form Title With Context Styles',
  withPanel: true,
}
