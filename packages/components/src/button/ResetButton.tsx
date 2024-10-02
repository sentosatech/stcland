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

const ResetButton = ({
  text = 'Reset',
  formName,
}: Props) => {
  const parentButtonProps: ParentButtonPropsShape = { type: 'reset' }
  if (formName) parentButtonProps.form = formName

  return (
    <Button
      {...{ text, parentButtonProps }}
    />
  )
}

export default ResetButton
