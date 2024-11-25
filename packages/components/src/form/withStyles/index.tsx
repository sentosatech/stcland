import type {
  CheckBoxProps,
  DateInputProps,
  EmailProps,
  FieldsetProps,
  FormTitleProps,
  NumberProps,
  PasswordProps,
  RadioButtonGroupProps,
  SelectInputProps,
  TextAreaProps,
  TextInputProps,
  TimeInputProps,
} from '..'
import {
  CheckBox as BaseCheckBox,
  DateInput as BaseDateInput,
  Email as BaseEmail,
  Fieldset as BaseFieldset,
  Form as BaseForm,
  FormTitle as BaseFormTitle,
  NumberInput as BaseNumberInput,
  Password as BasePassword,
  RadioButtonGroup as BaseRadioButtonGroup,
  SelectInput as BaseSelect,
  Text as BaseText,
  TextArea as BaseTextArea,
  TimeInput as BaseTimeInput,
} from '..'
import stylesWrapper from '../withStylesWrapper'
import { FormProps } from '..'

export const Form = stylesWrapper<FormProps>(BaseForm, 'form')
export const FormTitle = stylesWrapper<FormTitleProps>(
  BaseFormTitle,
  'formTitle'
)
export const Fieldset = stylesWrapper<FieldsetProps>(BaseFieldset, 'fieldSet')
export const CheckBox = stylesWrapper<CheckBoxProps>(BaseCheckBox, 'checkBox')
export const Email = stylesWrapper<EmailProps>(BaseEmail, 'email')
export const NumberInput = stylesWrapper<NumberProps>(
  BaseNumberInput,
  'number'
)
export const Password = stylesWrapper<PasswordProps>(BasePassword, 'password')
export const RadioButtonGroup = stylesWrapper<RadioButtonGroupProps>(
  BaseRadioButtonGroup,
  'radio'
)
export const SelectInput = stylesWrapper<SelectInputProps>(BaseSelect, 'selectInput')
export const Text = stylesWrapper<TextInputProps>(BaseText, 'text')
export const TextArea = stylesWrapper<TextAreaProps>(BaseTextArea, 'textArea')
export const TimeInput = stylesWrapper<TimeInputProps>(BaseTimeInput, 'time')
export const DateInput = stylesWrapper<DateInputProps>(BaseDateInput, 'date')
