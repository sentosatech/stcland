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

export const OnlyIconClickableTemplate: StoryFn = () => (
  <Accordion id='only-icon-clickable-accordion'>
    <AccordionSummary expandIcon={<Icon iconName='ChevronDownIcon'/>} onlyIconClickable={true}>
      <h3>Accordion Title</h3>
    </AccordionSummary>
    <AccordionDetails>
      <p>This is the content inside the accordion section.</p>
    </AccordionDetails>
  </Accordion>
)

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
      <Button text="Cancel"  className="mr-2" />
      <Button text="Agree" />
    </AccordionActions>
  </Accordion>
)

export const WithActions = ActionsTemplate.bind({})


// Template for a nested accordion example
const NestedAccordionTemplate: StoryFn = () => (
  <Accordion id="parent-accordion" defaultExpanded={true}>
    <AccordionSummary expandIcon={<Icon iconName='ChevronDownIcon'/>}>
      <h3>Parent Accordion</h3>
    </AccordionSummary>
    <AccordionDetails>
      <p>This is the content inside the parent accordion.</p>
      <Accordion id="nested-accordion-1" defaultExpanded={true}>
        <AccordionSummary expandIcon={<Icon iconName='ChevronDownIcon'/>}>
          <h4>Nested Accordion 1</h4>
        </AccordionSummary>
        <AccordionDetails>
          <Accordion id="nested-accordion-2">
            <AccordionSummary expandIcon={<Icon iconName='ChevronDownIcon'/>}>
              <h5>Nested Accordion 2</h5>
            </AccordionSummary>
            <AccordionDetails>
              <p>This is the content inside the deepest nested accordion.</p>
            </AccordionDetails>
            <AccordionActions>
              <Button text="Nested Cancel" type='secondary'  className="mr-2" />
              <Button text="Nested Confirm" type='secondary' />
            </AccordionActions>
          </Accordion>
        </AccordionDetails>
      </Accordion>
    </AccordionDetails>
    <AccordionActions>
      <Button text="Cancel"  className="mr-2" />
      <Button text="Confirm" />
    </AccordionActions>
  </Accordion>
)

export const NestedAccordions = NestedAccordionTemplate.bind({})

const WithStylesTemplate: StoryFn = () => (
  <StcStylesProvider customStyles={customStyles}>
    <AccordionWithStyles id="actions-accordion">
      <AccordionSummary expandIcon={<Icon iconName='ChevronDownIcon'  />}>
        <h3>Accordion component imported from withStyles</h3>
      </AccordionSummary>
      <AccordionDetails>
        <p>This accordion includes action buttons below.</p>
      </AccordionDetails>
      <AccordionActions>
        <Button text="Cancel" className="mr-2" />
        <Button text="Agree"  />
      </AccordionActions>
    </AccordionWithStyles>
  </StcStylesProvider>
)

export const WithStyles = WithStylesTemplate.bind({})

