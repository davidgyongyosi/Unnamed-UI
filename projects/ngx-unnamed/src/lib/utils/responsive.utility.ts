import { Injectable, NgZone, OnDestroy, inject } from '@angular/core';
import { BehaviorSubject, Observable, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

/**
 * Breakpoint names for responsive design.
 */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

/**
 * Breakpoint configuration with pixel values.
 */
export interface BreakpointConfig {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
}

/**
 * Default breakpoint configuration matching common frameworks.
 */
export const DEFAULT_BREAKPOINTS: BreakpointConfig = {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400,
};

/**
 * Service for responsive breakpoint detection and management.
 * Provides observables for tracking viewport size changes and current breakpoint.
 *
 * @example
 * ```typescript
 * export class MyComponent implements OnInit {
 *   private responsiveUtility = inject(ResponsiveUtility);
 *
 *   ngOnInit(): void {
 *     this.responsiveUtility.currentBreakpoint$.subscribe(breakpoint => {
 *       console.log('Current breakpoint:', breakpoint);
 *     });
 *
 *     if (this.responsiveUtility.isBreakpoint('md')) {
 *       // Show desktop layout
 *     }
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ResponsiveUtility implements OnDestroy {
    private ngZone = inject(NgZone);

    /** Breakpoint configuration */
    private breakpoints: BreakpointConfig;

    /** Subject for cleanup on destroy */
    private destroy$ = new Subject<void>();

    /** Current breakpoint subject */
    private breakpointSubject: BehaviorSubject<Breakpoint>;

    /** Observable of the current breakpoint */
    public readonly currentBreakpoint$: Observable<Breakpoint>;

    /** Observable of the current window width */
    public readonly windowWidth$!: Observable<number>;

    constructor() {
        this.breakpoints = { ...DEFAULT_BREAKPOINTS };
        const initialBreakpoint = this.calculateBreakpoint(window.innerWidth);
        this.breakpointSubject = new BehaviorSubject<Breakpoint>(initialBreakpoint);
        this.currentBreakpoint$ = this.breakpointSubject.asObservable();

        // Set up window resize listener
        this.ngZone.runOutsideAngular(() => {
            const resize$ = fromEvent(window, 'resize').pipe(debounceTime(150), takeUntil(this.destroy$));

            // Track window width changes
            const windowWidth$ = resize$.pipe(
                map(() => window.innerWidth),
                distinctUntilChanged()
            );
            // Initialize using object property assignment to satisfy readonly constraint
            Object.defineProperty(this, 'windowWidth$', { value: windowWidth$, writable: false });

            // Track breakpoint changes
            resize$.pipe(map(() => this.calculateBreakpoint(window.innerWidth)), distinctUntilChanged()).subscribe((breakpoint) => {
                this.ngZone.run(() => {
                    this.breakpointSubject.next(breakpoint);
                });
            });
        });
    }

    /**
     * Gets the current breakpoint synchronously.
     *
     * @returns The current breakpoint
     */
    getCurrentBreakpoint(): Breakpoint {
        return this.breakpointSubject.value;
    }

    /**
     * Checks if the current viewport matches the specified breakpoint.
     *
     * @param breakpoint The breakpoint to check
     * @returns True if the current viewport matches the breakpoint
     */
    isBreakpoint(breakpoint: Breakpoint): boolean {
        return this.getCurrentBreakpoint() === breakpoint;
    }

    /**
     * Checks if the current viewport is at least the specified breakpoint.
     * For example, `isBreakpointOrLarger('md')` returns true for md, lg, xl, and xxl.
     *
     * @param breakpoint The minimum breakpoint
     * @returns True if current breakpoint is equal to or larger than specified
     */
    isBreakpointOrLarger(breakpoint: Breakpoint): boolean {
        const currentWidth = window.innerWidth;
        return currentWidth >= this.breakpoints[breakpoint];
    }

    /**
     * Checks if the current viewport is at most the specified breakpoint.
     * For example, `isBreakpointOrSmaller('md')` returns true for xs, sm, and md.
     *
     * @param breakpoint The maximum breakpoint
     * @returns True if current breakpoint is equal to or smaller than specified
     */
    isBreakpointOrSmaller(breakpoint: Breakpoint): boolean {
        const currentWidth = window.innerWidth;
        const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
        const maxBreakpointIndex = breakpointOrder.indexOf(breakpoint);
        const nextBreakpoint = breakpointOrder[maxBreakpointIndex + 1];

        if (!nextBreakpoint) {
            // Already at largest breakpoint
            return true;
        }

        return currentWidth < this.breakpoints[nextBreakpoint];
    }

    /**
     * Checks if the current viewport width falls between two breakpoints.
     *
     * @param min The minimum breakpoint (inclusive)
     * @param max The maximum breakpoint (inclusive)
     * @returns True if current breakpoint is between min and max
     */
    isBetweenBreakpoints(min: Breakpoint, max: Breakpoint): boolean {
        return this.isBreakpointOrLarger(min) && this.isBreakpointOrSmaller(max);
    }

    /**
     * Gets the current window width.
     *
     * @returns The current window width in pixels
     */
    getWindowWidth(): number {
        return window.innerWidth;
    }

    /**
     * Gets the current window height.
     *
     * @returns The current window height in pixels
     */
    getWindowHeight(): number {
        return window.innerHeight;
    }

    /**
     * Gets the breakpoint configuration.
     *
     * @returns The current breakpoint configuration
     */
    getBreakpointConfig(): Readonly<BreakpointConfig> {
        return { ...this.breakpoints };
    }

    /**
     * Updates the breakpoint configuration.
     * Use this to customize breakpoints for your application.
     *
     * @param config Partial breakpoint configuration to merge with defaults
     */
    setBreakpointConfig(config: Partial<BreakpointConfig>): void {
        this.breakpoints = { ...this.breakpoints, ...config };
        // Recalculate current breakpoint with new config
        const newBreakpoint = this.calculateBreakpoint(window.innerWidth);
        if (newBreakpoint !== this.breakpointSubject.value) {
            this.breakpointSubject.next(newBreakpoint);
        }
    }

    /**
     * Observes a specific breakpoint and emits when it becomes active or inactive.
     *
     * @param breakpoint The breakpoint to observe
     * @returns Observable that emits true when breakpoint is active, false otherwise
     */
    observeBreakpoint(breakpoint: Breakpoint): Observable<boolean> {
        return this.currentBreakpoint$.pipe(map((current) => current === breakpoint), distinctUntilChanged());
    }

    /**
     * Observes whether viewport is at least the specified breakpoint.
     *
     * @param breakpoint The minimum breakpoint to observe
     * @returns Observable that emits true when viewport is at least the breakpoint
     */
    observeBreakpointOrLarger(breakpoint: Breakpoint): Observable<boolean> {
        return this.currentBreakpoint$.pipe(
            map(() => this.isBreakpointOrLarger(breakpoint)),
            distinctUntilChanged()
        );
    }

    /**
     * Observes whether viewport is at most the specified breakpoint.
     *
     * @param breakpoint The maximum breakpoint to observe
     * @returns Observable that emits true when viewport is at most the breakpoint
     */
    observeBreakpointOrSmaller(breakpoint: Breakpoint): Observable<boolean> {
        return this.currentBreakpoint$.pipe(
            map(() => this.isBreakpointOrSmaller(breakpoint)),
            distinctUntilChanged()
        );
    }

    /**
     * Cleans up resources on destroy.
     */
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.breakpointSubject.complete();
    }

    /**
     * Calculates the breakpoint for a given width.
     *
     * @param width The width in pixels
     * @returns The corresponding breakpoint
     */
    private calculateBreakpoint(width: number): Breakpoint {
        if (width >= this.breakpoints.xxl) return 'xxl';
        if (width >= this.breakpoints.xl) return 'xl';
        if (width >= this.breakpoints.lg) return 'lg';
        if (width >= this.breakpoints.md) return 'md';
        if (width >= this.breakpoints.sm) return 'sm';
        return 'xs';
    }
}
