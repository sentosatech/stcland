import { DevTool } from '@hookform/devtools'
import { appliedStyles } from '@stcland/utils'
import { createContext, useContext } from 'react'
import {
  FieldValues,
  FormProvider,
  useForm,
  useFormContext,
  useFormState,
} from 'react-hook-form'
import { FormStyles, PanelStyles } from 'src/styles/componentTypes'
import { FormTitle, Panel } from './'

//*****************************************************************************
// Interface
//*****************************************************************************

export interface Props {
  children: React.ReactNode;
  customStyles?: Partial<FormStyles>;
  debug?: boolean;
  defaultValues?: { [key: string]: any };
  id?: string;
  mode?: 'onBlur' | 'onChange' | 'onSubmit' | 'onTouched' | 'all';
  onDirtyChange?: () => void;
  onError?: () => void;
  onSubmit?: (data: any, event: any) => void;
  title?: string;
  withPanel?: boolean;
}
export const FormContext = createContext('unintilized form context')
export const useBdiFormContext = function () {
  return useContext(FormContext)
}
//*****************************************************************************
// Components
//*****************************************************************************
const Form = function (props: Props) {
  const {
    children,
    customStyles,
    debug = false,
    id,
    onDirtyChange,
    onError = (e) => console.log('Form submission error', e),
    onSubmit = () => console.log('Form onSubmit() not provided'),
    title = '',
    withPanel,
  } = props

  const formProps = useFormContext()
  const { handleSubmit, control } = formProps

  const formStyle: FormStyles = appliedStyles(
    {
      root: '',
      form: '',
      panelStyle: {
        root: 'p-4 flex flex-col gap-2 text-xl',
      },
    },
    customStyles
  )

  return (
    <div className={formStyle.root}>
      {title && <FormTitle {...{ title: title }} />}
      {withPanel}
      <WithPanel {...{ withPanel, customStyles: formStyle?.panelStyle }}>
        <form
          className={formStyle.form}
          onSubmit={handleSubmit(onSubmit, onError)}
          {...{ id: id }}
        >
          <StateMonitor {...{ onDirtyChange }} />
          {children}
        </form>
        {debug && <DevTool control={control} />}
      </WithPanel>
    </div>
  )
}

interface WithPanelProps {
  withPanel?: boolean;
  customStyles?: Partial<PanelStyles>;
  children: React.ReactNode;
}
const WithPanel = ({ children, customStyles, withPanel }: WithPanelProps) =>
  withPanel ? (
    <>
      <Panel {...{ customStyles }}>{children}</Panel>
      {withPanel}
    </>
  ) : (
    <div>{children}</div>
  )

export const nullFormContext = {
  register: function () {
    console.log('register not available, inputs must be wrapped in <Form />')
  },
  setValue: function () {
    console.log('setValue not available, inputs must be wrapped in <Form />')
  },
  control: function () {
    console.log('control not available, inputs must be wrapped in <Form />')
  },
  formState: { errors: {} },
}

const withFormContext = (props: Props) => {
  const { defaultValues, mode } = props

  const useFormOptions: FieldValues = {
    mode: mode || 'onSubmit',
    ...(defaultValues ? { defaultValues } : {}),
  }

  const useFormMethods = useForm(useFormOptions)
  return (
    <FormProvider {...useFormMethods}>
      <Form {...props} />
    </FormProvider>
  )
}

export default withFormContext

//*****************************************************************************
// Helpers
//*****************************************************************************

interface StateMonitorProps {
  onDirtyChange?: (dirtyFields?: any) => void;
}

const StateMonitor = function (props: StateMonitorProps) {
  const onDirtyChange = props.onDirtyChange
  const control = useFormContext().control
  const dirtyFields = useFormState({ control: control }).dirtyFields
  onDirtyChange?.(dirtyFields)
  return null
}
