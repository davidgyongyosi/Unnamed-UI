import {
    Component,
    Input,
    computed,
    signal,
    HostBinding,
    inject,
    Signal
} from '@angular/core';
import { NxGridColConfig, DEFAULT_COL_CONFIG } from './grid.types';

@Component({
    selector: 'nx-col',
    standalone: true,
    template: `<ng-content />`,
    styleUrl: './style/grid.component.scss',
    host: {
        class: 'nx-grid-col-host',
        '[class]': 'colClasses()',
        '[style]': 'colStyles()'
    }
})
export class NxGridColComponent {
    /** Column configuration */
    @Input({ required: false })
    set config(value: NxGridColConfig) {
        this.configSignal.set(value);
    }

    /** Number of columns to span */
    @Input()
    set span(value: number | 'auto') {
        this.spanSignal.set(value);
    }

    /** Column start position */
    @Input()
    set start(value: number | 'auto') {
        this.startSignal.set(value);
    }

    /** Column end position */
    @Input()
    set end(value: number | 'auto') {
        this.endSignal.set(value);
    }

    /** Responsive column spans */
    @Input()
    set xs(value: number | 'auto') {
        this.xsSignal.set(value);
    }

    @Input()
    set sm(value: number | 'auto') {
        this.smSignal.set(value);
    }

    @Input()
    set md(value: number | 'auto') {
        this.mdSignal.set(value);
    }

    @Input()
    set lg(value: number | 'auto') {
        this.lgSignal.set(value);
    }

    @Input()
    set xl(value: number | 'auto') {
        this.xlSignal.set(value);
    }

    @Input()
    set xxl(value: number | 'auto') {
        this.xxlSignal.set(value);
    }

    /** Column order */
    @Input()
    set order(value: number) {
        this.orderSignal.set(value);
    }

    /** Offset columns */
    @Input()
    set offset(value: number) {
        this.offsetSignal.set(value);
    }

    /** Push columns */
    @Input()
    set push(value: number) {
        this.pushSignal.set(value);
    }

    /** Pull columns */
    @Input()
    set pull(value: number) {
        this.pullSignal.set(value);
    }

    /** Internal signals */
    private configSignal = signal<NxGridColConfig | null>(null);
    private spanSignal = signal<number | 'auto' | null>(null);
    private startSignal = signal<number | 'auto' | null>(null);
    private endSignal = signal<number | 'auto' | null>(null);
    private xsSignal = signal<number | 'auto' | null>(null);
    private smSignal = signal<number | 'auto' | null>(null);
    private mdSignal = signal<number | 'auto' | null>(null);
    private lgSignal = signal<number | 'auto' | null>(null);
    private xlSignal = signal<number | 'auto' | null>(null);
    private xxlSignal = signal<number | 'auto' | null>(null);
    private orderSignal = signal<number | null>(null);
    private offsetSignal = signal<number | null>(null);
    private pushSignal = signal<number | null>(null);
    private pullSignal = signal<number | null>(null);

    /** Current column configuration */
    private currentConfig = computed(() => {
        const config = this.configSignal();
        const span = this.spanSignal();
        const start = this.startSignal();
        const end = this.endSignal();
        const xs = this.xsSignal();
        const sm = this.smSignal();
        const md = this.mdSignal();
        const lg = this.lgSignal();
        const xl = this.xlSignal();
        const xxl = this.xxlSignal();
        const order = this.orderSignal();
        const offset = this.offsetSignal();
        const push = this.pushSignal();
        const pull = this.pullSignal();

        return {
            ...DEFAULT_COL_CONFIG,
            ...config,
            ...(span !== null && { span }),
            ...(start !== null && { start }),
            ...(end !== null && { end }),
            ...(xs !== null && { xs }),
            ...(sm !== null && { sm }),
            ...(md !== null && { md }),
            ...(lg !== null && { lg }),
            ...(xl !== null && { xl }),
            ...(xxl !== null && { xxl }),
            ...(order !== null && { order }),
            ...(offset !== null && { offset }),
            ...(push !== null && { push }),
            ...(pull !== null && { pull })
        };
    });

    /** Generate CSS classes for the column */
    colClasses = computed(() => {
        const config = this.currentConfig();
        const classes = ['nx-grid-col'];

        // Add span classes
        if (config.span !== 'auto' && config.span && typeof config.span === 'number') {
            classes.push(`nx-col-span-${config.span}`);
        }

        // Add responsive span classes
        if (config.xs !== undefined) {
            classes.push(this.getSpanClass('xs', config.xs));
        }
        if (config.sm !== undefined) {
            classes.push(this.getSpanClass('sm', config.sm));
        }
        if (config.md !== undefined) {
            classes.push(this.getSpanClass('md', config.md));
        }
        if (config.lg !== undefined) {
            classes.push(this.getSpanClass('lg', config.lg));
        }
        if (config.xl !== undefined) {
            classes.push(this.getSpanClass('xl', config.xl));
        }
        if (config.xxl !== undefined) {
            classes.push(this.getSpanClass('xxl', config.xxl));
        }

        // Add positioning classes
        if (config.offset !== undefined && config.offset >= 0) {
            classes.push(`nx-col-offset-${config.offset}`);
        }
        if (config.push !== undefined && config.push >= 0) {
            classes.push(`nx-col-push-${config.push}`);
        }
        if (config.pull !== undefined && config.pull >= 0) {
            classes.push(`nx-col-pull-${config.pull}`);
        }
        if (config.order !== undefined && config.order >= 0) {
            classes.push(`nx-col-order-${config.order}`);
        }

        return classes.join(' ');
    });

    /** Generate inline styles for dynamic positioning */
    colStyles = computed(() => {
        const config = this.currentConfig();
        const styles: Record<string, string> = {};

        // Grid column positioning for span
        if (config.span !== 'auto' && config.span && typeof config.span === 'number') {
            styles['grid-column'] = `span ${config.span}`;
        }

        // Order
        if (config.order !== undefined && config.order >= 0) {
            styles['order'] = config.order.toString();
        }

        return styles;
    });

    /** Host binding for accessibility */
    @HostBinding('role') role = 'gridcell';

    private getSpanClass(breakpoint: string, span: number | 'auto'): string {
        return span === 'auto' ? `nx-col-${breakpoint}-auto` : `nx-col-${breakpoint}-${span}`;
    }
}