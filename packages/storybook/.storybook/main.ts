import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const config: StorybookConfig = {
  stories: [
    '../stories/*.stories.@(js|jsx|ts|tsx)',
    '../stories/*.mdx',
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-docs",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
 async viteFinal(config) {
  return mergeConfig(config, {
    optimizeDeps: {
      exclude: ["node_modules/.cache/sb-vite"],
    },
    assetsInclude: ["/sb-preview/runtime.js"], 
      css: {
      postcss: {
        plugins: [
          tailwindcss('./tailwind.config.ts'),
          autoprefixer(),
        ],
      },
    },
  });
},
};
export default config;
