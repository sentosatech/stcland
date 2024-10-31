import * as React from 'react'
import type { Meta, StoryFn } from '@storybook/react'
import type { AccordionProps } from '@stcland/components'
import { Accordion, AccordionSummary, AccordionDetails, AccordionActions, StcStylesProvider } from '@stcland/components'
import { Accordion as AccordionWithStyles } from '@stcland/components/withStyles'
import { Button } from '@stcland/components'
import { Icon } from '@stcland/components/icon'
import customStyles from '../stc.config'

const meta: Meta<AccordionProps> = {
  title: 'Components/Accordion',
  component: Accordion,
  argTypes: {
    defaultExpanded: {
      control: 'boolean',
      defaultValue: false,
    },
  },
}

export default meta

const Template: StoryFn = (args) => (
  <Accordion id='accordion' {...args}>
    <AccordionSummary expandIcon={<Icon iconName='ChevronDownIcon'/>}>
      <h3>Accordion Title</h3>
    </AccordionSummary>
    <AccordionDetails>
      <p>This is the content inside the accordion section.</p>
    </AccordionDetails>
  </Accordion>
)

export const Default = Template.bind({})
Default.args = {
  id: 'default-accordion',
  defaultExpanded: false,
}

export const ExpandedByDefault = Template.bind({})
ExpandedByDefault.args = {
  id: 'expanded-accordion',
  defaultExpanded: true,
}

const MultipleTemplate: StoryFn = () => (
  <>
    <Accordion id="accordion-1">
      <AccordionSummary expandIcon={<Icon iconName='ChevronDownIcon'/>}>
        <h3>Accordion 1</h3>
      </AccordionSummary>
      <AccordionDetails>
        <p>Content of the first accordion section.</p>
      </AccordionDetails>
    </Accordion>
    <Accordion id="accordion-2">
      <AccordionSummary expandIcon={<Icon iconName='ChevronDownIcon'/>}>
        <h3>Accordion 2</h3>
      </AccordionSummary>
      <AccordionDetails>
        <p>Content of the second accordion section.</p>
      </AccordionDetails>
    </Accordion>
  </>
)

export const MultipleSections = MultipleTemplate.bind({})

const ActionsTemplate: StoryFn = () => (
  <Accordion id="actions-accordion">
    <AccordionSummary expandIcon={<Icon iconName='ChevronDownIcon'/>}>
      <h3>Accordion with Actions</h3>
    </AccordionSummary>
    <AccordionDetails>
      <p>This accordion includes action buttons below.</p>
    </AccordionDetails>
    <AccordionActions>
      <Button text="Cancel" outlined className="mr-2" />
      <Button text="Agree" primary outlined />
    </AccordionActions>
  </Accordion>
)

export const WithActions = ActionsTemplate.bind({})

const WithStylesTemplate: StoryFn = () => (
  <StcStylesProvider customStyles={customStyles}>
    <AccordionWithStyles id="actions-accordion">
      <AccordionSummary expandIcon={<Icon iconName='ChevronDownIcon'  />}>
        <h3>Accordion with Actions</h3>
      </AccordionSummary>
      <AccordionDetails>
        <p>This accordion includes action buttons below.</p>
      </AccordionDetails>
      <AccordionActions>
        <Button text="Cancel" secondary outlined className="mr-2" />
        <Button text="Agree" outlined />
      </AccordionActions>
    </AccordionWithStyles>
  </StcStylesProvider>
)

export const WithStyles = WithStylesTemplate.bind({})
