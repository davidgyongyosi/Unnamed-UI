import { Component, computed, input, output, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';
import { FormComponent } from './form.component';
import { FormItemConfig, FormValidateStatus, FormItemColSpan, DEFAULT_FORM_ITEM_CONFIG } from './form.types';

@Component({
  selector: 'nx-form-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [class]="formItemClasses()"
      [attr.for]="for()"
    >
      <ng-content select="nx-form-label"></ng-content>

      <div class="nx-form-item-control" [class]="getControlClasses()">
        <ng-content></ng-content>

        @if (showError()) {
          <div class="nx-form-item-explain-error">
            @if (customErrorTip()) {
              {{ customErrorTip() }}
            } @else {
              @for (error of errors(); track error.key) {
                <div>{{ error.message }}</div>
              }
            }
          </div>
        }

        @if (extra()) {
          <div class="nx-form-item-extra">{{ computedExtra() }}</div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./style/form.component.scss'],
  host: {
    '[class.nx-form-item]': 'true',
    '[class.nx-form-item-has-error]': 'validateStatus() === "error"',
    '[class.nx-form-item-has-warning]': 'validateStatus() === "warning"',
    '[class.nx-form-item-has-success]': 'validateStatus() === "success"',
    '[class.nx-form-item-is-validating]': 'validateStatus() === "validating"',
    '[class.nx-form-item-has-feedback]': 'hasFeedback()'
  }
})
export class FormItemComponent implements OnInit, OnDestroy {
  /**
   * Form control name for association
   */
  for = input<string>('');

  /**
   * Validation status
   */
  validateStatus = input<FormValidateStatus>('default');

  /**
   * Custom error message
   */
  errorTip = input<string>('');

  /**
   * Help text displayed below control
   */
  extra = input<string>('');

  /**
   * Whether the field is required
   */
  required = input<boolean>(false);

  /**
   * Whether to show feedback icon
   */
  hasFeedback = input<boolean>(false);

  /**
   * Label column span for responsive layout
   */
  labelCol = input<FormItemColSpan>({});

  /**
   * Control column span for responsive layout
   */
  controlCol = input<FormItemColSpan>({});

  /**
   * Abstract control for reactive forms integration
   */
  control = input<AbstractControl | null>(null);

  /**
   * Additional CSS class
   */
  className = input<string>('');

  /**
   * Emitted when validation status changes
   */
  validateStatusChange = output<FormValidateStatus>();

  private formComponent = inject(FormComponent, { optional: true });

  /**
   * Computed form item classes
   */
  protected formItemClasses = computed(() => {
    const status = this.validateStatus();
    const hasFeedback = this.hasFeedback();
    const required = this.required();
    const customClass = this.className();

    return [
      'nx-form-item',
      {
        'nx-form-item-has-error': status === 'error',
        'nx-form-item-has-warning': status === 'warning',
        'nx-form-item-has-success': status === 'success',
        'nx-form-item-is-validating': status === 'validating',
        'nx-form-item-has-feedback': hasFeedback,
        'nx-form-item-required': required,
        [customClass]: !!customClass
      }
    ];
  });

  /**
   * Computed errors from control or custom error tip
   */
  protected errors = computed(() => {
    const control = this.control();
    const customError = this.errorTip();

    if (customError) {
      return [{ key: 'custom', message: customError }];
    }

    if (control && control.errors && (control.dirty || control.touched)) {
      return Object.entries(control.errors).map(([key, value]) => ({
        key,
        message: this.getErrorMessage(key, value),
        params: value
      }));
    }

    return [];
  });

  /**
   * Whether to show error state
   */
  protected showError = computed(() => {
    const status = this.validateStatus();
    const control = this.control();
    const hasErrors = this.errors().length > 0;

    return status === 'error' || (hasErrors && control && (control.dirty || control.touched));
  });

  /**
   * Custom error tip
   */
  protected customErrorTip = computed(() => {
    return this.errorTip() || '';
  });

  /**
   * Computed extra help text
   */
  protected computedExtra = computed(() => {
    return this.extra();
  });

  /**
   * Get control column classes for responsive layout
   */
  protected getControlClasses(): string {
    const controlCol = this.controlCol();
    const controlClasses = this.generateColClasses(controlCol);

    return controlClasses;
  }

  /**
   * Generate column span classes
   */
  private generateColClasses(col: FormItemColSpan, prefix?: 'label' | 'control'): string {
    const classes: string[] = [];

    (Object.keys(col) as (keyof typeof col)[]).forEach(bp => {
      if (col[bp]) {
        classes.push(`nx-col-${bp}-${col[bp]}`);
      }
    });

    // Default to appropriate spans if no breakpoint specified
    if (classes.length === 0) {
      if (prefix === 'label') {
        classes.push('nx-col-span-4'); // Default label span
      } else if (prefix === 'control') {
        classes.push('nx-col-span-20'); // Default control span (24 - 4)
      } else {
        classes.push('nx-col-span-24'); // Default to full width
      }
    }

    return classes.join(' ');
  }

  /**
   * Get error message for validation key
   */
  private getErrorMessage(key: string, params?: any): string {
    const messages: Record<string, string> = {
      required: 'This field is required',
      email: 'Please enter a valid email address',
      min: `Minimum value is ${params?.min}`,
      max: `Maximum value is ${params?.max}`,
      minlength: `Minimum length is ${params?.requiredLength}`,
      maxlength: `Maximum length is ${params?.requiredLength}`,
      pattern: 'Please match the required format',
      unknown: 'Field validation failed'
    };

    return messages[key] || messages.unknown;
  }

  
  /**
   * Get current validation status
   */
  getValidateStatus(): FormValidateStatus {
    return this.validateStatus();
  }

  /**
   * Check if field has errors
   */
  hasErrors(): boolean {
    return this.showError() ?? false;
  }

  /**
   * Reset form item state
   */
  reset(): void {
    const control = this.control();
    if (control) {
      control.reset();
    }
  }

  /**
   * Validate form item
   */
  validate(): boolean {
    const control = this.control();
    if (control) {
      control.markAsDirty();
      control.markAsTouched();
      control.updateValueAndValidity();
      return control.valid;
    }

    return true;
  }

  /**
   * Component lifecycle: register with form component
   */
  ngOnInit(): void {
    if (this.formComponent) {
      this.formComponent.registerFormItem({
        name: this.for(),
        value: this.control?.()?.value,
        status: this.getValidateStatus(),
        validate: () => this.validate(),
        reset: () => this.reset()
      });
    }

    // Watch control changes and update status
    const control = this.control();
    if (control) {
      control.statusChanges.subscribe(() => {
        this.updateStatusFromControl();
      });
      control.valueChanges.subscribe(() => {
        this.updateStatusFromControl();
      });
    }
  }

  /**
   * Component lifecycle: unregister from form component
   */
  ngOnDestroy(): void {
    if (this.formComponent) {
      this.formComponent.unregisterFormItem({
        name: this.for(),
        value: this.control?.()?.value,
        status: this.getValidateStatus(),
        validate: () => this.validate(),
        reset: () => this.reset()
      });
    }
  }

  /**
   * Update validation status based on control state
   */
  private updateStatusFromControl(): void {
    const control = this.control();
    if (!control) return;

    // Status is handled by the computed validateStatus property
    // No need to manually set it
  }
}