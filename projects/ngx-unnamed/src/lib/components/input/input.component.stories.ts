import type { Meta, StoryObj } from '@storybook/angular';
import { InputDirective } from './input.directive';

const meta: Meta<InputDirective> = {
  title: 'Components/Input',
  component: InputDirective,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible input directive with various states and configurations.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<InputDirective>;

export const Default: Story = {
  render: () => ({
    template: `<input nx-input placeholder="Enter text here" />`,
  }),
};

export const Small: Story = {
  render: () => ({
    template: `<input nx-input nxSize="small" placeholder="Small input" />`,
  }),
};

export const Large: Story = {
  render: () => ({
    template: `<input nx-input nxSize="large" placeholder="Large input" />`,
  }),
};

export const Error: Story = {
  render: () => ({
    template: `<input nx-input nxStatus="error" value="Invalid input" />`,
  }),
};

export const Warning: Story = {
  render: () => ({
    template: `<input nx-input nxStatus="warning" value="Warning state" />`,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `<input nx-input disabled value="Disabled input" />`,
  }),
};

export const Readonly: Story = {
  render: () => ({
    template: `<input nx-input readonly value="Readonly value" />`,
  }),
};

export const Password: Story = {
  render: () => ({
    template: `<input nx-input type="password" placeholder="Enter password" />`,
  }),
};

export const Email: Story = {
  render: () => ({
    template: `<input nx-input type="email" placeholder="Enter email" />`,
  }),
};

export const Number: Story = {
  render: () => ({
    template: `<input nx-input type="number" placeholder="Enter number" />`,
  }),
};

export const WithLabel: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <label for="input">Username</label>
        <input nx-input id="input" placeholder="Enter username" />
      </div>
    `,
  }),
};

export const WithHelperText: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <input nx-input placeholder="Enter text here" />
        <small style="color: #666;">Helper text goes here</small>
      </div>
    `,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <input nx-input nxSize="small" placeholder="Small input" />
        <input nx-input nxSize="default" placeholder="Default input" />
        <input nx-input nxSize="large" placeholder="Large input" />
      </div>
    `,
  }),
};

export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <input nx-input placeholder="Default state" />
        <input nx-input nxStatus="error" value="Error state" />
        <input nx-input nxStatus="warning" value="Warning state" />
        <input nx-input disabled value="Disabled state" />
        <input nx-input readonly value="Readonly state" />
      </div>
    `,
  }),
};

export const FormExample: Story = {
  render: () => ({
    template: `
      <form style="display: flex; flex-direction: column; gap: 16px; max-width: 300px;">
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <label for="name">Name</label>
          <input nx-input id="name" placeholder="Enter your name" />
        </div>
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <label for="email">Email</label>
          <input nx-input id="email" type="email" placeholder="Enter your email" />
        </div>
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <label for="password">Password</label>
          <input nx-input id="password" type="password" placeholder="Enter your password" />
        </div>
      </form>
    `,
  }),
};