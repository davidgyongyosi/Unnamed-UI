import { Injectable } from '@angular/core';

/**
 * Counter for generating unique IDs.
 */
let uniqueIdCounter = 0;

/**
 * Live region politeness levels for screen reader announcements.
 */
export type AriaPoliteness = 'off' | 'polite' | 'assertive';

/**
 * Utility service for accessibility features.
 * Provides helpers for ARIA attributes, keyboard navigation, focus trapping, and screen reader announcements.
 *
 * @example
 * ```typescript
 * export class MyComponent {
 *   private a11y = inject(A11yUtility);
 *
 *   ngOnInit(): void {
 *     const id = this.a11y.generateUniqueId('my-input');
 *     this.a11y.setAriaDescribedBy(this.inputElement, id);
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class A11yUtility {
    /** Live region element for announcements */
    private liveRegionElement: HTMLElement | null = null;

    /**
     * Generates a unique ID with an optional prefix.
     * Useful for creating ARIA relationships (aria-labelledby, aria-describedby, etc.).
     *
     * @param prefix Optional prefix for the ID
     * @returns A unique ID string
     *
     * @example
     * ```typescript
     * const id = a11y.generateUniqueId('input'); // Returns 'input-1', 'input-2', etc.
     * ```
     */
    generateUniqueId(prefix = 'nx'): string {
        return `${prefix}-${uniqueIdCounter++}`;
    }

    /**
     * Sets the aria-describedby attribute on an element.
     *
     * @param element The element to set the attribute on
     * @param ids Space-separated IDs or array of IDs
     *
     * @example
     * ```typescript
     * a11y.setAriaDescribedBy(inputElement, 'hint-1 error-1');
     * // or
     * a11y.setAriaDescribedBy(inputElement, ['hint-1', 'error-1']);
     * ```
     */
    setAriaDescribedBy(element: HTMLElement, ids: string | string[]): void {
        const idString = Array.isArray(ids) ? ids.join(' ') : ids;
        if (idString.trim()) {
            element.setAttribute('aria-describedby', idString.trim());
        } else {
            element.removeAttribute('aria-describedby');
        }
    }

    /**
     * Sets the aria-labelledby attribute on an element.
     *
     * @param element The element to set the attribute on
     * @param ids Space-separated IDs or array of IDs
     *
     * @example
     * ```typescript
     * a11y.setAriaLabelledBy(modalElement, 'modal-title');
     * ```
     */
    setAriaLabelledBy(element: HTMLElement, ids: string | string[]): void {
        const idString = Array.isArray(ids) ? ids.join(' ') : ids;
        if (idString.trim()) {
            element.setAttribute('aria-labelledby', idString.trim());
        } else {
            element.removeAttribute('aria-labelledby');
        }
    }

    /**
     * Sets the aria-label attribute on an element.
     *
     * @param element The element to set the attribute on
     * @param label The label text
     *
     * @example
     * ```typescript
     * a11y.setAriaLabel(closeButton, 'Close dialog');
     * ```
     */
    setAriaLabel(element: HTMLElement, label: string | null): void {
        if (label) {
            element.setAttribute('aria-label', label);
        } else {
            element.removeAttribute('aria-label');
        }
    }

    /**
     * Sets the aria-expanded attribute on an element.
     *
     * @param element The element to set the attribute on
     * @param expanded Whether the element is expanded
     *
     * @example
     * ```typescript
     * a11y.setAriaExpanded(dropdownButton, isOpen);
     * ```
     */
    setAriaExpanded(element: HTMLElement, expanded: boolean): void {
        element.setAttribute('aria-expanded', String(expanded));
    }

    /**
     * Sets the aria-hidden attribute on an element.
     *
     * @param element The element to set the attribute on
     * @param hidden Whether the element is hidden
     *
     * @example
     * ```typescript
     * a11y.setAriaHidden(decorativeIcon, true);
     * ```
     */
    setAriaHidden(element: HTMLElement, hidden: boolean): void {
        if (hidden) {
            element.setAttribute('aria-hidden', 'true');
        } else {
            element.removeAttribute('aria-hidden');
        }
    }

    /**
     * Checks if a keyboard event is the Escape key.
     *
     * @param event The keyboard event
     * @returns True if the event is the Escape key
     */
    isEscape(event: KeyboardEvent): boolean {
        return event.key === 'Escape' || event.key === 'Esc';
    }

    /**
     * Checks if a keyboard event is the Enter key.
     *
     * @param event The keyboard event
     * @returns True if the event is the Enter key
     */
    isEnter(event: KeyboardEvent): boolean {
        return event.key === 'Enter';
    }

    /**
     * Checks if a keyboard event is the Space key.
     *
     * @param event The keyboard event
     * @returns True if the event is the Space key
     */
    isSpace(event: KeyboardEvent): boolean {
        return event.key === ' ' || event.key === 'Spacebar';
    }

    /**
     * Checks if a keyboard event is any arrow key.
     *
     * @param event The keyboard event
     * @returns True if the event is an arrow key
     */
    isArrowKey(event: KeyboardEvent): boolean {
        return ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Up', 'Down', 'Left', 'Right'].includes(event.key);
    }

    /**
     * Checks if a keyboard event is the ArrowUp key.
     *
     * @param event The keyboard event
     * @returns True if the event is ArrowUp
     */
    isArrowUp(event: KeyboardEvent): boolean {
        return event.key === 'ArrowUp' || event.key === 'Up';
    }

    /**
     * Checks if a keyboard event is the ArrowDown key.
     *
     * @param event The keyboard event
     * @returns True if the event is ArrowDown
     */
    isArrowDown(event: KeyboardEvent): boolean {
        return event.key === 'ArrowDown' || event.key === 'Down';
    }

    /**
     * Checks if a keyboard event is the ArrowLeft key.
     *
     * @param event The keyboard event
     * @returns True if the event is ArrowLeft
     */
    isArrowLeft(event: KeyboardEvent): boolean {
        return event.key === 'ArrowLeft' || event.key === 'Left';
    }

    /**
     * Checks if a keyboard event is the ArrowRight key.
     *
     * @param event The keyboard event
     * @returns True if the event is ArrowRight
     */
    isArrowRight(event: KeyboardEvent): boolean {
        return event.key === 'ArrowRight' || event.key === 'Right';
    }

    /**
     * Checks if a keyboard event is the Tab key.
     *
     * @param event The keyboard event
     * @returns True if the event is Tab
     */
    isTab(event: KeyboardEvent): boolean {
        return event.key === 'Tab';
    }

    /**
     * Creates a focus trap within an element.
     * Ensures focus stays within the element when tabbing.
     *
     * @param element The element to trap focus within
     * @returns Cleanup function to remove the focus trap
     *
     * @example
     * ```typescript
     * const cleanup = a11y.createFocusTrap(modalElement);
     * // Later:
     * cleanup();
     * ```
     */
    createFocusTrap(element: HTMLElement): () => void {
        const focusableElements = this.getFocusableElements(element);
        if (focusableElements.length === 0) {
            return () => {
                // No cleanup needed when there are no focusable elements
            };
        }

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        let isActive = true;

        const handleKeyDown = (event: KeyboardEvent): void => {
            if (!isActive || !this.isTab(event)) {
                return;
            }

            if (event.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstFocusable) {
                    event.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastFocusable) {
                    event.preventDefault();
                    firstFocusable.focus();
                }
            }
        };

        // Use capture phase and check if element is still connected
        const boundHandleKeyDown = handleKeyDown.bind(this);
        element.addEventListener('keydown', boundHandleKeyDown, true);

        // Focus first element asynchronously to avoid race conditions
        setTimeout(() => {
            if (isActive && document.contains(element)) {
                firstFocusable.focus();
            }
        }, 0);

        // Return cleanup function
        return () => {
            isActive = false;
            if (element && document.contains(element)) {
                element.removeEventListener('keydown', boundHandleKeyDown, true);
            }

            // Restore focus to the element that had focus before the trap
            // This helps prevent the "page bricking" issue
            setTimeout(() => {
                if (document.activeElement && document.activeElement instanceof HTMLElement) {
                    // Try to find a reasonable element to focus
                    const focusTarget = document.querySelector('body') || document.documentElement;
                    if (focusTarget instanceof HTMLElement) {
                        focusTarget.focus();
                    }
                }
            }, 0);
        };
    }

    /**
     * Gets all focusable elements within a container.
     *
     * @param container The container element
     * @returns Array of focusable elements
     */
    getFocusableElements(container: HTMLElement): HTMLElement[] {
        const selector = [
            'a[href]',
            'button:not([disabled])',
            'textarea:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
            '[contenteditable="true"]',
        ].join(',');

        return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter((element) => {
            // Filter out hidden elements
            return element.offsetParent !== null && getComputedStyle(element).visibility !== 'hidden';
        });
    }

    /**
     * Announces a message to screen readers using a live region.
     *
     * @param message The message to announce
     * @param politeness The politeness level for the announcement (default: 'polite')
     * @param duration How long to keep the message (in ms, default: 5000)
     *
     * @example
     * ```typescript
     * a11y.announce('Item added to cart');
     * a11y.announce('Error occurred!', 'assertive');
     * ```
     */
    announce(message: string, politeness: AriaPoliteness = 'polite', duration = 5000): void {
        const liveRegion = this.getLiveRegion(politeness);

        // Clear previous content
        liveRegion.textContent = '';

        // Trigger reflow to ensure screen readers detect the change
        void liveRegion.offsetHeight;

        // Set new message
        liveRegion.textContent = message;

        // Clear after duration
        if (duration > 0) {
            setTimeout(() => {
                if (liveRegion.textContent === message) {
                    liveRegion.textContent = '';
                }
            }, duration);
        }
    }

    /**
     * Gets or creates a live region element for screen reader announcements.
     *
     * @param politeness The politeness level
     * @returns The live region element
     */
    private getLiveRegion(politeness: AriaPoliteness): HTMLElement {
        if (!this.liveRegionElement) {
            this.liveRegionElement = document.createElement('div');
            this.liveRegionElement.setAttribute('role', 'status');
            this.liveRegionElement.className = 'nx-sr-only nx-live-region';
            this.liveRegionElement.style.cssText = `
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border-width: 0;
            `;
            document.body.appendChild(this.liveRegionElement);
        }

        // Update aria-live attribute
        if (politeness === 'off') {
            this.liveRegionElement.setAttribute('aria-live', 'off');
        } else {
            this.liveRegionElement.setAttribute('aria-live', politeness);
        }

        return this.liveRegionElement;
    }

    /**
     * Cleanup method to remove live region element.
     * Should be called when the utility is no longer needed.
     */
    cleanup(): void {
        if (this.liveRegionElement && this.liveRegionElement.parentNode) {
            this.liveRegionElement.parentNode.removeChild(this.liveRegionElement);
            this.liveRegionElement = null;
        }
    }
}
