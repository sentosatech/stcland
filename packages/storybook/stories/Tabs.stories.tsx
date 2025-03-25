import React from 'react'
import { Tabs, Tab, TabPanel, StcStylesProvider } from '@stcland/components'
import { Tabs as TabsWithStyles, TabPanel as TabPanelWithStyles } from '@stcland/components/withStyles'
import type { TabsProps } from '@stcland/components'
import customStyles from '../stc.config'

export default {
  title: 'Components/Tabs',
  component: Tabs,
  subcomponents: { Tab, TabPanel },
}

const tabsData = [
  { index: 0, label: 'Tab 1', content: 'Content for Tab 1' },
  { index: 1, label: 'Tab 2', content: 'Content for Tab 2' },
  { index: 2, label: 'Tab 3', content: 'Content for Tab 3' },
]

const TabsExample = ({ orientation = 'horizontal', scrollable = false, className = '', containerClass }: Omit<TabsProps, 'children'>& {containerClass: string}) => {
  const [activeTab, setActiveTab] = React.useState(0)

  return (
    <div className={containerClass}>
      <Tabs
        defaultActiveTab={activeTab}
        orientation={orientation}
        scrollable={scrollable}
        className={className}
      >
        {tabsData.map(({ index, label }) => (
          <Tab key={index} index={index} label={label} onClick={() => setActiveTab(index)}>
            {label}
          </Tab>
        ))}
      </Tabs>

      <div className="p-4">
        {tabsData.map(({ index, content }) => (
          <TabPanel key={index} value={activeTab} index={index}>
            {content}
          </TabPanel>
        ))}
      </div>
    </div>
  )
}

export const Basic = () => (
  <TabsExample containerClass="w-max gap-2" />
)

export const Vertical = () => (
  <TabsExample
    orientation="vertical"
    containerClass="max-w-[500px] flex flex-row gap-2"
  />
)

export const ScrollableVerticalTabs = () => (
  <TabsExample
    orientation="vertical"
    scrollable
    containerClass="max-w-[500px] flex flex-row gap-2"
    className="h-[100px]"
  />
)

export const ScrollableHorizontalTabs = () => (
  <TabsExample
    scrollable
    containerClass="w-max gap-2"
    className="w-[100px]"
  />
)


export const TabsWithWrapperStyles = () => {
  const [activeTab, setActiveTab] = React.useState(0)

  return (
    <div>
      <StcStylesProvider customStyles={customStyles}>
        <TabsWithStyles
          defaultActiveTab={activeTab}
          scrollable={true}
          orientation='horizontal'
          className='w-[150px]'
        >
          {tabsData.map(({ index, label }) => (
            <Tab key={index} index={index} label={label} onClick={() => setActiveTab(index)}>
              {label}
            </Tab>
          ))}
        </TabsWithStyles>

        <>
          {tabsData.map(({ index, content }) => (
            <TabPanelWithStyles key={index} value={activeTab} index={index}>
              {content}
            </TabPanelWithStyles>
          ))}
        </>
      </StcStylesProvider>
    </div>
  )
}