import { DevTool } from '@hookform/devtools'
import { createContext, useContext } from 'react'
import {
  useFormContext,
  FormProvider,
  useForm,
  useFormState,
  FieldValues,
} from 'react-hook-form'
import { FormTitle, Panel } from './'

//*****************************************************************************
// Interface
//*****************************************************************************

export interface Props {
  id?: string;
  mode?: 'onBlur' | 'onChange' | 'onSubmit' | 'onTouched' | 'all';
  onSubmit?: (data: any, event: any) => void;
  onError?: () => void;
  onDirtyChange?: () => void;
  defaultValues?: { [key: string]: any };
  title?: string;
  withPanel?: boolean;
  panelClassName?: string; // applied to panel
  formClassName?: string; // applied to form element
  className?: string; // applied to root div element
  children: React.ReactNode;
  debug?: boolean;
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
    id,
    withPanel = false,
    title = '',
    onError = (e) => console.log('Form submission error', e),
    onDirtyChange,
    className,
    panelClassName = '',
    formClassName = '',
    children,
    debug = false,
    onSubmit = () => console.log('Form onSubmit() not provided'),
  } = props

  const formProps = useFormContext()
  const { handleSubmit, control } = formProps

  return (
    <div className={className}>
      {title && <FormTitle {...{ title: title }} />}
      <WithPanel {...{ withPanel, panelClassName }}>
        <form
          className={formClassName}
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
  panelClassName?: string;
  children: React.ReactNode;
}
const WithPanel = ({ withPanel, panelClassName, children }: WithPanelProps) =>
  withPanel ? (
    <Panel className={panelClassName || ''}>{children}</Panel>
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
