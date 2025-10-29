import { Component, computed, input, model, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormConfig, FormLayout, DEFAULT_FORM_CONFIG } from './form.types';

@Component({
  selector: 'nx-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <form
      [class]="formClasses()"
      [attr.novalidate]="noValidate()"
      (ngSubmit)="onSubmit($event)"
    >
      <ng-content></ng-content>
    </form>
  `,
  styleUrls: ['./style/form.component.scss'],
  host: {
    '[class.nx-form]': 'true',
    '[class.nx-form-horizontal]': 'layout() === "horizontal"',
    '[class.nx-form-vertical]': 'layout() === "vertical"',
    '[class.nx-form-inline]': 'layout() === "inline"'
  }
})
export class FormComponent {
  /**
   * Form layout mode
   */
  layout = input<FormLayout>('vertical');

  /**
   * Whether to show colon after label
   */
  colon = input<boolean>(false);

  /**
   * Whether to disable all form controls
   */
  disabled = input<boolean>(false);

  /**
   * Label width for horizontal layout
   */
  labelWidth = input<string>('120px');

  /**
   * Additional CSS class
   */
  className = input<string>('');

  /**
   * Form data model
   */
  data = model<any>(null);

  /**
   * Whether to add novalidate attribute
   */
  noValidate = input<boolean>(true);

  /**
   * Emitted when form is submitted
   */
  submitted = output<any>();

  /**
   * Emitted when form data changes
   */
  dataChange = output<any>();

  /**
   * Internal state for tracking form items
   */
  private formItems = signal<any[]>([]);

  /**
   * Computed form classes
   */
  protected formClasses = computed(() => {
    const layout = this.layout();
    const disabled = this.disabled();
    const customClass = this.className();

    return [
      'nx-form',
      `nx-form-${layout}`,
      {
        'nx-form-disabled': disabled,
        [customClass]: !!customClass
      }
    ];
  });

  /**
   * Register form item
   */
  registerFormItem(item: any): void {
    this.formItems.update(items => [...items, item]);
  }

  /**
   * Unregister form item
   */
  unregisterFormItem(item: any): void {
    this.formItems.update(items => items.filter(i => i !== item));
  }

  /**
   * Get all registered form items
   */
  getFormItems(): any[] {
    return this.formItems();
  }

  /**
   * Handle form submission
   */
  protected onSubmit(event: Event): void {
    event.preventDefault();

    const formData = this.extractFormData();
    this.data.set(formData);
    this.dataChange.emit(formData);
    this.submitted.emit(formData);
  }

  /**
   * Extract form data from registered form items
   */
  private extractFormData(): any {
    const formData: any = {};

    this.formItems().forEach(item => {
      if (item.name && item.value !== undefined) {
        formData[item.name] = item.value;
      }
    });

    return formData;
  }

  /**
   * Reset all form items
   */
  resetForm(): void {
    this.formItems().forEach(item => {
      if (item.reset) {
        item.reset();
      }
    });
    this.data.set(null);
  }

  /**
   * Validate all form items
   */
  validateForm(): boolean {
    let isValid = true;

    this.formItems().forEach(item => {
      if (item.validate) {
        const itemValid = item.validate();
        if (!itemValid) {
          isValid = false;
        }
      }
    });

    return isValid;
  }

  /**
   * Get form validation status
   */
  getValidationStatus(): 'valid' | 'invalid' | 'pending' {
    const items = this.formItems();

    // Check if any item is pending validation
    if (items.some(item => item.status === 'validating')) {
      return 'pending';
    }

    // Check if any item has errors
    if (items.some(item => item.status === 'error')) {
      return 'invalid';
    }

    // Check if all items are valid
    if (items.every(item => item.status === 'success' || item.status === 'default')) {
      return 'valid';
    }

    return 'pending';
  }

  /**
   * Get CSS variable for label width
   */
  protected get labelWidthCSSVar(): string {
    return `--nx-form-label-width: ${this.labelWidth()}`;
  }
}