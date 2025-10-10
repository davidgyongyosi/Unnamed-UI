import { booleanAttribute, DestroyRef, Directive, ElementRef, inject, input, OnInit, signal } from '@angular/core';
import { NgControl } from '@angular/forms';
import { startWith } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export type NxInputSize = 'large' | 'default' | 'small';
export type NxInputVariant = 'outlined' | 'filled' | 'borderless';
export type NxInputStatus = 'error' | 'warning' | 'success' | '';

@Directive({
    selector: 'input[nx-input],textarea[nx-input]',
    exportAs: 'nxInput',
    standalone: true,
    host: {
        class: 'nx-input',
        '[class.nx-input-disabled]': 'finalDisabled()',
        '[class.nx-input-borderless]': `nxVariant() === 'borderless'`,
        '[class.nx-input-filled]': `nxVariant() === 'filled'`,
        '[class.nx-input-outlined]': `nxVariant() === 'outlined'`,
        '[class.nx-input-lg]': `nxSize() === 'large'`,
        '[class.nx-input-sm]': `nxSize() === 'small'`,
        '[class.nx-input-status-error]': `nxStatus() === 'error'`,
        '[class.nx-input-status-warning]': `nxStatus() === 'warning'`,
        '[class.nx-input-status-success]': `nxStatus() === 'success'`,
        '[attr.disabled]': 'finalDisabled() || null',
        '[attr.readonly]': 'readonly() || null',
    },
})
export class InputDirective implements OnInit {
    private elementRef = inject(ElementRef);
    private destroyRef = inject(DestroyRef);
    readonly ngControl = inject(NgControl, { self: true, optional: true });

    readonly value = signal<string>(this.elementRef.nativeElement.value);

    readonly nxVariant = input<NxInputVariant>('outlined');
    readonly nxSize = input<NxInputSize>('default');
    readonly nxStatus = input<NxInputStatus>('');
    readonly disabled = input(false, { transform: booleanAttribute });
    readonly readonly = input(false, { transform: booleanAttribute });

    readonly controlDisabled = signal(false);
    readonly finalDisabled = this.ngControl ? this.controlDisabled : this.disabled;

    ngOnInit(): void {
        // Track form control disabled state
        this.ngControl?.statusChanges?.pipe(startWith(null), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.controlDisabled.set(!!this.ngControl!.disabled);
        });

        // Track form control value changes
        this.ngControl?.valueChanges?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
            this.value.set(value);
        });
    }
}
