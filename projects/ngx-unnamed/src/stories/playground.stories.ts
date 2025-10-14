import type { Meta, StoryObj } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../lib/components/button/button.component';
import { InputDirective } from '../lib/components/input/input.directive';
import { NxIconDirective } from '../lib/components/icon/icon.directive';

const meta: Meta = {
  title: 'Playground/Interactive Examples',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Interactive playground examples demonstrating component integration and real-world usage patterns.',
      },
    },
  },
  };

export default meta;
type Story = StoryObj;

export const InteractiveForm: Story = {
  render: () => ({
    imports: [CommonModule, FormsModule],
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px; padding: 20px;">
        <h3>Interactive Form</h3>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          <label for="username">Username</label>
          <input nx-input id="username" placeholder="Enter username" [(ngModel)]="username">
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          <label for="email">Email</label>
          <input nx-input id="email" type="email" placeholder="Enter email" [(ngModel)]="email">
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          <label for="password">Password</label>
          <input nx-input id="password" type="password" placeholder="Enter password" [(ngModel)]="password">
        </div>

        <div style="display: flex; gap: 8px; margin-top: 16px;">
          <button nx-button nxVariant="primary" (click)="submitForm()">Submit</button>
          <button nx-button nxVariant="outline" (click)="resetForm()">Reset</button>
        </div>

        <div *ngIf="submittedData" style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px;">
          <strong>Form Data:</strong>
          <pre>{{ submittedData | json }}</pre>
        </div>
      </div>
    `,
    props: {
      username: '',
      email: '',
      password: '',
      submittedData: null,
      submitForm() {
        this.submittedData = {
          username: this.username,
          email: this.email,
          password: '••••••••'
        };
      },
      resetForm() {
        this.username = '';
        this.email = '';
        this.password = '';
        this.submittedData = null;
      }
    }
  }),
};

export const ComponentShowcase: Story = {
  render: () => ({
    imports: [CommonModule, FormsModule],
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; padding: 20px; max-width: 600px;">
        <h3>Component Showcase</h3>

        <!-- Button Showcase -->
        <div>
          <h4>Buttons</h4>
          <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px;">
            <button nx-button [nxVariant]="buttonVariant" [nxSize]="buttonSize" [disabled]="buttonDisabled" [nxLoading]="buttonLoading">
              <span nxIcon type="user" theme="outline"></span>
              {{ buttonText }}
            </button>
            <button nx-button nxVariant="secondary" (click)="randomizeButton()">Randomize</button>
          </div>

          <div style="display: flex; gap: 12px; align-items: center;">
            <label>Variant:</label>
            <select [(ngModel)]="buttonVariant" style="padding: 4px;">
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="danger">Danger</option>
              <option value="outline">Outline</option>
              <option value="ghost">Ghost</option>
            </select>

            <label>Size:</label>
            <select [(ngModel)]="buttonSize" style="padding: 4px;">
              <option value="small">Small</option>
              <option value="default">Default</option>
              <option value="large">Large</option>
            </select>

            <label><input type="checkbox" [(ngModel)]="buttonDisabled"> Disabled</label>
            <label><input type="checkbox" [(ngModel)]="buttonLoading"> Loading</label>
          </div>

          <div style="margin-top: 8px;">
            <input nx-input placeholder="Button text" [(ngModel)]="buttonText" style="max-width: 200px;">
          </div>
        </div>

        <!-- Input Showcase -->
        <div>
          <h4>Inputs</h4>
          <div style="display: flex; gap: 12px; margin-bottom: 16px;">
            <input nx-input [placeholder]="inputPlaceholder" [nxSize]="inputSize" [disabled]="inputDisabled" [nxStatus]="inputStatus" [(ngModel)]="inputValue">
            <button nx-button nxVariant="outline" (click)="clearInput()">Clear</button>
          </div>

          <div style="display: flex; gap: 12px; align-items: center;">
            <label>Size:</label>
            <select [(ngModel)]="inputSize" style="padding: 4px;">
              <option value="small">Small</option>
              <option value="default">Default</option>
              <option value="large">Large</option>
            </select>

            <label>Status:</label>
            <select [(ngModel)]="inputStatus" style="padding: 4px;">
              <option value="default">Default</option>
              <option value="error">Error</option>
              <option value="warning">Warning</option>
            </select>

            <label><input type="checkbox" [(ngModel)]="inputDisabled"> Disabled</label>
          </div>

          <div style="margin-top: 8px;">
            <input nx-input placeholder="Placeholder text" [(ngModel)]="inputPlaceholder" style="max-width: 200px;">
          </div>
        </div>

        <!-- Icon Showcase -->
        <div>
          <h4>Icons</h4>
          <div style="display: flex; gap: 16px; align-items: center; margin-bottom: 16px;">
            <span nxIcon [type]="selectedIcon" [theme]="iconTheme" [spin]="iconSpin" [size]="iconSize"></span>
            <span>{{ selectedIcon }} ({{ iconTheme }})</span>
          </div>

          <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
            <label>Icon:</label>
            <select [(ngModel)]="selectedIcon" style="padding: 4px;">
              <option value="user">User</option>
              <option value="setting">Settings</option>
              <option value="heart">Heart</option>
              <option value="star">Star</option>
              <option value="check">Check</option>
              <option value="close">Close</option>
              <option value="loading">Loading</option>
            </select>

            <label>Theme:</label>
            <select [(ngModel)]="iconTheme" style="padding: 4px;">
              <option value="outline">Outline</option>
              <option value="fill">Fill</option>
              <option value="twotone">Twotone</option>
            </select>

            <label>Size:</label>
            <input type="number" [(ngModel)]="iconSize" min="12" max="48" style="width: 60px; padding: 4px;">

            <label><input type="checkbox" [(ngModel)]="iconSpin"> Spin</label>
          </div>
        </div>
      </div>
    `,
    props: {
      // Button props
      buttonText: 'Click Me',
      buttonVariant: 'primary',
      buttonSize: 'default',
      buttonDisabled: false,
      buttonLoading: false,

      // Input props
      inputValue: '',
      inputPlaceholder: 'Type something...',
      inputSize: 'default',
      inputStatus: 'default',
      inputDisabled: false,

      // Icon props
      selectedIcon: 'user',
      iconTheme: 'outline',
      iconSize: 24,
      iconSpin: false,

      // Methods
      randomizeButton() {
        const variants = ['primary', 'secondary', 'danger', 'outline', 'ghost'];
        const sizes = ['small', 'default', 'large'];
        const texts = ['Click Me', 'Submit', 'Save', 'Cancel', 'Delete'];

        this.buttonVariant = variants[Math.floor(Math.random() * variants.length)];
        this.buttonSize = sizes[Math.floor(Math.random() * sizes.length)];
        this.buttonText = texts[Math.floor(Math.random() * texts.length)];
        this.buttonDisabled = Math.random() > 0.5;
        this.buttonLoading = Math.random() > 0.7;
      },

      clearInput() {
        this.inputValue = '';
      }
    }
  }),
};

export const ShowCode: Story = {
  render: () => ({
    template: `
      <div style="padding: 20px; max-width: 600px;">
        <h3>Show Code Example</h3>
        <p>Click the "Show code" button in Storybook to see the source code for these examples.</p>

        <div style="margin: 20px 0;">
          <h4>Basic Usage</h4>
          <button nx-button>Primary Button</button>
          <button nx-button nxVariant="secondary">Secondary Button</button>
        </div>

        <div style="margin: 20px 0;">
          <h4>With Icons</h4>
          <button nx-button>
            <span nxIcon type="user" theme="outline"></span>
            User Profile
          </button>
          <button nx-button nxVariant="danger">
            <span nxIcon type="delete" theme="outline"></span>
            Delete
          </button>
        </div>

        <div style="margin: 20px 0;">
          <h4>Form Elements</h4>
          <input nx-input placeholder="Enter text here">
          <button nx-button nxVariant="outline" style="margin-left: 8px;">Submit</button>
        </div>
      </div>
    `
  }),
};