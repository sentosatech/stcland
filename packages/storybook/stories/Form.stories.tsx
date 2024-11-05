import type { Meta, StoryFn } from '@storybook/react'
import {
  Button,
  CheckBox,
  DateInput,
  DateInputProps,
  Email,
  Fieldset,
  Form,
  FormProps,
  NumberInput,
  RadioButtonGroup,
  Select,
  StcStylesProvider,
  Text,
  TextArea,
  TimeInput,
} from '@stcland/components'
import {
  Form as FormWithStyles,
  Button as ButtonWithStyles,
  CheckBox as CheckBoxWithStyles,
  DateInput as DateInputWithStyles,
  Email as EmailWithStyles,
  Fieldset as FieldsetWithStyles,
  NumberInput as NumberInputWithStyles,
  RadioButtonGroup as RadioButtonGroupWithStyles,
  Select as SelectWithStyles,
  Text as TextWithStyles,
  TextArea as TextAreaWithStyles,
  TimeInput as TimeInputWithStyles,
} from '@stcland/components/withStyles'
import * as React from 'react'
import customStyles from '../stc.config'

const meta: Meta<typeof Form> = {
  title: 'Components/Form',
  component: Form,
  parameters: {
    backgrounds: {
      default: 'Dark',
    },
  },
  argTypes: {
    id: {
      type: 'string',
      value: 'formId',
    },
    debug: {
      type: 'boolean',
      value: true,
    },
    defaultValues: {
      key: { type: 'string', value: 'any' },
    },
    mode: {
      type: 'string',
      control: 'select',
      options: ['onBlur', 'onError', 'onChange', 'onSubmit', 'all'],
    },
    title: {
      type: 'string',
      value: 'fieldset',
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
  <Form {...args} onSubmit={(data: unknown) => console.log(data)}>
    <Select
      name="dropdown"
      label="Dropdown"
      required
      options={[
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
      ]}
    />
    <Fieldset label="Personal Details">
      <Text
        name="personal_details.firstName"
        placeholder="John"
        label="First Name"
        required
      />
      <Text
        name="personal_details.lastName"
        placeholder="Doe"
        label="Last Name"
        required
      />
      <RadioButtonGroup
        name="personal_details.gender"
        label="Gender"
        required
        radioButtons={[
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
        ]}
      />
    </Fieldset>
    <Fieldset label="Contact Details">
      <Email
        name="contact_details.email"
        placeholder="steve@sentosatech.com"
        label="Email"
        required
      />
      <Text
        name="contact_details.phone"
        placeholder="+1 99999999"
        label="Phone Number"
        required
      />
    </Fieldset>
    <DateInput
      name="birthDate"
      placeholder="07/22/1993"
      label="Birth Date"
      required
    />
    <NumberInput name="age" placeholder="Age" label="Age" required />
    <TimeInput name="time" placeholder="Time" label="Time" required />
    <TextArea
      name="address"
      label="Street Address"
      placeholder="Street Address"
      required
    />
    <RadioButtonGroup
      name="option"
      label="Option"
      required
      direction="vertical"
      radioButtons={[
        { value: 'option 1', label: 'Option 1' },
        { value: 'option 2', label: 'Option 2' },
        { value: 'option 3', label: 'Option 3' },
        { value: 'option 4', label: 'Option 4' },
      ]}
    />
    <CheckBox name="agree" label="Agree to Terms and Conditions" required />
    <Button
      parentButtonProps={{ type: 'submit' }}
      text="Submit"
      primary
      rounded
    />
  </Form>
)

export const Default = FieldsetTemplate.bind({})
Default.args = {
  title: 'Form Title',
  label: 'Default Fieldset Label',
  withPanel: true,
}

export const Debug = FieldsetTemplate.bind({})
Debug.args = {
  title: 'Form With Debug Enabled',
  label: 'Default Fieldset Label',
  withPanel: true,
  debug: true,
}

export const WithoutPanel = FieldsetTemplate.bind({})
WithoutPanel.args = {
  title: 'Form Title',
  withPanel: false,
}

export const WithoutTitle = FieldsetTemplate.bind({})
WithoutTitle.args = {
  withPanel: true,
}

const TemplateWithStyles: StoryFn<FormProps> = (args) => (
  <StcStylesProvider customStyles={customStyles}>
    <FormWithStyles {...args} onSubmit={(data: unknown) => console.log(data)}>
      <SelectWithStyles
        name="dropdown"
        label="Dropdown"
        required
        options={[
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
        ]}
      />
      <FieldsetWithStyles label="Personal Details">
        <TextWithStyles
          name="personal_details.firstName"
          placeholder="John"
          label="First Name"
          required
        />
        <TextWithStyles
          name="personal_details.lastName"
          placeholder="Doe"
          label="Last Name"
          required
        />
        <RadioButtonGroupWithStyles
          name="personal_details.gender"
          label="Gender"
          required
          radioButtons={[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
          ]}
        />
      </FieldsetWithStyles>
      <FieldsetWithStyles label="Contact Details">
        <EmailWithStyles
          name="contact_details.email"
          placeholder="steve@sentosatech.com"
          label="Email"
          required
        />
        <TextWithStyles
          name="contact_details.phone"
          placeholder="+1 99999999"
          label="Phone Number"
          required
        />
      </FieldsetWithStyles>
      <DateInputWithStyles
        name="birthDate"
        placeholder="07/22/1993"
        label="Birth Date"
        required
      />
      <NumberInputWithStyles
        name="age"
        placeholder="Age"
        label="Age"
        required
      />
      <TimeInputWithStyles
        name="time"
        placeholder="Time"
        label="Time"
        required
      />
      <TextAreaWithStyles
        name="address"
        label="Street Address"
        placeholder="Street Address"
        required
      />
      <RadioButtonGroupWithStyles
        name="option"
        label="Option"
        required
        direction="vertical"
        radioButtons={[
          { value: 'option 1', label: 'Option 1' },
          { value: 'option 2', label: 'Option 2' },
          { value: 'option 3', label: 'Option 3' },
          { value: 'option 4', label: 'Option 4' },
        ]}
      />
      <CheckBoxWithStyles
        name="agree"
        label="Agree to Terms and Conditions"
        required
      />
      <ButtonWithStyles
        parentButtonProps={{ type: 'submit' }}
        text="Submit"
        primary
        rounded
      />
    </FormWithStyles>
  </StcStylesProvider>
)

export const WithStyles = TemplateWithStyles.bind({})
WithStyles.args = {
  title: 'Form Title With Context Styles Light Mode',
  withPanel: true,
}
