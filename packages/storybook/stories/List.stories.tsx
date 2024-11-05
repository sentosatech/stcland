import React, { Children } from 'react'
import { List, ListItem, ListSubheader, ListItemText, ListItemIcon, ListItemButton, ListProps } from '@stcland/components'
import { Icon } from '@stcland/components/icon'

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


export const OrderedList = Template.bind({})
OrderedList.args = {
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


export const ListWithButtons = (args) => (
  <List {...args}>
    <ListSubheader>My List With Buttons</ListSubheader>
    <ListItemButton alignItems="center">
      <ListItemIcon>
        <Icon iconName="InboxIcon" />
      </ListItemIcon>
      <ListItemText primary="Inbox" secondary="View Messages" />
    </ListItemButton>
    <ListItemButton alignItems="center" disabled>
      <Icon solid iconName="HeartIcon" />
      <ListItemText primary="Action (Disabled)" secondary="Click to see options" />
    </ListItemButton>
  </List>
)
ListWithButtons.args = { dense: false, disablePadding: false, disableGutters: false }


export const ListWithDivider = Template.bind({})
ListWithDivider.args = {
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


export const ListWithInset = Template.bind({})
ListWithInset.args = {
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

export const NestedListWithToggleExample = (args) => {
  const [openDocuments, setOpenDocuments] = React.useState(false)
  const [openFavorites, setOpenFavorites] = React.useState(false)

  return (
    <List {...args}>
      <ListSubheader>My Nested List</ListSubheader>

      <ListItemButton onClick={() => setOpenDocuments(!openDocuments)} alignItems="center">
        <ListItemIcon>
          <Icon iconName="FolderIcon" />
        </ListItemIcon>
        <ListItemText primary="Documents" />
        <Icon className={openDocuments ? 'rotate-180' : 'rotate-0'} iconName="ChevronDownIcon" />
      </ListItemButton>
      {openDocuments && (
        <List>
          <ListItemButton alignItems="center">
            <ListItemIcon>
              <Icon iconName="HomeIcon" />
            </ListItemIcon>
            <ListItemText primary="Resume.pdf" />
          </ListItemButton>
          <ListItemButton alignItems="center">
            <ListItemIcon>
              <Icon iconName="PencilIcon" />
            </ListItemIcon>
            <ListItemText primary="CoverLetter.docx" />
          </ListItemButton>
        </List>
      )}

      <ListItemButton onClick={() => setOpenFavorites(!openFavorites)} alignItems="center">
        <ListItemIcon>
          <Icon iconName="HeartIcon" />
        </ListItemIcon>
        <ListItemText primary="Favorites" />
        <Icon className={openFavorites ? 'rotate-180' : 'rotate-0'} iconName="ChevronDownIcon" />
      </ListItemButton>
      {openFavorites && (
        <List>
          <ListItemButton alignItems="center">
            <ListItemIcon>
              <Icon iconName="FilmIcon" />
            </ListItemIcon>
            <ListItemText primary="FavoriteItem1" />
          </ListItemButton>
          <ListItemButton alignItems="center">
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
NestedListWithToggleExample.args = { dense: false, disablePadding: false, disableGutters: false }

// Custom Styled List Example
export const ListWithCustomStyles = Template.bind({})
ListWithCustomStyles.args = {
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
