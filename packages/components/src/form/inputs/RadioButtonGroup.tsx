import { cns } from '@stcland/utils'
import { useFormContext } from 'react-hook-form'
import { nullFormContext } from '../Form'
import FormLabel from '../FormLabel'

//*****************************************************************************
// Interface
//*****************************************************************************
type RadioButtonShape = {
  label: string;
  value: string;
};
interface Props {
  name: string;
  label?: string;
  direction?: 'vertical' | 'horizontal';
  defaultChecked?: string;
  radioButtons: RadioButtonShape[];
  readOnly?: boolean;
  required: boolean;
  disabled?: boolean;
  hidden?: boolean;
  className?: string;
}

const toId = function (name: string, radioButtonValue: string): string {
  return name + '.' + radioButtonValue
}

const RadioButtonGroup = function ({
  name,
  label,
  radioButtons,
  disabled = false,
  hidden = false,
  direction = 'horizontal',
  defaultChecked = '',
  required = false,
  readOnly = false,
  className,
}: Props) {
  if (hidden) return null

  const { register } = useFormContext() || nullFormContext
  const registerRequired = {
    value: required,
    message: label + ' is required',
  }
  const flexDir = direction === 'horizontal' ? 'flex-row' : 'flex-col'

  const cn = {
    root: cns('mb-2 flex gap-4', className),
    buttonContainer: cns('flex', flexDir),
    label: 'text-white/50',
    radioContainer: 'flex gap-2',
    radioButton: (row: number) =>
      cns(
        'accent-app-primary-500',
        direction === 'horizontal' && row !== 0 && 'flex-3',
      ),
  }

  return (
    <div className={cn.root}>
      <div>{label && <label className={cn.label}>{label}</label>}</div>
      <div className={cn.buttonContainer}>
        {radioButtons.map(function ({ label: inputLabel, value }, row) {
          return (
            <div key={value} className={cn.radioContainer}>
              <input
                className={cn.radioButton(row)}
                id={toId(name, value)}
                defaultChecked={value === defaultChecked}
                type="radio"
                readOnly={readOnly}
                {...{ name, value, disabled }}
                {...register(name, { required: registerRequired })}
              />
              <FormLabel
                key={value}
                className={cn.label}
                htmlFor={toId(name, value)}
                labelText={inputLabel}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RadioButtonGroup
