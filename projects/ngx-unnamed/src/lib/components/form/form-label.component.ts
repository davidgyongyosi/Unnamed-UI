import { Component, computed, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form.component';
import { FormLabelConfig, FormItemColSpan } from './form.types';

@Component({
  selector: 'nx-form-label',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label
      [class]="labelClasses()"
      [attr.for]="htmlFor()"
      [title]="title()"
    >
      {{ label() }}

      @if (required()) {
        <span class="nx-form-item-required">*</span>
      }

      @if (showColon()) {
        <span class="nx-form-item-colon">:</span>
      }
    </label>
  `,
  styleUrls: ['./style/form.component.scss'],
  host: {
    '[class.nx-form-item-label]': 'true'
  }
})
export class FormLabelComponent {
  /**
   * Label text content
   */
  label = input<string>('');

  /**
   * Whether the field is required (shows asterisk)
   */
  required = input<boolean>(false);

  /**
   * For attribute (associates with form control)
   */
  htmlFor = input<string>('');

  /**
   * Tooltip text
   */
  title = input<string>('');

  /**
   * Column span for responsive layout
   */
  span = input<FormItemColSpan>({});

  /**
   * Additional CSS class
   */
  className = input<string>('');

  private formComponent = inject(FormComponent, { optional: true });

  /**
   * Computed label classes
   */
  protected labelClasses = computed(() => {
    const customClass = this.className();
    const span = this.span();

    return [
      'nx-form-item-label',
      this.generateSpanClasses(span),
      {
        [customClass]: !!customClass
      }
    ];
  });

  /**
   * Whether to show colon after label
   */
  protected showColon = computed(() => {
    const formColon = this.formComponent?.colon();
    return formColon ?? false;
  });

  /**
   * Generate span classes based on breakpoint configuration
   */
  private generateSpanClasses(span: FormItemColSpan): string {
    const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
    const classes: string[] = [];

    // Add classes for each breakpoint
    (Object.keys(span) as Array<keyof typeof span>).forEach(bp => {
      if (span[bp]) {
        classes.push(`nx-col-${bp}-${span[bp]}`);
      }
    });

    // Default to span-4 (16.67%) for horizontal layout if no breakpoints specified
    if (classes.length === 0 && this.formComponent?.layout() === 'horizontal') {
      classes.push('nx-col-span-4');
    }
    // Default to full width for vertical layout
    else if (classes.length === 0) {
      classes.push('nx-col-span-24');
    }

    return classes.join(' ');
  }

  /**
   * Get current label text
   */
  getLabel(): string {
    return this.label();
  }

  /**
   * Get required state
   */
  isRequired(): boolean {
    return this.required();
  }
}