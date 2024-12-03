import React from 'react'
import type { StoryFn } from '@storybook/react'
import { List, ListItem, ListItemText, ListItemButton, ListProps, StcStylesProvider } from '@stcland/components'
import { Icon } from '@stcland/components/icon'
import { List as ListWithStyles } from '@stcland/components/withStyles'
import customStyles from '../stc.config'

export default {
  title: 'Components/List',
  component: List,
  argTypes: {
    dense: { control: 'boolean' },
    disablePadding: { control: 'boolean' },
    disableGutters: { control: 'boolean' },
    ordered: { control: 'boolean' },
  },
}


const Template = (args: ListProps) => (
  <List {...args}>
  </List>
)


export const Default = Template.bind({})
Default.args = {
  dense: false,
  disablePadding: false,
  disableGutters: false,
  ordered: false,
  subheader: 'My Basic List',
  children:
  <>
    <ListItem>
      <ListItemText primaryText="Item 1" secondaryText="Details about item 1" />
    </ListItem>
    <ListItem>
      <ListItemText primaryText="Item 2" secondaryText="Details about item 2" />
    </ListItem>
  </>
}


export const Ordered = Template.bind({})
Ordered.args = {
  ordered: true,
  dense: false,
  disablePadding: false,
  disableGutters: false,
  subheader: 'My Ordered List',
  children: (
    <>
      <ListItem>
        <ListItemText primaryText="One" secondaryText="Los detalles del primero" />
      </ListItem>
      <ListItem>
        <ListItemText primaryText="Two" secondaryText="Los detalles del segundo" />
      </ListItem>
    </>
  ),
}


export const WithButtons = (args) => (
  <List subheader='My List With Buttons' {...args}>
    <ListItemButton >
      <Icon iconName="InboxIcon"/>
      <ListItemText primaryText="Inbox" secondaryText="View Messages" />
    </ListItemButton>
    <ListItemButton disabled>
      <Icon solid iconName="HeartIcon" />
      <ListItemText primaryText="Action (Disabled)" secondaryText="Click to see options" />
    </ListItemButton>
  </List>
)
WithButtons.args = { dense: false, disablePadding: false, disableGutters: false }


export const WithDivider = Template.bind({})
WithDivider.args = {
  subheader: 'My List With Dividers',
  children: (
    <>
      <ListItem divider>
        <ListItemText primaryText="Item 1" secondaryText="Details about item 1" />
      </ListItem>
      <ListItem divider>
        <ListItemText primaryText="Item 2" secondaryText="Details about item 2" />
      </ListItem>
      <ListItem>
        <ListItemText primaryText="Item 3" secondaryText="Details about item 3" />
      </ListItem>
    </>
  ),
}


export const WithInset = Template.bind({})
WithInset.args = {
  subheader: 'My Inset List',
  children: (
    <>
      <ListItem>
        <ListItemText primaryText="Inset Item" inset />
      </ListItem>
      <ListItem>
        <ListItemText primaryText="Another Inset Item" inset />
      </ListItem>
    </>
  ),
}

export const NestedWithToggleExample = (args) => {
  const [openDocuments, setOpenDocuments] = React.useState(false)
  const [openFavorites, setOpenFavorites] = React.useState(false)

  return (
    <List subheader='My Nested List' {...args}>
      <ListItemButton onClick={() => setOpenDocuments(!openDocuments)} >
        <Icon iconName="FolderIcon" />
        <ListItemText primaryText="Documents" />
        <Icon className={openDocuments ? 'rotate-180' : 'rotate-0'} iconName="ChevronDownIcon" />
      </ListItemButton>
      {openDocuments && (
        <List>
          <ListItemButton >
            <Icon iconName="HomeIcon" />
            <ListItemText primaryText="Resume.pdf" />
          </ListItemButton>
          <ListItemButton>
            <Icon iconName="PencilIcon" />
            <ListItemText primaryText="CoverLetter.docx" />
          </ListItemButton>
        </List>
      )}

      <ListItemButton onClick={() => setOpenFavorites(!openFavorites)}>
        <Icon iconName="HeartIcon" />
        <ListItemText primaryText="Favorites" />
        <Icon className={openFavorites ? 'rotate-180' : 'rotate-0'} iconName="ChevronDownIcon" />
      </ListItemButton>
      {openFavorites && (
        <List>
          <ListItemButton>
            <Icon iconName="FilmIcon" />
            <ListItemText primaryText="FavoriteItem1" />
          </ListItemButton>
          <ListItemButton >
            <Icon iconName="FilmIcon" />
            <ListItemText primaryText="FavoriteItem2" />
          </ListItemButton>
        </List>
      )}
    </List>
  )
}
NestedWithToggleExample.args = { dense: false, disablePadding: false, disableGutters: false }

// Custom Styled List Example
export const WithCustomStyles = Template.bind({})
WithCustomStyles.args = {
  subheader: 'Custom Styled List',
  className: 'bg-gray-100',
  customStyles: {
    list: {
      subheader: 'text-secondary-dark'
    },
    listItem: {
      divider: 'border-b border-secondary-dark'
    },
    listItemText: {
      primaryText: 'text-primary-dark',
      secondaryText: 'text-primary-main'
    }
  },
  children: (
    <>
      <ListItem divider>
        <ListItemText primaryText="Custom Item 1" secondaryText="More details here" />
      </ListItem>
      <ListItem>
        <ListItemText primaryText="Custom Item 2" secondaryText="More details here" />
      </ListItem>
    </>
  ),
}


export const WithSelectedItem = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index)
  }

  return (
    <>
      <List aria-label="main folders" divider subheader='List With Selected Item'>
        <ListItemButton
          selected={selectedIndex === 0}
          onClick={(event) => handleListItemClick(event, 0)}
        >
          <Icon iconName='BeakerIcon' />
          <ListItemText primaryText="Tests" />
        </ListItemButton>
        <ListItemButton
          selected={selectedIndex === 1}
          onClick={(event) => handleListItemClick(event, 1)}
        >
          <Icon iconName='AtSymbolIcon' />
          <ListItemText primaryText="Emails" />
        </ListItemButton>
      </List>
      <List aria-label="secondaryText folder">
        <ListItemButton
          selected={selectedIndex === 2}
          onClick={(event) => handleListItemClick(event, 2)}
        >
          <ListItemText primaryText="Lab" />
        </ListItemButton>
        <ListItemButton
          selected={selectedIndex === 3}
          onClick={(event) => handleListItemClick(event, 3)}
        >
          <ListItemText primaryText="Code" />
        </ListItemButton>
      </List>
    </>
  )
}


// Custom Styled List Example
const WithStylesTemplate: StoryFn = () => (
  <StcStylesProvider customStyles={customStyles}>
    <ListWithStyles subheader='Custom Styled List'>
      <ListItem divider>
        <ListItemText primaryText="Custom Item 1" secondaryText="More details here" />
      </ListItem>
      <ListItemButton>
        <ListItemText primaryText="Custom Item 2" secondaryText="More details here" />
      </ListItemButton>
      <ListItemButton disabled>
        <ListItemText primaryText="Custom Disabled" secondaryText="Hello World!" />
      </ListItemButton>
    </ListWithStyles>
  </StcStylesProvider>
)

export const WithStylesWrapper = WithStylesTemplate.bind({})