import {
    Component,
    Input,
    computed,
    signal,
    Signal,
    inject,
    effect,
    DestroyRef
} from '@angular/core';
import {
    NxGridConfig,
    NxGridContext,
    NxGridBreakpoints,
    DEFAULT_GRID_CONFIG
} from './grid.types';
import { DEFAULT_BREAKPOINTS } from '../../utils/responsive.utility';
import { ResponsiveUtility, type Breakpoint } from '../../utils/responsive.utility';

@Component({
    selector: 'nx-grid',
    standalone: true,
    template: `
        <div [class]="gridClasses()" [style]="gridStyles()">
            <ng-content />
        </div>
    `,
    styleUrl: './style/grid.component.scss',
    host: {
        class: 'nx-grid-host'
    }
})
export class NxGridComponent {
    /** Grid configuration */
    @Input({ required: false })
    set config(value: NxGridConfig) {
        this.configSignal.set(value);
    }

    /** Number of columns in the grid */
    @Input()
    set columns(value: number) {
        this.columnsSignal.set(value);
    }

    /** Gap between grid items */
    @Input()
    set gap(value: string | number) {
        this.gapSignal.set(value);
    }

    /** Enable/disable responsive behavior */
    @Input()
    set responsive(value: boolean) {
        this.responsiveSignal.set(value);
    }

    /** Custom breakpoints */
    @Input()
    set breakpoints(value: NxGridBreakpoints) {
        this.breakpointsSignal.set(value);
    }

    /** Internal signals for reactive updates */
    private configSignal = signal<NxGridConfig | null>(null);
    private columnsSignal = signal<number | null>(null);
    private gapSignal = signal<string | number | null>(null);
    private responsiveSignal = signal<boolean | null>(null);
    private breakpointsSignal = signal<NxGridBreakpoints | null>(null);

    /** Responsive utility for breakpoint detection */
    private responsiveUtility = inject(ResponsiveUtility);
    private destroyRef = inject(DestroyRef);

    /** Current breakpoint signal */
    private currentBreakpoint = signal<Breakpoint>('md');

    constructor() {
        // Initialize responsive breakpoints
        this.initializeResponsive();
    }

    /** Current grid configuration */
    private currentConfig = computed(() => {
        const inputConfig = this.configSignal();
        const customColumns = this.columnsSignal();
        const customGap = this.gapSignal();
        const customResponsive = this.responsiveSignal();
        const customBreakpoints = this.breakpointsSignal();

        return {
            ...DEFAULT_GRID_CONFIG,
            ...inputConfig,
            ...(customColumns !== null && { columns: customColumns }),
            ...(customGap !== null && { gap: customGap }),
            ...(customResponsive !== null && { responsive: customResponsive }),
            ...(customBreakpoints !== null && { breakpoints: customBreakpoints })
        };
    });

    /** Generate CSS classes for the grid container */
    gridClasses = computed(() => {
        const config = this.currentConfig();
        const classes = ['nx-grid'];

        // Add responsive class
        if (config.responsive) {
            classes.push('nx-grid-responsive');
            classes.push(`nx-grid-${this.currentBreakpoint()}`);
        }

        return classes.join(' ');
    });

    /** Generate inline styles for dynamic properties */
    gridStyles = computed(() => {
        const config = this.currentConfig();
        const styles: Record<string, string> = {};

        // Set gap
        if (config.gap !== undefined) {
            const gap = typeof config.gap === 'number' ? `${config.gap}px` : config.gap;
            styles['gap'] = gap;
        }

        // Set grid template columns
        if (config.columns !== undefined) {
            styles['grid-template-columns'] = `repeat(${config.columns}, 1fr)`;
        }

        return styles;
    });

    /** Grid context for child components */
    gridContext: Signal<NxGridContext> = computed(() => {
        const config = this.currentConfig();
        const breakpoint = this.currentBreakpoint();

        return {
            grid: config,
            col: {
                span: 'auto',
                start: 'auto',
                end: 'auto'
            },
            row: {
                gap: config.gap!,
                align: 'stretch',
                justify: 'start',
                wrap: 'wrap'
            },
            breakpoint,
            responsive: config.responsive!
        };
    });

    private initializeResponsive(): void {
        if (!this.responsiveUtility) return;

        // Subscribe to breakpoint changes
        const breakpointSubscription = this.responsiveUtility.currentBreakpoint$.subscribe(
            (breakpoint: Breakpoint) => {
                this.currentBreakpoint.set(breakpoint);
            }
        );

        // Cleanup on destroy
        this.destroyRef.onDestroy(() => {
            breakpointSubscription.unsubscribe();
        });
    }
}