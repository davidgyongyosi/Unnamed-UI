import { AbstractControl, FormControl, FormGroup, ValidationErrors } from '@angular/forms';

/**
 * Form layout modes
 */
export type FormLayout = 'horizontal' | 'vertical' | 'inline';

/**
 * Validation status types
 */
export type FormValidateStatus = 'success' | 'warning' | 'error' | 'validating' | 'default';

/**
 * Form item span configuration for responsive layout
 */
export interface FormItemColSpan {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
}

/**
 * Form component configuration
 */
export interface FormConfig {
  /**
   * Layout mode of the form
   * @default 'vertical'
   */
  layout?: FormLayout;

  /**
   * Whether to show colon after label
   * @default false
   */
  colon?: boolean;

  /**
   * Whether to disable all form controls
   * @default false
   */
  disabled?: boolean;

  /**
   * Label width in horizontal layout (px or %)
   * @default '120px'
   */
  labelWidth?: string;

  /**
   * CSS class name
   */
  className?: string;
}

/**
 * Form item configuration
 */
export interface FormItemConfig {
  /**
   * Form control name
   */
  for?: string;

  /**
   * Validation status
   */
  validateStatus?: FormValidateStatus;

  /**
   * Custom error message
   */
  errorTip?: string;

  /**
   * Help text below the control
   */
  extra?: string;

  /**
   * Whether the field is required
   */
  required?: boolean;

  /**
   * Whether the field has feedback
   */
  hasFeedback?: boolean;

  /**
   * Label column span for responsive layout
   */
  labelCol?: FormItemColSpan;

  /**
   * Control column span for responsive layout
   */
  controlCol?: FormItemColSpan;

  /**
   * CSS class name
   */
  className?: string;
}

/**
 * Form label configuration
 */
export interface FormLabelConfig {
  /**
   * Whether to show required asterisk
   */
  required?: boolean;

  /**
   * Label text
   */
  label?: string;

  /**
   * Column span for responsive layout
   */
  span?: FormItemColSpan;

  /**
   * CSS class name
   */
  className?: string;
}

/**
 * Form control configuration
 */
export interface FormControlConfig {
  /**
   * Validation status
   */
  validateStatus?: FormValidateStatus;

  /**
   * Whether to show feedback icon
   */
  hasFeedback?: boolean;

  /**
   * CSS class name
   */
  className?: string;
}

/**
 * Form validation error
 */
export interface FormValidationError {
  /**
   * Error key
   */
  key: string;

  /**
   * Error message
   */
  message: string;

  /**
   * Error parameters for interpolation
   */
  params?: Record<string, any>;
}

/**
 * Form validation utilities
 */
export class FormValidationUtils {
  /**
   * Get validation status from a form control
   */
  static getValidateStatus(control: AbstractControl): FormValidateStatus {
    if (control.pending) {
      return 'validating';
    }

    if (control.invalid && (control.dirty || control.touched)) {
      return 'error';
    }

    if (control.valid && (control.dirty || control.touched)) {
      return 'success';
    }

    return 'default';
  }

  /**
   * Get validation errors from a form control
   */
  static getValidationErrors(control: AbstractControl): FormValidationError[] {
    if (!control.errors) {
      return [];
    }

    return Object.entries(control.errors).map(([key, value]) => ({
      key,
      message: this.getErrorMessage(key, value),
      params: value as Record<string, any>
    }));
  }

  /**
   * Get error message for validation key
   */
  private static getErrorMessage(key: string, params?: any): string {
    const messages: Record<string, string> = {
      required: 'This field is required',
      email: 'Please enter a valid email address',
      min: 'Minimum value is {{min}}',
      max: 'Maximum value is {{max}}',
      minlength: 'Minimum length is {{requiredLength}}',
      maxlength: 'Maximum length is {{requiredLength}}',
      pattern: 'Please match the required format',
      unknown: 'Field validation failed'
    };

    return messages[key] || messages.unknown;
  }

  /**
   * Check if a control has a specific error
   */
  static hasError(control: AbstractControl, errorKey: string): boolean {
    return control.hasError(errorKey) && (control.dirty || control.touched);
  }

  /**
   * Get the first error message from a control
   */
  static getFirstErrorMessage(control: AbstractControl): string | null {
    const errors = this.getValidationErrors(control);
    return errors.length > 0 ? errors[0].message : null;
  }
}

/**
 * Default form configuration
 */
export const DEFAULT_FORM_CONFIG: Required<FormConfig> = {
  layout: 'vertical',
  colon: false,
  disabled: false,
  labelWidth: '120px',
  className: ''
};

/**
 * Default form item configuration
 */
export const DEFAULT_FORM_ITEM_CONFIG: Required<FormItemConfig> = {
  for: '',
  validateStatus: 'default',
  errorTip: '',
  extra: '',
  required: false,
  hasFeedback: false,
  labelCol: {},
  controlCol: {},
  className: ''
};

/**
 * Default form label configuration
 */
export const DEFAULT_FORM_LABEL_CONFIG: Required<FormLabelConfig> = {
  required: false,
  label: '',
  span: {},
  className: ''
};

/**
 * Default form control configuration
 */
export const DEFAULT_FORM_CONTROL_CONFIG: Required<FormControlConfig> = {
  validateStatus: 'default',
  hasFeedback: false,
  className: ''
};