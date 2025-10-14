import { ElementRef } from '@angular/core';
import { BehaviorSubject, Observable, filter } from 'rxjs';
import { NxModalConfig, NxModalResult } from './modal.config';

export class ModalRef {
    private readonly afterClose$ = new BehaviorSubject<NxModalResult | null>(null);
    private element: HTMLElement | null = null;
    private cleanupFocusTrap: (() => void) | null = null;

    componentInstance: any;

    constructor(
        private config: NxModalConfig,
        private triggerElement?: HTMLElement
    ) {}

    /**
     * Gets the modal element
     */
    getElement(): HTMLElement {
        return this.element!;
    }

    /**
     * Sets the modal element
     */
    setElement(element: HTMLElement): void {
        this.element = element;
    }

    /**
     * Gets the trigger element
     */
    getTriggerElement(): HTMLElement | undefined {
        return this.triggerElement;
    }

    /**
     * Observable that emits when modal is closed
     */
    get afterClose(): Observable<NxModalResult> {
        return this.afterClose$.asObservable().pipe(
            // Filter out initial null value
            filter((result: NxModalResult | null) => result !== null)
        ) as Observable<NxModalResult>;
    }

    /**
     * Closes the modal with a result
     */
    close(result: NxModalResult = { success: false }): void {
        this.afterClose$.next(result);
        this.destroy();
    }

    /**
     * Destroys the modal and cleans up resources
     */
    destroy(): void {
        // Clean up focus trap first
        if (this.cleanupFocusTrap) {
            this.cleanupFocusTrap();
            this.cleanupFocusTrap = null;
        }

        // Clean up any remaining modal elements with fallback focus restoration
        setTimeout(() => {
            // Return focus to trigger element with error handling
            if (this.triggerElement && typeof this.triggerElement.focus === 'function') {
                try {
                    this.triggerElement.focus();
                } catch (e) {
                    // Ignore focus errors
                    console.warn('Could not return focus to trigger element', e);
                }
            } else {
                // Fallback: focus the first available focusable element
                const focusableElement = document.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement;
                if (focusableElement && typeof focusableElement.focus === 'function') {
                    try {
                        focusableElement.focus();
                    } catch (e) {
                        // Last resort: focus body
                        if (document.body && typeof document.body.focus === 'function') {
                            document.body.focus();
                        }
                    }
                }
            }
        }, 0);

        // Complete the subject
        if (!this.afterClose$.closed) {
            this.afterClose$.complete();
        }
    }

    /**
     * Focuses the modal element
     */
    focus(): void {
        if (this.element) {
            this.element.focus();
        }
    }

    /**
     * Sets up focus trap cleanup function
     */
    setFocusTrapCleanup(cleanup: () => void): void {
        this.cleanupFocusTrap = cleanup;
    }

    /**
     * Gets the modal config
     */
    getConfig(): NxModalConfig {
        return { ...this.config };
    }
}