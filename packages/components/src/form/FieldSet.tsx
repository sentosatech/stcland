import { cns } from '@stcland/utils'

//*****************************************************************************
// Interface
//*****************************************************************************
interface Props {
  title?: string;
  name?: string;
  label?: string;
  hidden?: boolean;
  disabled?: boolean;
  withPanel?: boolean;
  children: React.ReactNode;
  customStyles?: FieldSetStyles;
}

type FieldSetStyles = Partial<{
  root: React.HTMLAttributes<HTMLDivElement>['className'];
  label: React.HTMLAttributes<HTMLDivElement>['className'];
  title: React.HTMLAttributes<HTMLDivElement>['className'];
  fieldset: React.HTMLAttributes<HTMLFieldSetElement>['className'];
}>;

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
  const cn: FieldSetStyles = {
    label: cns('font-bold text-sky-500 text-sm', customStyles?.label),
    root: cns(
      'p-4 flex flex-col gap-2 bg-gray-800 text-xl',
      customStyles?.root
    ),
    fieldset: cns('grid grid-cols-2 gap-2', customStyles?.fieldset),
    title: cns(customStyles?.title),
  }

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
      <fieldset {...fieldSetProps} className={cn.fieldset}>
        {children}
      </fieldset>
    </WithPanel>
  )
}

interface WithPanelProps {
  withPanel?: boolean;
  title?: string;
  customStyles?: PanelStyles;
  children: React.ReactNode[];
}

export type PanelStyles = Partial<{
  root: React.HTMLAttributes<HTMLDivElement>['className'];
  title: React.HTMLAttributes<HTMLDivElement>['className'];
}>;

const WithPanel = ({
  withPanel,
  children,
  title,
  customStyles,
}: WithPanelProps) => {
  const panelStyles: PanelStyles = {
    root: cns(customStyles?.root),
    title: cns('font-bold text-sky-500 text-md', customStyles?.title),
  }

  return withPanel ? (
    <div className={panelStyles.root}>
      {title && <div className={panelStyles.title}>{title}</div>}
      {...children}
    </div>
  ) : (
    <div className={panelStyles.root}>{...children}</div>
  )
}

export default Fieldset
