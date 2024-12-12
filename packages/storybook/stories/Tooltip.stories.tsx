import * as React from 'react'
import type { Meta, StoryFn } from '@storybook/react'
import type { TooltipProps } from '@stcland/components'
import { Tooltip, Button, StcStylesProvider } from '@stcland/components'
import { Tooltip as TooltipWithStyles } from '@stcland/components/withStyles'
import { Icon } from '@stcland/components/icon'
import customStyles from '../stc.config'

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
  argTypes: {
    title: { control: 'text', description: 'The content of the tooltip' },
    placement: {
      control: 'select',
      options: [
        'top',
        // 'topLeft',
        // 'topRight',
        'bottom',
        // 'bottomLeft',
        // 'bottomRight',
        'left',
        // 'leftTop',
        // 'leftBottom',
        'right',
        // 'rightTop',
        // 'rightBottom',
      ],
      description: 'The position of the tooltip relative to the trigger element',
    },
    trigger: {
      control: 'select',
      options: ['hover', 'focus', 'click', 'contextMenu'],
      description: 'The action that triggers the tooltip',
    },
    color: { control: 'color', description: 'The background color of the tooltip' },
    arrow: { control: 'boolean', description: 'Whether the tooltip has an arrow' },
    zIndex: { control: 'number', description: 'Sets the z-index of the tooltip' },
  },
} as Meta

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="min-h-[100px] min-w-[300px] p-10 flex flex-row justify-center">{children}</div>
}

// Default Tooltip Example
export const Default: StoryFn<TooltipProps> = (args) => (
  <Wrapper>
    <Tooltip {...args} title="Default Tooltip">
    Hover me
    </Tooltip>
  </Wrapper>
)

// Tooltip with Custom Placement
export const CustomPlacement: StoryFn<TooltipProps> = (args) => (
  <Wrapper>
    <Tooltip {...args} title="Tooltip on the right" placement="right">
      <Button text='Hover Me'/>
    </Tooltip>
  </Wrapper>
)

// Tooltip with Click Trigger
export const ClickTrigger: StoryFn<TooltipProps> = (args) => (
  <Wrapper>
    <Tooltip {...args} title="Click-triggered Tooltip"  placement="left" trigger="click">
      <Button secondary text='Click Me'/>
    </Tooltip>
  </Wrapper>
)

// Tooltip with Custom Color
export const CustomColor: StoryFn<TooltipProps> = (args) => (
  <Wrapper>
    <Tooltip {...args} title="Custom Color Tooltip"  placement='bottom' colorClass="bg-pink-500 text-white">
      <Button outlined text='Hover Me'/>
    </Tooltip>
  </Wrapper>
)


const TemplateWithStyles: StoryFn<TooltipProps> = (args) => (
  <StcStylesProvider customStyles={customStyles}>
    <Wrapper>
      <TooltipWithStyles {...args}>
        <Icon solid neutral iconName='InformationCircleIcon'/>
      </TooltipWithStyles>
    </Wrapper>
  </StcStylesProvider>
)

export const WithStyles = TemplateWithStyles.bind({})
WithStyles.args = {
  title: 'Tooltip With Styles Wrapper',
  placement: 'left',
}
