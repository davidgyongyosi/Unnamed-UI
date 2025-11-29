import {
    Component,
    computed,
    effect,
    input,
    output,
    HostBinding,
    HostListener,
    inject,
    ElementRef,
    signal,
    ChangeDetectionStrategy,
    ViewEncapsulation,
} from '@angular/core';

import { NxIconComponent } from '../icon/icon.component';
import { NxTagConfig, NxTagContext, NxTagMode, NxTagColor, NxTagSize, NxTagClickEvent, NxTagCloseEvent, NxTagChangeEvent } from './tag.types';

@Component({
    selector: 'nx-tag',
    standalone: true,
    imports: [NxIconComponent],
    template: `
        <span
            class="nx-tag"
            [class]="tagClasses()"
            [style]="tagStyles()"
            [attr.aria-label]="ariaLabel()"
            [attr.aria-selected]="ariaSelected()"
            [attr.aria-disabled]="disabled()"
            role="option"
            tabindex="disabled() ? -1 : 0"
            (click)="onTagClick($event)"
            (keydown)="onKeyDown($event)">

            @if (isCheckable()) {
                <span class="nx-tag-checkmark" aria-hidden="true">
                    <nx-icon [type]="checkIcon()" theme="fill"></nx-icon>
                </span>
            }

            <span class="nx-tag-content">{{ content() }}</span>

            @if (isCloseable()) {
                <span class="nx-tag-close-icon"
                      (click)="onCloseClick($event)"
                      [attr.aria-label]="closeAriaLabel()"
                      role="button"
                      tabindex="0">
                    <nx-icon [type]="closeIcon()"></nx-icon>
                </span>
            }
        </span>
    `,
    styleUrl: './style/tag.component.scss',
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'nx-tag-host',
    },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagComponent {
    private elementRef = inject(ElementRef<HTMLElement>);

    // Inputs
    content = input.required<string>();
    color = input<NxTagColor>('default');
    size = input<NxTagSize>('default');
    mode = input<NxTagMode>('default');
    selected = input<boolean>(false);
    disabled = input<boolean>(false);
    checked = input<boolean>(false);
    closeIcon = input<string>('x');
    checkIcon = input<string>('check-fat');
    className = input<string>('');
    style = input<Record<string, any>>({});
    value = input<any>(undefined);
    closable = input<boolean>(false);

    // Outputs
    click = output<NxTagClickEvent>();
    close = output<NxTagCloseEvent>();
    change = output<NxTagChangeEvent>();

    // Internal state
    private internalChecked = signal<boolean>(false);
    private internalSelected = signal<boolean>(false);

    // Computed properties
    isCheckable = computed(() => this.mode() === 'checkable');
    isCloseable = computed(() => this.mode() === 'closeable' || this.closable());
    isDisabled = computed(() => this.disabled());

    tagClasses = computed(() => {
        const classes = ['nx-tag'];

        // Color classes
        classes.push(`nx-tag-${this.color()}`);

        // Size classes
        classes.push(`nx-tag-${this.size()}`);

        // Mode classes
        if (this.isCheckable()) {
            classes.push('nx-tag-checkable');
        }
        if (this.isCloseable()) {
            classes.push('nx-tag-closeable');
        }

        // State classes
        if (this.isSelected()) {
            classes.push('nx-tag-checked');
        }
        if (this.isDisabled()) {
            classes.push('nx-tag-disabled');
        }

        // Custom classes
        if (this.className()) {
            classes.push(this.className());
        }

        return classes.join(' ');
    });

    tagStyles = computed(() => {
        return { ...this.style() };
    });

    isSelected = computed(() => {
        if (this.isCheckable()) {
            return this.checked() || this.internalChecked();
        }
        return this.selected() || this.internalSelected();
    });

    ariaLabel = computed(() => {
        const baseLabel = this.content();
        if (this.isDisabled()) {
            return `${baseLabel} (disabled)`;
        }
        if (this.isSelected()) {
            return `${baseLabel} (selected)`;
        }
        return baseLabel;
    });

    ariaSelected = computed(() => {
        return this.isCheckable() ? this.isSelected() : undefined;
    });

    closeAriaLabel = computed(() => {
        return `Remove ${this.content()} tag`;
    });

    constructor() {
        effect(() => {
            this.internalChecked.set(this.checked());
        });

        effect(() => {
            this.internalSelected.set(this.selected());
        });
    }

    @HostListener('keydown.enter')
    @HostListener('keydown.space')
    onHostKeyDown(event: KeyboardEvent): void {
        if (this.isDisabled()) {
            return;
        }

        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.onTagClick(event);
        }
    }

    onTagClick(event: MouseEvent | KeyboardEvent): void {
        if (this.isDisabled()) {
            event.preventDefault();
            return;
        }

        const clickEvent: NxTagClickEvent = {
            value: this.value(),
            content: this.content(),
            selected: this.isSelected(),
            event
        };

        this.click.emit(clickEvent);

        if (this.isCheckable()) {
            this.toggleCheck();
        }
    }

    onCloseClick(event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();

        if (this.isDisabled()) {
            return;
        }

        const closeEvent: NxTagCloseEvent = {
            value: this.value(),
            content: this.content(),
            event
        };

        this.close.emit(closeEvent);
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.isDisabled()) {
            return;
        }

        switch (event.key) {
            case 'Delete':
            case 'Backspace':
                if (this.isCloseable()) {
                    event.preventDefault();
                    this.onCloseClick(event as any);
                }
                break;
            case 'Enter':
            case ' ':
                event.preventDefault();
                this.onTagClick(event);
                break;
        }
    }

    private toggleCheck(): void {
        const newCheckedState = !this.isSelected();

        if (this.isCheckable()) {
            this.internalChecked.set(newCheckedState);
        } else {
            this.internalSelected.set(newCheckedState);
        }

        const changeEvent: NxTagChangeEvent = {
            value: this.value(),
            content: this.content(),
            checked: newCheckedState,
            event: new MouseEvent('click')
        };

        this.change.emit(changeEvent);
    }

    // Public API methods
    /**
     * Get the current tag context
     */
    getContext(): NxTagContext {
        return {
            content: this.content(),
            mode: this.mode(),
            isSelected: this.isSelected(),
            isDisabled: this.isDisabled(),
            color: this.color(),
            value: this.value()
        };
    }

    /**
     * Select the tag
     */
    select(): void {
        if (!this.isDisabled()) {
            if (this.isCheckable()) {
                this.internalChecked.set(true);
            } else {
                this.internalSelected.set(true);
            }
        }
    }

    /**
     * Deselect the tag
     */
    deselect(): void {
        if (!this.isDisabled()) {
            if (this.isCheckable()) {
                this.internalChecked.set(false);
            } else {
                this.internalSelected.set(false);
            }
        }
    }

    /**
     * Toggle selection state
     */
    toggle(): void {
        if (!this.isDisabled()) {
            this.toggleCheck();
        }
    }

    /**
     * Focus the tag element
     */
    focus(): void {
        this.elementRef.nativeElement.focus();
    }

    /**
     * Check if tag is selected
     */
    isChecked(): boolean {
        return this.isSelected();
    }
}