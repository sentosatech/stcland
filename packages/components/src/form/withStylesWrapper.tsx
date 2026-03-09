import { useStyles } from '../styles/StylesProvider'

const StylesWrapper = <T,>(Component: React.FC<T>, key: string) => {
  const EnhancedComponent = (props: T) => {
    const { styles } = useStyles()

    return <Component customStyles={styles?.[key]} {...props} />
  }
  EnhancedComponent.displayName = key + 'withStyles'

  return EnhancedComponent
}

export default StylesWrapper
