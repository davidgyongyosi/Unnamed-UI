import type { Meta, StoryObj } from '@storybook/angular';

/**
 * Component name and description
 *
 * Brief description of what this component does and its primary use cases.
 */
const meta: Meta<YourComponent> = {
  title: 'Components/YourComponent',
  component: YourComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Detailed component description here...',
      },
    },
  },
  argTypes: {
    // Define component props here
    exampleProp: {
      control: 'text',
      description: 'Description of this prop',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<YourComponent>;

/**
 * Default state of the component
 */
export const Default: Story = {
  args: {},
};

/**
 * Component in different states or configurations
 */
export const WithExample: Story = {
  args: {
    exampleProp: 'example value',
  },
};