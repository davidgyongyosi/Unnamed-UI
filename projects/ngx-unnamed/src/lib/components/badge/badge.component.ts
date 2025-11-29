import {
    Component,
    computed,
    effect,
    input,
    signal,
    inject,
    ElementRef,
} from '@angular/core';

import { NxBadgeContext, NxBadgeStatus, NxBadgePosition, NxBadgeSize } from './badge.types';

@Component({
    selector: 'nx-badge',
    standalone: true,
    template: `
        <span class="nx-badge-host-wrapper">
            <ng-content />
            @if (hasContent()) {
                <span
                    class="nx-badge"
                    [class]="badgeClasses()"
                    [style]="badgeStyles()"
                    [attr.aria-label]="ariaLabel()"
                    role="status"
                    aria-live="polite">
                    {{ displayText() }}
                </span>
            }
        </span>
    `,
    styleUrl: './style/badge.component.scss',
    host: {
        class: 'nx-badge-host',
        '[class.nx-badge-standalone]': 'standalone()',
    }
})
export class BadgeComponent {
    private elementRef = inject(ElementRef<HTMLElement>);

    // Inputs
    content = input<string | number | undefined>();
    status = input<NxBadgeStatus>('default');
    size = input<NxBadgeSize>('default');
    position = input<NxBadgePosition>('top-right');
    dot = input<boolean>(false);
    count = input<number | undefined>();
    maxCount = input<number>(99);
    color = input<string | undefined>();
    bordered = input<boolean>(false);
    standalone = input<boolean>(false);
    className = input<string>('');
    style = input<Record<string, string>>({});

    // Internal state
    private internalStatus = signal<NxBadgeStatus>('default');

    // Computed properties
    hasContent = computed(() => {
        return this.dot() || this.count() !== undefined || this.content() !== undefined;
    });

    showContent = computed(() => {
        return this.hasContent();
    });

    displayText = computed(() => {
        if (this.dot()) {
            return '';
        }

        const countValue = this.count();
        if (countValue !== undefined) {
            const max = this.maxCount();
            return countValue > max ? `${max}+` : countValue.toString();
        }

        const contentValue = this.content();
        return contentValue?.toString() || '';
    });

    ariaLabel = computed(() => {
        if (this.dot()) {
            return `Status: ${this.status()}`;
        }

        const countValue = this.count();
        if (countValue !== undefined) {
            const max = this.maxCount();
            const actualCount = countValue > max ? `${max}+` : countValue.toString();
            return `${actualCount} ${actualCount === '1' ? 'item' : 'items'}`;
        }

        const text = this.displayText();
        return text ? `Badge: ${text}` : 'Badge';
    });

    badgeClasses = computed(() => {
        const classes = ['nx-badge'];

        classes.push(`nx-badge-${this.status()}`);
        classes.push(`nx-badge-${this.size()}`);
        classes.push(`nx-badge-${this.position()}`);

        if (this.dot()) {
            classes.push('nx-badge-dot');
        }

        if (this.bordered()) {
            classes.push('nx-badge-bordered');
        }

        if (this.color()) {
            classes.push('nx-badge-custom-color');
        }

        if (this.className()) {
            classes.push(this.className());
        }

        return classes.join(' ');
    });

    badgeStyles = computed(() => {
        const styles: Record<string, string> = { ...this.style() };

        if (this.color()) {
            styles['--nx-badge-bg'] = this.color()!;
            styles['--nx-badge-border-color'] = this.color()!;
        }

        return styles;
    });

    constructor() {
        // Update internal status when input changes
        effect(() => {
            this.internalStatus.set(this.status());
        });

        // Announce changes to screen readers
        effect(() => {
            const ariaText = this.ariaLabel();
            if (ariaText && this.showContent()) {
                // Use a brief timeout to ensure the DOM is updated
                setTimeout(() => {
                    this.announceToScreenReader(ariaText);
                }, 0);
            }
        });
    }

    private announceToScreenReader(text: string): void {
        // Create a live region for screen reader announcements
        let liveRegion = document.getElementById('nx-badge-live-region');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'nx-badge-live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.position = 'absolute';
            liveRegion.style.left = '-10000px';
            liveRegion.style.width = '1px';
            liveRegion.style.height = '1px';
            liveRegion.style.overflow = 'hidden';
            document.body.appendChild(liveRegion);
        }

        liveRegion.textContent = text;

        // Clear the announcement after a brief delay
        setTimeout(() => {
            if (liveRegion) {
                liveRegion.textContent = '';
            }
        }, 1000);
    }

    // Public API methods
    /**
     * Get the current badge context
     */
    getContext(): NxBadgeContext {
        return {
            displayText: this.displayText(),
            isDot: this.dot(),
            isCount: this.count() !== undefined,
            status: this.status(),
        };
    }

    /**
     * Update badge content programmatically
     */
    updateContent(_content: string | number | undefined): void {
        // Note: In a real implementation, you might want to use a signal setter
        // This is provided as a convenience method for programmatic updates
        console.warn('updateContent is a placeholder method. Consider using input bindings for reactive updates.');
    }

    /**
     * Get the badge element for advanced positioning
     */
    getBadgeElement(): HTMLElement | null {
        const wrapper = this.elementRef.nativeElement.querySelector('.nx-badge-host-wrapper');
        return wrapper ? wrapper.querySelector('.nx-badge') : null;
    }
}