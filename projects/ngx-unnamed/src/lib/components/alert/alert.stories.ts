import type { Meta, StoryObj } from '@storybook/angular';
import { AlertComponent } from './alert.component';
import { NxAlertType } from './alert.types';

const meta: Meta<AlertComponent> = {
  title: 'Components/Alert',
  component: AlertComponent,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'] as NxAlertType[],
      description: 'Alert type determines color scheme and icon',
    },
    closable: {
      control: 'boolean',
      description: 'Whether alert can be closed',
    },
    showIcon: {
      control: 'boolean',
      description: 'Whether to show the alert icon',
    },
    banner: {
      control: 'boolean',
      description: 'Whether alert should be displayed as banner',
    },
    message: {
      control: 'text',
      description: 'Alert message text',
    },
    description: {
      control: 'text',
      description: 'Alert description text',
    },
    icon: {
      control: 'text',
      description: 'Custom icon name (overrides default icon)',
    },
    nxOnClose: {
      action: 'closed',
      description: 'Event emitted when alert is closed',
    },
  },
  args: {
    type: 'info',
    closable: false,
    showIcon: true,
    banner: false,
    message: 'Information message',
    description: 'Additional description text to provide more context.',
  },
};

export default meta;
type Story = StoryObj<AlertComponent>;

export const Default: Story = {
  args: {
    message: 'This is an informational alert message',
    description: 'Here is some additional information to help the user understand the context.',
  },
};

export const Success: Story = {
  args: {
    type: 'success',
    message: 'Success! Your changes have been saved.',
    description: 'The operation completed successfully and your data is now available.',
  },
};

export const Warning: Story = {
  args: {
    type: 'warning',
    message: 'Warning: Please review your input',
    description: 'There might be an issue with the information you provided. Please check and try again.',
  },
};

export const Error: Story = {
  args: {
    type: 'error',
    message: 'Error: Unable to process your request',
    description: 'An unexpected error occurred. Please try again later or contact support if the issue persists.',
  },
};

export const Closable: Story = {
  args: {
    closable: true,
    message: 'This alert can be closed',
    description: 'Click the X button in the top-right corner to dismiss this alert.',
  },
};

export const WithoutIcon: Story = {
  args: {
    showIcon: false,
    message: 'Alert without icon',
    description: 'This alert has no icon for a more compact appearance.',
  },
};

export const Banner: Story = {
  args: {
    banner: true,
    message: 'This is a banner alert',
    description: 'Banner alerts span the full width and have no border radius.',
  },
};

export const CustomIcon: Story = {
  args: {
    icon: 'warning',
    message: 'Alert with custom icon',
    description: 'This alert uses a custom icon instead of the default one.',
  },
};

export const WithMessageInput: Story = {
  args: {
    message: 'Alert with message input',
    description: 'This message is set via the message input property.',
  },
};

export const WithContentProjection: Story = {
  render: () => ({
    template: `
      <nx-alert type="info">
        <strong>This is projected content</strong>
        <br />
        You can use HTML formatting in projected content.
      </nx-alert>
    `,
  }),
};

export const WithActionTemplate: Story = {
  render: () => ({
    template: `
      <nx-alert type="warning" message="Alert with actions" description="This alert has custom action buttons.">
        <ng-template #actionTemplate>
          <button nx-button nx-variant="primary" style="margin-right: 8px;">Confirm</button>
          <button nx-button nx-variant="ghost">Cancel</button>
        </ng-template>
      </nx-alert>
    `,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 600px;">
        <nx-alert type="info" message="Info Alert" description="This is an informational alert."></nx-alert>
        <nx-alert type="success" message="Success Alert" description="Operation completed successfully."></nx-alert>
        <nx-alert type="warning" message="Warning Alert" description="Please review the information provided."></nx-alert>
        <nx-alert type="error" message="Error Alert" description="An error occurred while processing."></nx-alert>
      </div>
    `,
  }),
};

export const Interactive: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 600px;">
        <nx-alert
          type="info"
          closable="true"
          message="Interactive Alert"
          description="Try closing this alert using the X button.">
        </nx-alert>
        <nx-alert
          type="success"
          closable="true"
          message="Another closable alert"
          description="This one can also be dismissed.">
        </nx-alert>
      </div>
    `,
  }),
};

export const BannerExamples: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 800px;">
        <nx-alert
          banner="true"
          type="info"
          closable="true"
          message="Site-wide notification"
          description="This banner alert spans the full width and can be dismissed.">
        </nx-alert>
        <nx-alert
          banner="true"
          type="warning"
          message="Maintenance notice"
          description="Scheduled maintenance will occur on Sunday from 2-4 AM EST.">
        </nx-alert>
      </div>
    `,
  }),
};