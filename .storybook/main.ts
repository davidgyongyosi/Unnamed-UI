import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: [
    '../projects/ngx-unnamed/src/lib/**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
    '../projects/ngx-unnamed-icons/src/lib/**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};

export default config;