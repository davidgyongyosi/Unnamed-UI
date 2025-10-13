import { Injectable, ElementRef, NgZone, OnDestroy, inject } from '@angular/core';
import { Observable, Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Describes the origin of a focus event.
 */
export type FocusOrigin = 'keyboard' | 'mouse' | 'touch' | 'program' | null;

/**
 * Represents focus monitoring data for an element.
 */
interface FocusMonitorData {
    subject: Subject<FocusOrigin>;
    origin: FocusOrigin;
}

/**
 * Service for monitoring and managing focus states on elements.
 * Provides focus origin detection and focus management utilities.
 *
 * @example
 * ```typescript
 * export class MyComponent implements OnDestroy {
 *   private focusMonitor = inject(FocusMonitor);
 *
 *   ngAfterViewInit(): void {
 *     this.focusMonitor.monitor(this.elementRef).subscribe(origin => {
 *       console.log('Element focused via:', origin);
 *     });
 *   }
 *
 *   ngOnDestroy(): void {
 *     this.focusMonitor.stopMonitoring(this.elementRef);
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class FocusMonitor implements OnDestroy {
    private ngZone = inject(NgZone);

    /** Map of monitored elements to their focus data */
    private monitoredElements = new Map<Element, FocusMonitorData>();

    /** Subject to track when the service is destroyed */
    private destroy$ = new Subject<void>();

    /** Current focus origin being tracked */
    private currentFocusOrigin: FocusOrigin = null;

    /** Timeout for resetting focus origin */
    private originTimeout: ReturnType<typeof setTimeout> | null = null;

    constructor() {
        // Set up global listeners to detect focus origin
        this.ngZone.runOutsideAngular(() => {
            // Detect keyboard focus
            fromEvent<KeyboardEvent>(document, 'keydown', { capture: true })
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                    this.setFocusOrigin('keyboard');
                });

            // Detect mouse focus
            fromEvent<MouseEvent>(document, 'mousedown', { capture: true })
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                    this.setFocusOrigin('mouse');
                });

            // Detect touch focus
            fromEvent<TouchEvent>(document, 'touchstart', { capture: true })
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                    this.setFocusOrigin('touch');
                });
        });
    }

    /**
     * Monitors focus on the specified element and returns an Observable of focus origins.
     *
     * @param element The element or ElementRef to monitor
     * @returns Observable that emits focus origin when the element receives focus
     */
    monitor(element: ElementRef<HTMLElement> | HTMLElement): Observable<FocusOrigin> {
        const nativeElement = this.getNativeElement(element);

        // Return existing monitor if already monitoring this element
        const existingMonitor = this.monitoredElements.get(nativeElement);
        if (existingMonitor) {
            return existingMonitor.subject.asObservable();
        }

        // Create new monitor
        const subject = new Subject<FocusOrigin>();
        const monitorData: FocusMonitorData = {
            subject,
            origin: null,
        };

        this.monitoredElements.set(nativeElement, monitorData);

        // Listen for focus and blur events
        this.ngZone.runOutsideAngular(() => {
            fromEvent(nativeElement, 'focus')
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                    const origin = this.currentFocusOrigin || 'program';
                    monitorData.origin = origin;
                    this.ngZone.run(() => subject.next(origin));
                });

            fromEvent(nativeElement, 'blur')
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                    monitorData.origin = null;
                    this.ngZone.run(() => subject.next(null));
                });
        });

        return subject.asObservable();
    }

    /**
     * Stops monitoring focus on the specified element.
     *
     * @param element The element or ElementRef to stop monitoring
     */
    stopMonitoring(element: ElementRef<HTMLElement> | HTMLElement): void {
        const nativeElement = this.getNativeElement(element);
        const monitorData = this.monitoredElements.get(nativeElement);

        if (monitorData) {
            monitorData.subject.complete();
            this.monitoredElements.delete(nativeElement);
        }
    }

    /**
     * Focuses an element and sets the focus origin.
     *
     * @param element The HTML element to focus
     * @param origin The origin to attribute the focus to
     */
    focusVia(element: HTMLElement, origin: FocusOrigin): void {
        this.setFocusOrigin(origin, true);
        element.focus();
        // Reset origin after a frame to prevent affecting subsequent focuses
        setTimeout(() => {
            this.currentFocusOrigin = null;
        }, 0);
    }

    /**
     * Checks if focus is currently within the specified element or its descendants.
     *
     * @param element The element to check
     * @returns True if focus is within the element
     */
    isFocusWithin(element: Element): boolean {
        const activeElement = document.activeElement;
        return activeElement !== null && element.contains(activeElement);
    }

    /**
     * Gets the current focus origin for a monitored element.
     *
     * @param element The element to check
     * @returns The current focus origin or null if not monitored/focused
     */
    getFocusOrigin(element: ElementRef<HTMLElement> | HTMLElement): FocusOrigin {
        const nativeElement = this.getNativeElement(element);
        const monitorData = this.monitoredElements.get(nativeElement);
        return monitorData?.origin || null;
    }

    /**
     * Clean up when service is destroyed.
     */
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();

        // Clean up all monitored elements
        this.monitoredElements.forEach((data) => {
            data.subject.complete();
        });
        this.monitoredElements.clear();

        // Clear any pending timeout
        if (this.originTimeout) {
            clearTimeout(this.originTimeout);
        }
    }

    /**
     * Sets the current focus origin and optionally prevents auto-reset.
     *
     * @param origin The focus origin to set
     * @param persist Whether to prevent auto-reset (default: false)
     */
    private setFocusOrigin(origin: FocusOrigin, persist = false): void {
        this.currentFocusOrigin = origin;

        // Clear any existing timeout
        if (this.originTimeout) {
            clearTimeout(this.originTimeout);
            this.originTimeout = null;
        }

        // Auto-reset origin after a short delay unless persisting
        if (!persist) {
            this.originTimeout = setTimeout(() => {
                this.currentFocusOrigin = null;
                this.originTimeout = null;
            }, 1);
        }
    }

    /**
     * Extracts the native HTMLElement from an ElementRef or returns the element itself.
     *
     * @param element ElementRef or HTMLElement
     * @returns The native HTMLElement
     */
    private getNativeElement(element: ElementRef<HTMLElement> | HTMLElement): HTMLElement {
        return element instanceof ElementRef ? element.nativeElement : element;
    }
}
