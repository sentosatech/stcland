import React, { useState } from 'react'
import { Meta, StoryObj, StoryFn } from '@storybook/react'
import { Modal, ModalProps, StcStylesProvider , Button } from '@stcland/components'
import { Modal as ModalWithStyles } from '@stcland/components/withStyles'
import customStyles from '../stc.config'

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  argTypes: {
    onClose: { action: 'closed' },
    open: { control: false }, // Disable control as we are managing it via state
    fullScreen: { control: 'boolean' },
    maxWidth: { control: 'number' },
    header: { control: 'text' },
    content: { control: 'text' },
    actions: { control: 'text' },
    customStyles: { control: 'object' },
  },
}

export default meta

type Story = StoryObj<typeof Modal>

const ModalStoryTemplate: React.FC<ModalProps> = (args) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  return (
    <div>
      <Button  onClick={handleOpen} text='Open Modal'/>
      {isOpen && (
        <Modal {...args} open={isOpen} onClose={handleClose}>
          {args.header && <div>{args.header}</div>}
          {args.content && <div>{args.content}</div>}
          {args.actions && <div>{args.actions}</div>}
        </Modal>
      )}
    </div>
  )
}

export const Default: Story = {
  render: (args) => (
    <ModalStoryTemplate
      {...args}
      header="Modal Header"
      content="This is the modal content."
      actions="Modal actions go here."
    />
  ),
}

export const FullScreen: Story = {
  render: (args) => (
    <ModalStoryTemplate
      {...args}
      fullScreen
      header="Full Screen Modal"
      content="This modal takes up the entire screen."
      actions="Full screen modal actions."
    />
  ),
}

// Modal with Custom Width
export const CustomWidth: Story = {
  render: (args) => (
    <ModalStoryTemplate
      {...args}
      maxWidth={900}
      header="Custom Width Modal"
      content="This modal has a maximum width of 900px."
      actions="Custom width modal actions."
    />
  ),
}

// Modal with Header and Content
export const ModalWithHeaderAndContent: Story = {
  render: (args) => (
    <ModalStoryTemplate
      {...args}
      header="Header Content Modal"
      content="This modal has both a header and content."
    />
  ),
}

const TemplateWithStyles: StoryFn<ModalProps> = (args) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  return (
    <div>
      <Button secondary outlined onClick={handleOpen} text='Open Modal'/>
      <StcStylesProvider customStyles={customStyles}>
        {isOpen && (
          <ModalWithStyles {...args} open={isOpen} onClose={handleClose}/>
        )
        }
      </StcStylesProvider>
    </div>
  )
}

export const WithStyles = TemplateWithStyles.bind({})
WithStyles.args = {
  header: 'Modal Header',
  content: 'Hello content',
  actions: (
    <div className='flex gap-2'>
      <Button outlined onClick={() => alert('Action Cancelled')} text="Cancel" />
      <Button outlined onClick={() => alert('Action Confirmed')} text="Confirm" />
    </div>
  ),
}