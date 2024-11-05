import React from 'react'
import type { StoryFn } from '@storybook/react'
import { List, ListItem, ListSubheader, ListItemText, ListItemIcon, ListItemButton, ListProps } from '@stcland/components'
import { Icon } from '@stcland/components/icon'
import { StcStylesProvider } from '@stcland/components'
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
  children:
  <>
    <ListSubheader>My Basic List</ListSubheader>
    <ListItem>
      <ListItemText primary="Item 1" secondary="Details about item 1" />
    </ListItem>
    <ListItem>
      <ListItemText primary="Item 2" secondary="Details about item 2" />
    </ListItem>
  </>
}


export const Ordered = Template.bind({})
Ordered.args = {
  ordered: true,
  dense: false,
  disablePadding: false,
  disableGutters: false,
  children: (
    <>
      <ListSubheader>My Ordered List</ListSubheader>
      <ListItem>
        <ListItemText primary="One" secondary="Los detalles del primero" />
      </ListItem>
      <ListItem>
        <ListItemText primary="Two" secondary="Los detalles del segundo" />
      </ListItem>
    </>
  ),
}


export const WithButtons = (args) => (
  <List {...args}>
    <ListSubheader>My List With Buttons</ListSubheader>
    <ListItemButton >
      <ListItemIcon>
        <Icon iconName="InboxIcon" />
      </ListItemIcon>
      <ListItemText primary="Inbox" secondary="View Messages" />
    </ListItemButton>
    <ListItemButton disabled>
      <Icon solid iconName="HeartIcon" />
      <ListItemText primary="Action (Disabled)" secondary="Click to see options" />
    </ListItemButton>
  </List>
)
WithButtons.args = { dense: false, disablePadding: false, disableGutters: false }


export const WithDivider = Template.bind({})
WithDivider.args = {
  children: (
    <>
      <ListSubheader>My List With Dividers</ListSubheader>
      <ListItem divider>
        <ListItemText primary="Item 1" secondary="Details about item 1" />
      </ListItem>
      <ListItem divider>
        <ListItemText primary="Item 2" secondary="Details about item 2" />
      </ListItem>
      <ListItem>
        <ListItemText primary="Item 3" secondary="Details about item 3" />
      </ListItem>
    </>
  ),
}


export const WithInset = Template.bind({})
WithInset.args = {
  children: (
    <>
      <ListSubheader>My Inset List</ListSubheader>
      <ListItem>
        <ListItemText primary="Inset Item" inset />
      </ListItem>
      <ListItem>
        <ListItemText primary="Another Inset Item" inset />
      </ListItem>
    </>
  ),
}

export const NestedWithToggleExample = (args) => {
  const [openDocuments, setOpenDocuments] = React.useState(false)
  const [openFavorites, setOpenFavorites] = React.useState(false)

  return (
    <List {...args}>
      <ListSubheader>My Nested List</ListSubheader>

      <ListItemButton onClick={() => setOpenDocuments(!openDocuments)} >
        <ListItemIcon>
          <Icon iconName="FolderIcon" />
        </ListItemIcon>
        <ListItemText primary="Documents" />
        <Icon className={openDocuments ? 'rotate-180' : 'rotate-0'} iconName="ChevronDownIcon" />
      </ListItemButton>
      {openDocuments && (
        <List>
          <ListItemButton >
            <ListItemIcon>
              <Icon iconName="HomeIcon" />
            </ListItemIcon>
            <ListItemText primary="Resume.pdf" />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <Icon iconName="PencilIcon" />
            </ListItemIcon>
            <ListItemText primary="CoverLetter.docx" />
          </ListItemButton>
        </List>
      )}

      <ListItemButton onClick={() => setOpenFavorites(!openFavorites)}>
        <ListItemIcon>
          <Icon iconName="HeartIcon" />
        </ListItemIcon>
        <ListItemText primary="Favorites" />
        <Icon className={openFavorites ? 'rotate-180' : 'rotate-0'} iconName="ChevronDownIcon" />
      </ListItemButton>
      {openFavorites && (
        <List>
          <ListItemButton >
            <ListItemIcon>
              <Icon iconName="FilmIcon" />
            </ListItemIcon>
            <ListItemText primary="FavoriteItem1" />
          </ListItemButton>
          <ListItemButton >
            <ListItemIcon>
              <Icon iconName="FilmIcon" />
            </ListItemIcon>
            <ListItemText primary="FavoriteItem2" />
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
  className: 'bg-gray-100',
  children: (
    <>
      <ListSubheader>Custom Styled List</ListSubheader>
      <ListItem>
        <ListItemText primary="Custom Item 1" secondary="More details here" />
      </ListItem>
      <ListItem>
        <ListItemText primary="Custom Item 2" secondary="More details here" />
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
      <List aria-label="main folders" divider>
        <ListItemButton
          selected={selectedIndex === 0}
          onClick={(event) => handleListItemClick(event, 0)}
        >
          <ListItemIcon>
            <Icon iconName='BeakerIcon' />
          </ListItemIcon>
          <ListItemText primary="Tests" />
        </ListItemButton>
        <ListItemButton
          selected={selectedIndex === 1}
          onClick={(event) => handleListItemClick(event, 1)}
        >
          <ListItemIcon>
            <Icon iconName='AtSymbolIcon' />
          </ListItemIcon>
          <ListItemText primary="Emails" />
        </ListItemButton>
      </List>
      <List aria-label="secondary folder">
        <ListItemButton
          selected={selectedIndex === 2}
          onClick={(event) => handleListItemClick(event, 2)}
        >
          <ListItemText primary="Lab" />
        </ListItemButton>
        <ListItemButton
          selected={selectedIndex === 3}
          onClick={(event) => handleListItemClick(event, 3)}
        >
          <ListItemText primary="Code" />
        </ListItemButton>
      </List>
    </>
  )
}


// Custom Styled List Example
const WithStylesTemplate: StoryFn = () => (
  <StcStylesProvider customStyles={customStyles}>
    <ListWithStyles>
      <ListSubheader>Custom Styled List</ListSubheader>
      <ListItem divider>
        <ListItemText primary="Custom Item 1" secondary="More details here" />
      </ListItem>
      <ListItemButton>
        <ListItemText primary="Custom Item 2" secondary="More details here" />
      </ListItemButton>
      <ListItemButton disabled>
        <ListItemText primary="Custom Disabled" secondary="Hello World!" />
      </ListItemButton>
    </ListWithStyles>
  </StcStylesProvider>
)

export const WithStylesWrapper = WithStylesTemplate.bind({})