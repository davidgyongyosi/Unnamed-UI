import type { Meta, StoryObj } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from './select.component';
import { SelectOption, SelectMode } from './select.types';

const meta: Meta<SelectComponent> = {
  title: 'Components/Select',
  component: SelectComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile select component with single/multiple modes, search functionality, and comprehensive keyboard navigation.',
      },
    },
  },
  argTypes: {
    nxOptions: {
      control: 'object',
      description: 'Array of select options',
    },
    nxMode: {
      control: 'select',
      options: ['default', 'multiple', 'tags'],
      description: 'Select mode (single, multiple, or tags)',
    },
    nxSize: {
      control: 'select',
      options: ['small', 'default', 'large'],
      description: 'Select size',
    },
    nxPlaceholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    nxDisabled: {
      control: 'boolean',
      description: 'Disable the select',
    },
    nxLoading: {
      control: 'boolean',
      description: 'Show loading state',
    },
    nxAllowClear: {
      control: 'boolean',
      description: 'Show clear button',
    },
    nxShowSearch: {
      control: 'boolean',
      description: 'Enable search functionality',
    },
  },
};

export default meta;
type Story = StoryObj<SelectComponent>;

// Sample data
const sampleOptions: SelectOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape' },
  { value: 'strawberry', label: 'Strawberry' },
];

const largeOptions: SelectOption[] = Array.from({ length: 1000 }, (_, i) => ({
  value: `item-${i}`,
  label: `Item ${i + 1}`,
}));

// Stories
export const Default: Story = {
  args: {
    nxOptions: sampleOptions,
    nxPlaceholder: 'Select an option',
  },
};

export const Multiple: Story = {
  args: {
    nxOptions: sampleOptions,
    nxMode: 'multiple',
    nxPlaceholder: 'Select multiple options',
  },
};

export const Tags: Story = {
  args: {
    nxOptions: sampleOptions,
    nxMode: 'tags',
    nxPlaceholder: 'Select tags',
  },
};

export const WithSearch: Story = {
  args: {
    nxOptions: largeOptions,
    nxShowSearch: true,
    nxPlaceholder: 'Search and select',
  },
};

export const Disabled: Story = {
  args: {
    nxOptions: sampleOptions,
    nxDisabled: true,
    nxPlaceholder: 'Disabled select',
  },
};

export const Loading: Story = {
  args: {
    nxOptions: sampleOptions,
    nxLoading: true,
    nxPlaceholder: 'Loading...',
  },
};

export const Clearable: Story = {
  args: {
    nxOptions: sampleOptions,
    nxAllowClear: true,
    nxPlaceholder: 'Clearable select',
  },
};

export const Small: Story = {
  args: {
    nxOptions: sampleOptions,
    nxSize: 'small',
    nxPlaceholder: 'Small select',
  },
};

export const Large: Story = {
  args: {
    nxOptions: sampleOptions,
    nxSize: 'large',
    nxPlaceholder: 'Large select',
  },
};