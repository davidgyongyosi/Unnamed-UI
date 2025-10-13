import { ControlValueAccessor } from '@angular/forms';

/**
 * Abstract base class for implementing ControlValueAccessor.
 * Provides standard implementation of the CVA interface with helper methods.
 *
 * @template T The type of value this accessor manages
 *
 * @example
 * ```typescript
 * export class CustomInputComponent extends ControlValueAccessorBase<string> {
 *   onInput(event: Event): void {
 *     const value = (event.target as HTMLInputElement).value;
 *     this.emitChange(value);
 *   }
 *
 *   onBlur(): void {
 *     this.markAsTouched();
 *   }
 * }
 * ```
 */
export abstract class ControlValueAccessorBase<T> implements ControlValueAccessor {
    /**
     * The current value of the control
     */
    protected value: T | null = null;

    /**
     * Whether the control is disabled
     */
    protected disabled = false;

    /**
     * Callback function to notify Angular forms of value changes
     */
    protected onChange: (value: T | null) => void = () => {
        // Default no-op implementation
    };

    /**
     * Callback function to notify Angular forms that the control was touched
     */
    protected onTouched: () => void = () => {
        // Default no-op implementation
    };

    /**
     * Writes a new value to the element.
     * Part of the ControlValueAccessor interface.
     *
     * @param value The new value for the control
     */
    writeValue(value: T | null): void {
        this.value = value;
    }

    /**
     * Registers a callback function that should be called when the control's value changes in the UI.
     * Part of the ControlValueAccessor interface.
     *
     * @param fn The callback function to register
     */
    registerOnChange(fn: (value: T | null) => void): void {
        this.onChange = fn;
    }

    /**
     * Registers a callback function that should be called when the control is touched.
     * Part of the ControlValueAccessor interface.
     *
     * @param fn The callback function to register
     */
    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    /**
     * Sets the disabled state of the control.
     * Part of the ControlValueAccessor interface.
     *
     * @param isDisabled Whether the control should be disabled
     */
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    /**
     * Helper method to emit value changes to Angular forms.
     * Call this when the control's value changes.
     *
     * @param value The new value to emit
     */
    protected emitChange(value: T | null): void {
        this.value = value;
        this.onChange(value);
    }

    /**
     * Helper method to mark the control as touched.
     * Call this when the control loses focus or when user interaction occurs.
     */
    protected markAsTouched(): void {
        this.onTouched();
    }
}
