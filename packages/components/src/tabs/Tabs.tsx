import * as React from 'react'
import { TabsContext } from './context/TabsContext'
import { appliedStyles, cns } from '@stcland/utils'
import type { TabProps } from './Tab'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import type { TabsStyles } from 'src/styles'

export interface TabsProps {
  defaultActiveTab?: number;
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  colorIndicator?: string;
  colorClass?: string;
  scrollable?: boolean;
  customStyles?: Partial<TabsStyles>
}


//*****************************************************************************
// Components
//*****************************************************************************

const Tabs: React.FC<TabsProps> = ({
  defaultActiveTab = 0,
  children,
  orientation = 'horizontal',
  colorIndicator,
  colorClass,
  className,
  scrollable = false,
  customStyles
}) => {
  const [activeTab, setActiveTab] = React.useState(defaultActiveTab)
  const tabContainerRef = React.useRef<HTMLDivElement>(null)
  const [isOverflowing, setIsOverflowing] = React.useState(false)
  const horizontal = orientation === 'horizontal'

  const defaultTabsStyles = {
    root: 'p-2 overflow-auto whitespace-nowrap w-full flex gap-2 relative',
    colorClass: 'bg-gray-800 text-white',
    rootWidth: 'w-max',
    indicator: 'absolute transition-transform duration-300 ease-in-out',
    horizontalIndicator: 'bottom-0 left-0 h-0.5 w-full',
    verticalIndicator: 'right-0 w-0.5 h-full',
    colorClassIndicator: 'bg-primary-main',
    tabWrapper: 'w-full relative',
    scrollButton: 'relative z-10 text-white rounded-full p-2',
    scrollableIcon: 'text-white h-4.5 w-4.5',
    scrollableWrapper: 'flex items-center'
  }

  const mergedStyles = appliedStyles(defaultTabsStyles, customStyles?.tabs)

  const cn = {
    root: cns(
      mergedStyles.root,
      colorClass ?? mergedStyles.colorClass,
      horizontal ? 'flex-row' : 'flex-col',
      mergedStyles.rootWidth,
      className
    ),
    indicator: cns(
      mergedStyles.indicator,
      colorIndicator ?? mergedStyles.colorClassIndicator,
      horizontal ? mergedStyles.horizontalIndicator : mergedStyles.verticalIndicator
    ),
    tabWrapper: mergedStyles.tabWrapper,
    scrollButton: mergedStyles.scrollButton,
    icon: cns(mergedStyles.scrollableIcon, !horizontal ? 'rotate-90' : ''),
    scrollableWrapper: cns(mergedStyles.scrollableWrapper, horizontal ? 'flex-row' : 'flex-col')
  }

  const handleScroll = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (tabContainerRef.current) {
      const scrollAmount = direction === 'right' || direction === 'down' ? 200 : -200
      if (horizontal) {
        tabContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
      } else {
        tabContainerRef.current.scrollBy({ top: scrollAmount, behavior: 'smooth' })
      }
    }
  }

  React.useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (tabContainerRef.current) {
        const isOverflowingHorizontal =
          tabContainerRef.current.scrollWidth > tabContainerRef.current.clientWidth
        const isOverflowingVertical =
          tabContainerRef.current.scrollHeight > tabContainerRef.current.clientHeight

        setIsOverflowing(horizontal ? isOverflowingHorizontal : isOverflowingVertical)
      }
    })

    if (tabContainerRef.current) {
      observer.observe(tabContainerRef.current)
    }

    return () => {
      if (tabContainerRef.current) {
        observer.unobserve(tabContainerRef.current)
      }
    }
  }, [horizontal])

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, customStyles }}>
      <div className={cn.scrollableWrapper}>
        {/* Left or Top Button */}
        {scrollable && isOverflowing && (
          <button
            className={cn.scrollButton}
            onClick={() => handleScroll(horizontal ? 'left' : 'up')}
          >
            <ChevronLeftIcon className={cn.icon}/>
          </button>
        )}

        <div className={cn.root} ref={tabContainerRef}>
          {React.Children.map(children, (child, index) => {
            if (React.isValidElement<TabProps>(child)) {
              return (
                <div className={cn.tabWrapper}>
                  {React.cloneElement(child, { index })}
                  {activeTab === index && <span className={cn.indicator} />}
                </div>
              )
            }
            return child
          })}
        </div>

        {/* Right or Bottom Button */}
        {scrollable && isOverflowing && (
          <button
            className={cn.scrollButton}
            onClick={() => handleScroll(horizontal ? 'right' : 'down')}
          >
            <ChevronRightIcon className={cn.icon}/>
          </button>
        )}
      </div>
    </TabsContext.Provider>
  )
}

export default Tabs
