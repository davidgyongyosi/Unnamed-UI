import type { ArgTypes } from '@storybook/angular';

/**
 * Standard argTypes configuration pattern for components
 */
export const standardArgTypes: Partial<ArgTypes> = {
  // Size options
  size: {
    control: 'select',
    options: ['small', 'default', 'large'],
    description: 'Component size',
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'default' },
    },
  },

  // Variant options
  variant: {
    control: 'select',
    options: ['primary', 'secondary', 'outline', 'ghost'],
    description: 'Component style variant',
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'primary' },
    },
  },

  // Boolean props
  disabled: {
    control: 'boolean',
    description: 'Disable the component',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: 'false' },
    },
  },

  loading: {
    control: 'boolean',
    description: 'Show loading state',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: 'false' },
    },
  },

  // Event handlers
  onClick: {
    action: 'clicked',
    description: 'Click event handler',
    table: {
      category: 'events',
      type: { summary: 'function' },
    },
  },

  onChange: {
    action: 'changed',
    description: 'Change event handler',
    table: {
      category: 'events',
      type: { summary: 'function' },
    },
  },
};