import { addons } from '@storybook/addons';
import { create, themes } from '@storybook/theming';

const theme = create({
  base: 'dark',
  brandTitle: 'STCland Storybook',
  brandUrl: 'https://www.sentosatech.com/',
  brandImage: 'https://www.sentosatech.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsentosa-logo.8e65dd13.png&w=750&q=75', 
  brandTarget: '_self',
});

addons.setConfig({
  theme,
});
