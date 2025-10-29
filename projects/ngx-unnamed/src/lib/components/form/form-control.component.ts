import { Component, computed, input, output, contentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';
import { FormControlConfig, FormValidateStatus, DEFAULT_FORM_CONTROL_CONFIG } from './form.types';

@Component({
  selector: 'nx-form-control',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [class]="formControlClasses()"
      [attr.data-status]="computedValidateStatus()"
    >
      <ng-content></ng-content>

      @if (showFeedbackIcon()) {
        <span class="nx-form-control-feedback-icon">
          @switch (computedValidateStatus()) {
            @case ('success') {
              <span class="nx-icon nx-icon-check-circle-fill" aria-hidden="true"></span>
            }
            @case ('warning') {
              <span class="nx-icon nx-icon-exclamation-circle-fill" aria-hidden="true"></span>
            }
            @case ('error') {
              <span class="nx-icon nx-icon-close-circle-fill" aria-hidden="true"></span>
            }
            @case ('validating') {
              <span class="nx-icon nx-icon-loading" aria-hidden="true"></span>
            }
          }
        </span>
      }
    </div>
  `,
  styleUrls: ['./style/form.component.scss'],
  host: {
    '[class.nx-form-control]': 'true',
    '[class.nx-form-control-has-feedback]': 'hasFeedback()',
    '[class.nx-form-control-success]': 'computedValidateStatus() === "success"',
    '[class.nx-form-control-warning]': 'computedValidateStatus() === "warning"',
    '[class.nx-form-control-error]': 'computedValidateStatus() === "error"',
    '[class.nx-form-control-validating]': 'computedValidateStatus() === "validating"'
  }
})
export class FormControlComponent {
  /**
   * Abstract control for reactive forms integration
   */
  control = input<AbstractControl | null>(null);

  /**
   * Validation status
   */
  validateStatus = input<FormValidateStatus>('default');

  /**
   * Whether to show feedback icon
   */
  hasFeedback = input<boolean>(false);

  /**
   * Whether to automatically detect status from control
   */
  autoDetect = input<boolean>(true);

  /**
   * Additional CSS class
   */
  className = input<string>('');

  /**
   * Emitted when validation status changes
   */
  statusChange = output<FormValidateStatus>();

  /**
   * Content child for getting the actual form control element
   */
  readonly controlElement = contentChild('input, select, textarea');

  /**
   * Computed validation status
   */
  protected computedValidateStatus = computed(() => {
    const status = this.validateStatus();
    const control = this.control();
    const autoDetect = this.autoDetect();

    if (autoDetect && control) {
      if (control.pending) {
        return 'validating';
      }

      if (control.invalid && (control.dirty || control.touched)) {
        return 'error';
      }

      if (control.valid && (control.dirty || control.touched)) {
        return 'success';
      }
    }

    return status;
  });

  /**
   * Computed form control classes
   */
  protected formControlClasses = computed(() => {
    const status = this.computedValidateStatus();
    const hasFeedback = this.hasFeedback();
    const customClass = this.className();

    return [
      'nx-form-control',
      {
        'nx-form-control-has-feedback': hasFeedback,
        'nx-form-control-success': status === 'success',
        'nx-form-control-warning': status === 'warning',
        'nx-form-control-error': status === 'error',
        'nx-form-control-validating': status === 'validating',
        [customClass]: !!customClass
      }
    ];
  });

  /**
   * Whether to show feedback icon
   */
  protected showFeedbackIcon = computed(() => {
    const hasFeedback = this.hasFeedback();
    const status = this.computedValidateStatus();

    return hasFeedback && status !== 'default';
  });

  /**
   * Get current validation status
   */
  getValidateStatus(): FormValidateStatus {
    return this.computedValidateStatus();
  }

  /**
   * Focus the contained form control
   */
  focus(): void {
    const element = this.controlElement() as any;
    if (element?.nativeElement && element.nativeElement.focus) {
      element.nativeElement.focus();
    }
  }

  /**
   * Blur the contained form control
   */
  blur(): void {
    const element = this.controlElement() as any;
    if (element?.nativeElement && element.nativeElement.blur) {
      element.nativeElement.blur();
    }
  }

  /**
   * Check if control has errors
   */
  hasErrors(): boolean {
    const control = this.control();
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  /**
   * Get validation errors
   */
  getErrors(): any {
    const control = this.control();
    return control ? control.errors : null;
  }

  /**
   * Set control value
   */
  setValue(value: any): void {
    const control = this.control();
    if (control) {
      control.setValue(value);
    }
  }

  /**
   * Get control value
   */
  getValue(): any {
    const control = this.control();
    return control ? control.value : null;
  }

  /**
   * Reset control
   */
  reset(): void {
    const control = this.control();
    if (control) {
      control.reset();
    }
  }

  /**
   * Validate control
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
   * Check if control is dirty
   */
  isDirty(): boolean {
    const control = this.control();
    return control ? control.dirty : false;
  }

  /**
   * Check if control is touched
   */
  isTouched(): boolean {
    const control = this.control();
    return control ? control.touched : false;
  }

  /**
   * Check if control is pending
   */
  isPending(): boolean {
    const control = this.control();
    return control ? control.pending : false;
  }

  /**
   * Enable control
   */
  enable(): void {
    const control = this.control();
    if (control) {
      control.enable();
    }
  }

  /**
   * Disable control
   */
  disable(): void {
    const control = this.control();
    if (control) {
      control.disable();
    }
  }

  /**
   * Check if control is enabled
   */
  isEnabled(): boolean {
    const control = this.control();
    return control ? control.enabled : true;
  }
}