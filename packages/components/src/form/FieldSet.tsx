import Panel from './Panel'

//*****************************************************************************
// Interface
//*****************************************************************************
interface Props {
  name?: string;
  label?: string;
  hidden?: boolean;
  disabled?: boolean;
  withPanel?: boolean;
  children: React.ReactNode;
  className?: string;
}

//*****************************************************************************
// Components
//*****************************************************************************
const Fieldset = ({
  name,
  label,
  hidden = false,
  disabled = false,
  className,
  withPanel = false,
  children,
}: Props) => {
  const fieldSetProps = { id: name, disabled, hidden }

  const cn = {
    label: 'text-primary-light mb-2',
  }

  return (
    <WithPanel {...{ withPanel, className }}>
      {label && <div className={cn.label}>{label}</div>}
      <fieldset {...fieldSetProps}>{children}</fieldset>
    </WithPanel>
  )
}

interface WithPanelProps {
  withPanel?: boolean;
  className?: string;
  children: React.ReactNode;
}

const WithPanel = ({ withPanel, className, children }: WithPanelProps) => {
  return withPanel ? (
    <Panel className={className}>{children}</Panel>
  ) : (
    <div className={className}>{children}</div>
  )
}

export default Fieldset
