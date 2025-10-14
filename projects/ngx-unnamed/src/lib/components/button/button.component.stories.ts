import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button.component';

const meta: Meta<ButtonComponent> = {
  title: 'Components/Button',
  component: ButtonComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants, sizes, and states.',
      },
    },
  },
  argTypes: {
    nxVariant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'outline', 'ghost', 'dashed', 'link'],
      description: 'Button style variant',
    },
    nxSize: {
      control: 'select',
      options: ['small', 'default', 'large'],
      description: 'Button size',
    },
    nxShape: {
      control: 'select',
      options: ['default', 'circle', 'round'],
      description: 'Button shape',
    },
    nxLoading: {
      control: 'boolean',
      description: 'Show loading state',
    },
    nxBlock: {
      control: 'boolean',
      description: 'Make button full width',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable button',
    },
  },
  };

export default meta;
type Story = StoryObj<ButtonComponent>;

export const Default: Story = {
  args: {
    nxVariant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    nxVariant: 'secondary',
  },
};

export const Danger: Story = {
  args: {
    nxVariant: 'danger',
  },
};

export const Outline: Story = {
  args: {
    nxVariant: 'outline',
  },
};

export const Ghost: Story = {
  args: {
    nxVariant: 'ghost',
  },
};

export const Dashed: Story = {
  args: {
    nxVariant: 'dashed',
  },
};

export const Link: Story = {
  args: {
    nxVariant: 'link',
  },
};

export const Small: Story = {
  args: {
    nxSize: 'small',
  },
};

export const Large: Story = {
  args: {
    nxSize: 'large',
  },
};

export const Circle: Story = {
  render: () => ({
    template: `<button nx-button nxShape="circle">🔍</button>`,
  }),
};

export const Round: Story = {
  args: {
    nxShape: 'round',
  },
};

export const Loading: Story = {
  args: {
    nxLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Block: Story = {
  args: {
    nxBlock: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Block level button takes full width of its container.',
      },
    },
  },
};

export const WithIcon: Story = {
  render: () => ({
    template: `
      <button nx-button nxVariant="primary">
        <span nxIcon type="user" theme="outline"></span>
        Click Me
      </button>
    `,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
        <button nx-button nxVariant="primary">Primary</button>
        <button nx-button nxVariant="secondary">Secondary</button>
        <button nx-button nxVariant="danger">Danger</button>
        <button nx-button nxVariant="outline">Outline</button>
        <button nx-button nxVariant="ghost">Ghost</button>
        <button nx-button nxVariant="dashed">Dashed</button>
        <button nx-button nxVariant="link">Link</button>
      </div>
    `,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
        <button nx-button nxSize="small">Small</button>
        <button nx-button nxSize="default">Default</button>
        <button nx-button nxSize="large">Large</button>
      </div>
    `,
  }),
};

export const InteractiveStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
        <button nx-button>Normal</button>
        <button nx-button [disabled]="true">Disabled</button>
        <button nx-button [nxLoading]="true">Loading</button>
      </div>
    `,
  }),
};