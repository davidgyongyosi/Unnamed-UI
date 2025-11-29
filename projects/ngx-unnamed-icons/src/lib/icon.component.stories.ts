import type { Meta, StoryObj } from '@storybook/angular';
import { NxIconDirective } from './icon.directive';

const meta: Meta<NxIconDirective> = {
  title: 'Components/Icon',
  component: NxIconDirective,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Icon directive for displaying SVG icons with theme support.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'text',
      description: 'Icon type/name',
    },
    theme: {
      control: 'select',
      options: ['outline', 'fill', 'twotone'],
      description: 'Icon theme variant',
    },
    spin: {
      control: 'boolean',
      description: 'Add spinning animation',
    },
    size: {
      control: 'number',
      description: 'Icon size in pixels',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<NxIconDirective>;

export const Default: Story = {
  render: (args: any) => ({
    props: args,
    template: `<span nxIcon [type]="type" [theme]="theme" [spin]="spin" [size]="size"></span>`,
  }),
  args: {
    type: 'user',
    theme: 'outline',
  },
};

export const Outline: Story = {
  render: (args: any) => ({
    props: args,
    template: `<span nxIcon [type]="type" [theme]="theme" [spin]="spin" [size]="size"></span>`,
  }),
  args: {
    type: 'user',
    theme: 'outline',
  },
};

export const Fill: Story = {
  render: (args: any) => ({
    props: args,
    template: `<span nxIcon [type]="type" [theme]="theme" [spin]="spin" [size]="size"></span>`,
  }),
  args: {
    type: 'user',
    theme: 'fill',
  },
};

export const Twotone: Story = {
  render: (args: any) => ({
    props: args,
    template: `<span nxIcon [type]="type" [theme]="theme" [spin]="spin" [size]="size"></span>`,
  }),
  args: {
    type: 'user',
    theme: 'twotone',
  },
};

export const Spinning: Story = {
  render: (args: any) => ({
    props: args,
    template: `<span nxIcon [type]="type" [theme]="theme" [spin]="spin" [size]="size"></span>`,
  }),
  args: {
    type: 'loading',
    theme: 'outline',
    spin: true,
  },
};

export const Large: Story = {
  render: (args: any) => ({
    props: args,
    template: `<span nxIcon [type]="type" [theme]="theme" [spin]="spin" [size]="size"></span>`,
  }),
  args: {
    type: 'user',
    theme: 'outline',
    size: 32,
  },
};

export const Small: Story = {
  render: (args: any) => ({
    props: args,
    template: `<span nxIcon [type]="type" [theme]="theme" [spin]="spin" [size]="size"></span>`,
  }),
  args: {
    type: 'user',
    theme: 'outline',
    size: 12,
  },
};

export const CommonIcons: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
        <span nxIcon type="user" theme="outline"></span>
        <span nxIcon type="setting" theme="outline"></span>
        <span nxIcon type="home" theme="outline"></span>
        <span nxIcon type="search" theme="outline"></span>
        <span nxIcon type="heart" theme="outline"></span>
        <span nxIcon type="star" theme="outline"></span>
        <span nxIcon type="check" theme="outline"></span>
        <span nxIcon type="close" theme="outline"></span>
        <span nxIcon type="plus" theme="outline"></span>
        <span nxIcon type="minus" theme="outline"></span>
      </div>
    `,
  }),
};

export const IconThemes: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; text-align: center;">
        <div>
          <span nxIcon type="heart" theme="outline" style="font-size: 24px;"></span>
          <div style="margin-top: 8px; font-size: 12px;">Outline</div>
        </div>
        <div>
          <span nxIcon type="heart" theme="fill" style="font-size: 24px;"></span>
          <div style="margin-top: 8px; font-size: 12px;">Fill</div>
        </div>
        <div>
          <span nxIcon type="heart" theme="twotone" style="font-size: 24px;"></span>
          <div style="margin-top: 8px; font-size: 12px;">Twotone</div>
        </div>
      </div>
    `,
  }),
};

export const IconSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; align-items: center; gap: 16px;">
        <span nxIcon type="user" theme="outline" [size]="12"></span>
        <span nxIcon type="user" theme="outline" [size]="16"></span>
        <span nxIcon type="user" theme="outline" [size]="20"></span>
        <span nxIcon type="user" theme="outline" [size]="24"></span>
        <span nxIcon type="user" theme="outline" [size]="32"></span>
        <span nxIcon type="user" theme="outline" [size]="48"></span>
      </div>
    `,
  }),
};

export const WithButtons: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
        <button nx-button>
          <span nxIcon type="user" theme="outline"></span>
          User
        </button>
        <button nx-button nxVariant="secondary">
          <span nxIcon type="setting" theme="outline"></span>
          Settings
        </button>
        <button nx-button nxVariant="danger">
          <span nxIcon type="delete" theme="outline"></span>
          Delete
        </button>
        <button nx-button nxVariant="outline">
          <span nxIcon type="download" theme="outline"></span>
          Download
        </button>
      </div>
    `,
  }),
};

export const LoadingStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; align-items: center;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span nxIcon type="loading" theme="outline" [spin]="true"></span>
          <span>Loading...</span>
        </div>
        <button nx-button [nxLoading]="true">
          Processing
        </button>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span nxIcon type="sync" theme="outline" [spin]="true"></span>
          <span>Syncing...</span>
        </div>
      </div>
    `,
  }),
};

export const StatusIcons: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; align-items: center;">
        <div style="display: flex; align-items: center; gap: 8px; color: #52c41a;">
          <span nxIcon type="check-circle" theme="fill"></span>
          <span>Success</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; color: #faad14;">
          <span nxIcon type="warning-circle" theme="fill"></span>
          <span>Warning</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; color: #f5222d;">
          <span nxIcon type="x-circle" theme="fill"></span>
          <span>Error</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; color: #1890ff;">
          <span nxIcon type="info-circle" theme="fill"></span>
          <span>Info</span>
        </div>
      </div>
    `,
  }),
};