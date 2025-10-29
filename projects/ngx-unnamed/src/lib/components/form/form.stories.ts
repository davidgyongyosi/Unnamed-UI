import type { Meta, StoryObj } from '@storybook/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './form.component';
import { FormItemComponent } from './form-item.component';
import { FormLabelComponent } from './form-label.component';
import { FormControlComponent } from './form-control.component';

const meta: Meta<FormComponent> = {
  title: 'Components/Form',
  component: FormComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Form components provide a flexible and accessible way to create forms with validation, different layout modes, and responsive design.'
      }
    }
  },
  argTypes: {
    layout: {
      control: 'select',
      options: ['vertical', 'horizontal', 'inline'],
      description: 'Form layout mode'
    },
    colon: {
      control: 'boolean',
      description: 'Whether to show colon after label'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether to disable all form controls'
    },
    labelWidth: {
      control: 'text',
      description: 'Label width for horizontal layout (px or %)'
    },
    className: {
      control: 'text',
      description: 'Additional CSS class'
    }
  }
};

export default meta;
type Story = StoryObj<FormComponent>;

// Basic vertical form
export const Vertical: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        FormsModule,
        ReactiveFormsModule,
        FormComponent,
        FormItemComponent,
        FormLabelComponent,
        FormControlComponent
      ]
    },
    template: `
      <nx-form layout="vertical" style="width: 400px;">
        <nx-form-item>
          <nx-form-label label="Name" required="true"></nx-form-label>
          <nx-form-control>
            <input type="text" placeholder="Enter your name" style="width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 6px;">
          </nx-form-control>
        </nx-form-item>

        <nx-form-item>
          <nx-form-label label="Email" required="true"></nx-form-label>
          <nx-form-control>
            <input type="email" placeholder="Enter your email" style="width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 6px;">
          </nx-form-control>
        </nx-form-item>

        <nx-form-item>
          <nx-form-label label="Message"></nx-form-label>
          <nx-form-control>
            <textarea placeholder="Enter your message" rows="4" style="width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 6px; resize: vertical;"></textarea>
          </nx-form-control>
        </nx-form-item>

        <nx-form-item>
          <nx-form-control>
            <button type="submit" style="padding: 8px 16px; background: #1890ff; color: white; border: none; border-radius: 6px; cursor: pointer;">Submit</button>
          </nx-form-control>
        </nx-form-item>
      </nx-form>
    `
  })
};

// Horizontal form layout
export const Horizontal: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        FormsModule,
        ReactiveFormsModule,
        FormComponent,
        FormItemComponent,
        FormLabelComponent,
        FormControlComponent
      ]
    },
    template: `
      <nx-form layout="horizontal" labelWidth="120px" style="width: 500px;">
        <nx-form-item>
          <nx-form-label label="Name" required="true"></nx-form-label>
          <nx-form-control>
            <input type="text" placeholder="Enter your name" style="width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 6px;">
          </nx-form-control>
        </nx-form-item>

        <nx-form-item>
          <nx-form-label label="Email" required="true"></nx-form-label>
          <nx-form-control>
            <input type="email" placeholder="Enter your email" style="width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 6px;">
          </nx-form-control>
        </nx-form-item>

        <nx-form-item>
          <nx-form-label label="Company"></nx-form-label>
          <nx-form-control>
            <input type="text" placeholder="Enter your company" style="width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 6px;">
          </nx-form-control>
        </nx-form-item>

        <nx-form-item>
          <nx-form-label label=""></nx-form-label>
          <nx-form-control>
            <button type="submit" style="padding: 8px 16px; background: #1890ff; color: white; border: none; border-radius: 6px; cursor: pointer;">Submit</button>
          </nx-form-control>
        </nx-form-item>
      </nx-form>
    `
  })
};

// Inline form layout
export const Inline: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        FormsModule,
        ReactiveFormsModule,
        FormComponent,
        FormItemComponent,
        FormLabelComponent,
        FormControlComponent
      ]
    },
    template: `
      <nx-form layout="inline" style="max-width: 800px;">
        <nx-form-item>
          <nx-form-label label="Search"></nx-form-label>
          <nx-form-control>
            <input type="text" placeholder="Search..." style="padding: 8px; border: 1px solid #d9d9d9; border-radius: 6px;">
          </nx-form-control>
        </nx-form-item>

        <nx-form-item>
          <nx-form-label label="Category"></nx-form-label>
          <nx-form-control>
            <select style="padding: 8px; border: 1px solid #d9d9d9; border-radius: 6px;">
              <option>All</option>
              <option>Products</option>
              <option>Services</option>
            </select>
          </nx-form-control>
        </nx-form-item>

        <nx-form-item>
          <nx-form-control>
            <button type="submit" style="padding: 8px 16px; background: #1890ff; color: white; border: none; border-radius: 6px; cursor: pointer;">Search</button>
          </nx-form-control>
        </nx-form-item>
      </nx-form>
    `
  })
};

// Form with validation states
export const ValidationStates: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        FormsModule,
        ReactiveFormsModule,
        FormComponent,
        FormItemComponent,
        FormLabelComponent,
        FormControlComponent
      ]
    },
    template: `
      <nx-form layout="vertical" style="width: 400px;">
        <nx-form-item validateStatus="success" hasFeedback="true">
          <nx-form-label label="Username" required="true"></nx-form-label>
          <nx-form-control>
            <input type="text" value="john_doe" style="width: 100%; padding: 8px; border: 1px solid #52c41a; border-radius: 6px;">
          </nx-form-control>
        </nx-form-item>

        <nx-form-item validateStatus="error" errorTip="Please enter a valid email address" hasFeedback="true">
          <nx-form-label label="Email" required="true"></nx-form-label>
          <nx-form-control>
            <input type="email" value="invalid-email" style="width: 100%; padding: 8px; border: 1px solid #ff4d4f; border-radius: 6px;">
          </nx-form-control>
        </nx-form-item>

        <nx-form-item validateStatus="warning" hasFeedback="true">
          <nx-form-label label="Password"></nx-form-label>
          <nx-form-control>
            <input type="password" value="123" style="width: 100%; padding: 8px; border: 1px solid #faad14; border-radius: 6px;">
          </nx-form-control>
          <div class="nx-form-item-extra">Password should be at least 8 characters</div>
        </nx-form-item>

        <nx-form-item validateStatus="validating" hasFeedback="true">
          <nx-form-label label="Phone"></nx-form-label>
          <nx-form-control>
            <input type="tel" placeholder="Validating..." style="width: 100%; padding: 8px; border: 1px solid #1890ff; border-radius: 6px;">
          </nx-form-control>
        </nx-form-item>
      </nx-form>
    `
  })
};

// Form with required fields and help text
export const RequiredAndHelp: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        FormsModule,
        ReactiveFormsModule,
        FormComponent,
        FormItemComponent,
        FormLabelComponent,
        FormControlComponent
      ]
    },
    template: `
      <nx-form layout="vertical" colon="true" style="width: 400px;">
        <nx-form-item required="true">
          <nx-form-label label="Full Name"></nx-form-label>
          <nx-form-control>
            <input type="text" placeholder="Enter your full name" style="width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 6px;">
          </nx-form-control>
          <div class="nx-form-item-extra">Please enter your legal name as it appears on official documents</div>
        </nx-form-item>

        <nx-form-item required="true">
          <nx-form-label label="Email Address"></nx-form-label>
          <nx-form-control>
            <input type="email" placeholder="you@example.com" style="width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 6px;">
          </nx-form-control>
          <div class="nx-form-item-extra">We'll use this to contact you about your account</div>
        </nx-form-item>

        <nx-form-item required="true">
          <nx-form-label label="Password"></nx-form-label>
          <nx-form-control>
            <input type="password" placeholder="Create a strong password" style="width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 6px;">
          </nx-form-control>
          <div class="nx-form-item-extra">Must be at least 8 characters with uppercase, lowercase, and numbers</div>
        </nx-form-item>

        <nx-form-item>
          <nx-form-label label="Company (Optional)"></nx-form-label>
          <nx-form-control>
            <input type="text" placeholder="Your company name" style="width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 6px;">
          </nx-form-control>
        </nx-form-item>
      </nx-form>
    `
  })
};

// Responsive form layout
export const Responsive: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        FormsModule,
        ReactiveFormsModule,
        FormComponent,
        FormItemComponent,
        FormLabelComponent,
        FormControlComponent
      ]
    },
    template: `
      <nx-form layout="horizontal" style="width: 100%; max-width: 600px;">
        <nx-form-item labelCol="{ xs: 24, sm: 8 }" controlCol="{ xs: 24, sm: 16 }">
          <nx-form-label label="First Name" required="true"></nx-form-label>
          <nx-form-control>
            <input type="text" placeholder="First name" style="width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 6px;">
          </nx-form-control>
        </nx-form-item>

        <nx-form-item labelCol="{ xs: 24, sm: 8 }" controlCol="{ xs: 24, sm: 16 }">
          <nx-form-label label="Last Name" required="true"></nx-form-label>
          <nx-form-control>
            <input type="text" placeholder="Last name" style="width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 6px;">
          </nx-form-control>
        </nx-form-item>

        <nx-form-item labelCol="{ xs: 24, sm: 8 }" controlCol="{ xs: 24, sm: 16 }">
          <nx-form-label label="Email" required="true"></nx-form-label>
          <nx-form-control>
            <input type="email" placeholder="Email address" style="width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 6px;">
          </nx-form-control>
        </nx-form-item>

        <nx-form-item labelCol="{ xs: 24, sm: 8 }" controlCol="{ xs: 24, sm: 16 }">
          <nx-form-label label="Bio"></nx-form-label>
          <nx-form-control>
            <textarea placeholder="Tell us about yourself" rows="4" style="width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 6px; resize: vertical;"></textarea>
          </nx-form-control>
        </nx-form-item>
      </nx-form>
    `
  }),
  parameters: {
    viewport: {
      defaultViewport: 'responsive'
    }
  }
};

// Compact form variant
export const Compact: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        FormsModule,
        ReactiveFormsModule,
        FormComponent,
        FormItemComponent,
        FormLabelComponent,
        FormControlComponent
      ]
    },
    template: `
      <nx-form layout="vertical" className="nx-form-compact" style="width: 400px;">
        <nx-form-item>
          <nx-form-label label="Username" required="true"></nx-form-label>
          <nx-form-control>
            <input type="text" placeholder="Enter username" style="width: 100%; padding: 4px 8px; border: 1px solid #d9d9d9; border-radius: 6px;">
          </nx-form-control>
        </nx-form-item>

        <nx-form-item>
          <nx-form-label label="Password" required="true"></nx-form-label>
          <nx-form-control>
            <input type="password" placeholder="Enter password" style="width: 100%; padding: 4px 8px; border: 1px solid #d9d9d9; border-radius: 6px;">
          </nx-form-control>
        </nx-form-item>

        <nx-form-item>
          <nx-form-control>
            <button type="submit" style="padding: 4px 12px; background: #1890ff; color: white; border: none; border-radius: 6px; cursor: pointer;">Sign In</button>
          </nx-form-control>
        </nx-form-item>
      </nx-form>
    `
  })
};

// Large form variant
export const Large: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        FormsModule,
        ReactiveFormsModule,
        FormComponent,
        FormItemComponent,
        FormLabelComponent,
        FormControlComponent
      ]
    },
    template: `
      <nx-form layout="vertical" className="nx-form-large" style="width: 500px;">
        <nx-form-item>
          <nx-form-label label="Event Title" required="true"></nx-form-label>
          <nx-form-control>
            <input type="text" placeholder="Enter event title" style="width: 100%; padding: 12px 16px; border: 1px solid #d9d9d9; border-radius: 6px; font-size: 16px;">
          </nx-form-control>
        </nx-form-item>

        <nx-form-item>
          <nx-form-label label="Description" required="true"></nx-form-label>
          <nx-form-control>
            <textarea placeholder="Describe your event" rows="6" style="width: 100%; padding: 12px 16px; border: 1px solid #d9d9d9; border-radius: 6px; font-size: 16px; resize: vertical;"></textarea>
          </nx-form-control>
        </nx-form-item>

        <nx-form-item>
          <nx-form-label label="Organizer"></nx-form-label>
          <nx-form-control>
            <input type="text" placeholder="Event organizer" style="width: 100%; padding: 12px 16px; border: 1px solid #d9d9d9; border-radius: 6px; font-size: 16px;">
          </nx-form-control>
        </nx-form-item>

        <nx-form-item>
          <nx-form-control>
            <button type="submit" style="padding: 12px 24px; background: #1890ff; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;">Create Event</button>
          </nx-form-control>
        </nx-form-item>
      </nx-form>
    `
  })
};

// Disabled form
export const Disabled: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        FormsModule,
        ReactiveFormsModule,
        FormComponent,
        FormItemComponent,
        FormLabelComponent,
        FormControlComponent
      ]
    },
    template: `
      <nx-form layout="vertical" disabled="true" style="width: 400px;">
        <nx-form-item>
          <nx-form-label label="Name" required="true"></nx-form-label>
          <nx-form-control>
            <input type="text" value="John Doe" disabled style="width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 6px; background: #f5f5f5;">
          </nx-form-control>
        </nx-form-item>

        <nx-form-item>
          <nx-form-label label="Email" required="true"></nx-form-label>
          <nx-form-control>
            <input type="email" value="john@example.com" disabled style="width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 6px; background: #f5f5f5;">
          </nx-form-control>
        </nx-form-item>

        <nx-form-item>
          <nx-form-label label="Status"></nx-form-label>
          <nx-form-control>
            <select disabled style="width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 6px; background: #f5f5f5;">
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </nx-form-control>
        </nx-form-item>

        <nx-form-item>
          <nx-form-control>
            <button type="submit" disabled style="padding: 8px 16px; background: #d9d9d9; color: white; border: none; border-radius: 6px; cursor: not-allowed;">Save Changes</button>
          </nx-form-control>
        </nx-form-item>
      </nx-form>
    `
  })
};

// Complex form example
export const ComplexForm: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        FormsModule,
        ReactiveFormsModule,
        FormComponent,
        FormItemComponent,
        FormLabelComponent,
        FormControlComponent
      ]
    },
    template: `
      <div style="max-width: 800px; margin: 0 auto;">
        <h2 style="margin-bottom: 24px;">User Registration</h2>

        <nx-form layout="horizontal" labelWidth="120px">
          <nx-form-item>
            <nx-form-label label="Account Type" required="true"></nx-form-label>
            <nx-form-control>
              <select style="width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 6px;">
                <option>Personal</option>
                <option>Business</option>
                <option>Enterprise</option>
              </select>
            </nx-form-control>
          </nx-form-item>

          <nx-form-item>
            <nx-form-label label=""></nx-form-label>
            <nx-form-control>
              <hr style="margin: 16px 0; border: none; border-top: 1px solid #f0f0f0;">
            </nx-form-control>
          </nx-form-item>

          <nx-form-item>
            <nx-form-label label="First Name" required="true"></nx-form-label>
            <nx-form-control>
              <input type="text" placeholder="Enter first name" style="width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 6px;">
            </nx-form-control>
          </nx-form-item>

          <nx-form-item>
            <nx-form-label label="Last Name" required="true"></nx-form-label>
            <nx-form-control>
              <input type="text" placeholder="Enter last name" style="width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 6px;">
            </nx-form-control>
          </nx-form-item>

          <nx-form-item validateStatus="success" hasFeedback="true">
            <nx-form-label label="Email" required="true"></nx-form-label>
            <nx-form-control>
              <input type="email" value="user@example.com" style="width: 100%; padding: 8px; border: 1px solid #52c41a; border-radius: 6px;">
            </nx-form-control>
          </nx-form-item>

          <nx-form-item validateStatus="error" errorTip="Password is too short" hasFeedback="true">
            <nx-form-label label="Password" required="true"></nx-form-label>
            <nx-form-control>
              <input type="password" value="123" style="width: 100%; padding: 8px; border: 1px solid #ff4d4f; border-radius: 6px;">
            </nx-form-control>
            <div class="nx-form-item-extra">Password must be at least 8 characters long</div>
          </nx-form-item>

          <nx-form-item>
            <nx-form-label label=""></nx-form-label>
            <nx-form-control>
              <hr style="margin: 16px 0; border: none; border-top: 1px solid #f0f0f0;">
            </nx-form-control>
          </nx-form-item>

          <nx-form-item>
            <nx-form-label label="Phone"></nx-form-label>
            <nx-form-control>
              <input type="tel" placeholder="+1 (555) 000-0000" style="width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 6px;">
            </nx-form-control>
          </nx-form-item>

          <nx-form-item>
            <nx-form-label label="Company"></nx-form-label>
            <nx-form-control>
              <input type="text" placeholder="Company name" style="width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 6px;">
            </nx-form-control>
          </nx-form-item>

          <nx-form-item>
            <nx-form-label label="Country"></nx-form-label>
            <nx-form-control>
              <select style="width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 6px;">
                <option>United States</option>
                <option>Canada</option>
                <option>United Kingdom</option>
                <option>Australia</option>
              </select>
            </nx-form-control>
          </nx-form-item>

          <nx-form-item>
            <nx-form-label label=""></nx-form-label>
            <nx-form-control>
              <div style="margin-top: 24px;">
                <button type="submit" style="padding: 8px 16px; background: #1890ff; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 8px;">Register</button>
                <button type="button" style="padding: 8px 16px; background: white; color: #1890ff; border: 1px solid #1890ff; border-radius: 6px; cursor: pointer;">Cancel</button>
              </div>
            </nx-form-control>
          </nx-form-item>
        </nx-form>
      </div>
    `
  })
};