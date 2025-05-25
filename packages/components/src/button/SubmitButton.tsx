import Button, { Props as ButtonProps, ParentButtonPropsShape } from './Button'

//*****************************************************************************
// Interface
//*****************************************************************************


export interface Props extends Omit<ButtonProps, 'parentButtonProps'> {
  formName?: string;
}

//*****************************************************************************
// Components
//*****************************************************************************

const SubmitButton = ({
  text = 'Submit',
  formName,
}: Props) => {
  const parentButtonProps: ParentButtonPropsShape = { type: 'submit' }
  if (formName) parentButtonProps.form = formName

  return (
    <Button
      {...{ text, parentButtonProps }}
    />
  )
}

export default SubmitButton
