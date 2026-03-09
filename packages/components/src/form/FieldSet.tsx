import { appliedStyles } from '@stcland/utils'
import { FieldSetStyles, PanelStyles } from 'src/styles/componentTypes'
import { Panel } from '.'

//*****************************************************************************
// Interface
//*****************************************************************************
export interface Props {
  title?: string;
  name?: string;
  label?: string;
  hidden?: boolean;
  disabled?: boolean;
  withPanel?: boolean;
  children: React.ReactNode;
  customStyles?: Partial<FieldSetStyles>;
}

//*****************************************************************************
// Components
//*****************************************************************************
const Fieldset = ({
  name,
  label,
  hidden = false,
  disabled = false,
  customStyles,
  withPanel = false,
  children,
  title,
}: Props) => {
  const cn: FieldSetStyles = appliedStyles(
    {
      label: 'font-bold text-sky-500 text-sm',
      root: 'py-4 flex flex-col gap-2 text-xl',
      fieldset: 'grid gap-2 disabled:cursor-disabled grid-cols-2',
      title: '',
    },
    customStyles
  )

  const fieldSetProps = { id: name, disabled, hidden, className: cn.fieldset }

  return (
    <WithPanel
      withPanel={withPanel}
      title={title}
      customStyles={{
        root: cn.root,
        title: cn.title,
      }}
    >
      {label && <div className={cn.label}>{label}</div>}
      <fieldset {...fieldSetProps}>{children}</fieldset>
    </WithPanel>
  )
}

interface WithPanelProps {
  withPanel?: boolean;
  title?: string;
  customStyles?: Partial<PanelStyles>;
  children: React.ReactNode;
}

const WithPanel = ({
  withPanel,
  children,
  title,
  customStyles,
}: WithPanelProps) =>
  withPanel ? (
    <Panel customStyles={customStyles} title={title}>
      {children}
    </Panel>
  ) : (
    <div className={customStyles?.root}>{children}</div>
  )

export default Fieldset
