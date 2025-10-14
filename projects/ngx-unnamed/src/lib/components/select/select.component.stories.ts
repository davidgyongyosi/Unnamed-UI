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
    nxShowSearch: {
      control: 'boolean',
      description: 'Enable search functionality',
    },
    nxLoading: {
      control: 'boolean',
      description: 'Show loading state',
    },
    nxDisabled: {
      control: 'boolean',
      description: 'Disable select',
    },
    nxAllowClear: {
      control: 'boolean',
      description: 'Allow clearing selection',
    },
    nxMaxTagCount: {
      control: 'number',
      description: 'Maximum number of tags to display in multi-select',
    },
    nxPlacement: {
      control: 'select',
      options: ['bottomLeft', 'bottomRight', 'topLeft', 'topRight'],
      description: 'Dropdown placement',
    },
  },
  decorators: [
    (story) => ({
      template: `
        <div style="min-width: 300px; padding: 20px;">
          ${story.template}
        </div>
      `,
    }),
  ],
};

export default meta;
type Story = StoryObj<SelectComponent>;

// Sample options for stories
const sampleOptions: SelectOption[] = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
  { label: 'Option 4', value: '4', disabled: true },
  { label: 'Option 5', value: '5' },
];

const largeOptions: SelectOption[] = Array.from({ length: 50 }, (_, i) => ({
  label: `Option ${i + 1}`,
  value: `${i + 1}`,
}));

const groupedOptions: SelectOption[] = [
  { label: 'Apple', value: 'apple', group: 'Fruits' },
  { label: 'Banana', value: 'banana', group: 'Fruits' },
  { label: 'Carrot', value: 'carrot', group: 'Vegetables' },
  { label: 'Broccoli', value: 'broccoli', group: 'Vegetables' },
];

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
    nxPlaceholder: 'Select options',
  },
};

export const Tags: Story = {
  args: {
    nxOptions: sampleOptions,
    nxMode: 'tags',
    nxPlaceholder: 'Add tags',
  },
};

export const WithSearch: Story = {
  args: {
    nxOptions: largeOptions,
    nxShowSearch: true,
    nxPlaceholder: 'Search and select',
  },
  parameters: {
    docs: {
      description: {
        story: 'Select with search functionality for filtering options.',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    nxOptions: sampleOptions,
    nxLoading: true,
    nxPlaceholder: 'Loading...',
  },
};

export const Disabled: Story = {
  args: {
    nxOptions: sampleOptions,
    nxDisabled: true,
    nxPlaceholder: 'Disabled select',
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

export const WithMaxTagCount: Story = {
  args: {
    nxOptions: largeOptions.slice(0, 10),
    nxMode: 'multiple',
    nxMaxTagCount: 3,
    nxPlaceholder: 'Multiple with tag limit',
  },
  parameters: {
    docs: {
      description: {
        story: 'Multi-select with maximum tag count display. Additional selections are summarized.",
      },
    },
  },
};

export const WithDisabledOptions: Story = {
  args: {
    nxOptions: sampleOptions,
    nxPlaceholder: 'Select (some disabled)',
  },
};

export const Clearable: Story = {
  args: {
    nxOptions: sampleOptions,
    nxAllowClear: true,
    nxPlaceholder: 'Clearable select',
  },
};

export const CustomTemplates: Story = {
  render: () => ({
    template: `
      <nx-select [nxOptions]="customOptions" nxPlaceholder="Custom templates">
        <ng-template #option let-option let-selected="selected" let-disabled="disabled">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="color: {{option.value === 'premium' ? '#f39c12' : '#3498db'}};">●</span>
            <span>{{ option.label }}</span>
            @if (option.value === 'premium') {
              <span style="background: #f39c12; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px;">PREMIUM</span>
            }
          </div>
        </ng-template>
        <ng-template #selectedValue let-selected let-multiple="multiple" let-count="count">
          @if (multiple) {
            <span>{{ count }} items selected</span>
          } @else {
            <span style="color: {{selected.value === 'premium' ? '#f39c12' : '#3498db'}};">●</span>
            <span>{{ selected.label }}</span>
          }
        </ng-template>
      </nx-select>
    `,
    props: {
      customOptions: [
        { label: 'Basic Plan', value: 'basic' },
        { label: 'Premium Plan', value: 'premium' },
        { label: 'Enterprise Plan', value: 'enterprise' },
      ],
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Select with custom option and selected value templates using ng-template.',
      },
    },
  },
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <nx-select [nxOptions]="options" nxSize="small" nxPlaceholder="Small size"></nx-select>
        <nx-select [nxOptions]="options" nxSize="default" nxPlaceholder="Default size"></nx-select>
        <nx-select [nxOptions]="options" nxSize="large" nxPlaceholder="Large size"></nx-select>
      </div>
    `,
    props: {
      options: sampleOptions,
    },
  }),
};

export const AllModes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <nx-select [nxOptions]="options" nxMode="default" nxPlaceholder="Single select"></nx-select>
        <nx-select [nxOptions]="options" nxMode="multiple" nxPlaceholder="Multiple select"></nx-select>
        <nx-select [nxOptions]="options" nxMode="tags" nxPlaceholder="Tags mode"></nx-select>
      </div>
    `,
    props: {
      options: sampleOptions,
    },
  }),
};

export const InteractiveStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <nx-select [nxOptions]="options" nxPlaceholder="Normal state"></nx-select>
        <nx-select [nxOptions]="options" nxDisabled="true" nxPlaceholder="Disabled state"></nx-select>
        <nx-select [nxOptions]="options" nxLoading="true" nxPlaceholder="Loading state"></nx-select>
        <nx-select [nxOptions]="options" nxShowSearch="true" nxPlaceholder="With search"></nx-select>
      </div>
    `,
    props: {
      options: sampleOptions,
    },
  }),
};

export const FormIntegration: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <form style="display: flex; flex-direction: column; gap: 16px;">
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Single Select</label>
            <nx-select [nxOptions]="options" formControlName="singleSelect" nxPlaceholder="Choose option"></nx-select>
          </div>

          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Multiple Select</label>
            <nx-select [nxOptions]="options" formControlName="multipleSelect" nxMode="multiple" nxPlaceholder="Choose options"></nx-select>
          </div>

          <div>
            <button nx-button nxVariant="primary" type="button" (click)="submitForm()">Submit</button>
            <button nx-button nxVariant="secondary" type="button" (click)="resetForm()">Reset</button>
          </div>

          <div style="padding: 16px; background: #f5f5f5; border-radius: 4px;">
            <strong>Form Values:</strong><br>
            Single: {{ form.value.singleSelect || 'None' }}<br>
            Multiple: {{ form.value.multipleSelect?.join(', ') || 'None' }}
          </div>
        </form>
      </div>
    `,
    moduleMetadata: {
      imports: [FormsModule],
    },
    props: {
      options: sampleOptions,
      form: {
        singleSelect: null,
        multipleSelect: [],
      },
      submitForm: function() {
        console.log('Form submitted:', this.form);
      },
      resetForm: function() {
        this.form = { singleSelect: null, multipleSelect: [] };
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Select component integrated with Angular forms, demonstrating form control binding and validation.',
      },
    },
  },
};

export const Performance: Story = {
  args: {
    nxOptions: largeOptions,
    nxShowSearch: true,
    nxPlaceholder: 'Large dataset (50 options)',
  },
  parameters: {
    docs: {
      description: {
        story: 'Select component handling a large dataset with search functionality for testing performance.',
      },
    },
  },
};

export const Accessibility: Story = {
  render: () => ({
    template: `
      <div>
        <p style="margin-bottom: 16px;">
          <strong>Keyboard Navigation:</strong><br>
          • Tab to focus<br>
          • Enter/Space to open dropdown<br>
          • Arrow keys to navigate options<br>
          • Enter to select option<br>
          • Escape to close dropdown<br>
          • Type to search (if enabled)
        </p>
        <nx-select [nxOptions]="options" nxPlaceholder="Test keyboard navigation" nxShowSearch="true"></nx-select>
      </div>
    `,
    props: {
      options: sampleOptions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstration of keyboard navigation and accessibility features. Try navigating with keyboard only.',
      },
    },
  },
};