import {
    Component,
    Input,
    computed,
    signal,
    HostBinding,
    inject,
    Signal
} from '@angular/core';
import { NxGridRowConfig, DEFAULT_ROW_CONFIG } from './grid.types';

@Component({
    selector: 'nx-row',
    standalone: true,
    template: `<ng-content />`,
    styleUrl: './style/grid.component.scss',
    host: {
        class: 'nx-grid-row-host',
        '[class]': 'rowClasses()',
        '[style]': 'rowStyles()'
    }
})
export class NxGridRowComponent {
    /** Row configuration */
    @Input({ required: false })
    set config(value: NxGridRowConfig) {
        this.configSignal.set(value);
    }

    /** Gap between grid items in this row */
    @Input()
    set gap(value: string | number) {
        this.gapSignal.set(value);
    }

    /** Alignment of grid items in this row */
    @Input()
    set align(value: 'start' | 'center' | 'end' | 'stretch') {
        this.alignSignal.set(value);
    }

    /** Justification of grid items in this row */
    @Input()
    set justify(value: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly') {
        this.justifySignal.set(value);
    }

    /** Wrap behavior */
    @Input()
    set wrap(value: 'nowrap' | 'wrap' | 'wrap-reverse') {
        this.wrapSignal.set(value);
    }

    /** Internal signals */
    private configSignal = signal<NxGridRowConfig | null>(null);
    private gapSignal = signal<string | number | null>(null);
    private alignSignal = signal<'start' | 'center' | 'end' | 'stretch' | null>(null);
    private justifySignal = signal<'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly' | null>(null);
    private wrapSignal = signal<'nowrap' | 'wrap' | 'wrap-reverse' | null>(null);

    /** Current row configuration */
    private currentConfig = computed(() => {
        const config = this.configSignal();
        const gap = this.gapSignal();
        const align = this.alignSignal();
        const justify = this.justifySignal();
        const wrap = this.wrapSignal();

        return {
            ...DEFAULT_ROW_CONFIG,
            ...config,
            ...(gap !== null && { gap }),
            ...(align !== null && { align }),
            ...(justify !== null && { justify }),
            ...(wrap !== null && { wrap })
        };
    });

    /** Generate CSS classes for the row */
    rowClasses = computed(() => {
        const config = this.currentConfig();
        const classes = ['nx-grid-row'];

        // Add alignment classes
        if (config.align) {
            classes.push(`nx-align-${config.align}`);
        }

        // Add justification classes
        if (config.justify) {
            classes.push(`nx-justify-${config.justify}`);
        }

        // Add wrap classes
        if (config.wrap) {
            classes.push(`nx-wrap-${config.wrap === 'wrap' ? '' : config.wrap}`);
        }

        return classes.join(' ');
    });

    /** Generate inline styles for dynamic properties */
    rowStyles = computed(() => {
        const config = this.currentConfig();
        const styles: Record<string, string> = {};

        // Set gap
        if (config.gap !== undefined) {
            const gap = typeof config.gap === 'number' ? `${config.gap}px` : config.gap;
            styles['gap'] = gap;
        }

        // Set display as flexbox for layout
        styles['display'] = 'flex';

        // Set alignment
        if (config.align) {
            styles['align-items'] = this.getAlignValue(config.align);
        }

        // Set justification
        if (config.justify) {
            styles['justify-content'] = this.getJustifyValue(config.justify);
        }

        // Set wrap behavior
        if (config.wrap) {
            styles['flex-wrap'] = config.wrap;
        }

        return styles;
    });

    /** Host binding for accessibility */
    @HostBinding('role') role = 'row';

    private getAlignValue(align: string): string {
        switch (align) {
            case 'start': return 'flex-start';
            case 'center': return 'center';
            case 'end': return 'flex-end';
            case 'stretch': return 'stretch';
            default: return 'stretch';
        }
    }

    private getJustifyValue(justify: string): string {
        switch (justify) {
            case 'start': return 'flex-start';
            case 'center': return 'center';
            case 'end': return 'flex-end';
            case 'space-between': return 'space-between';
            case 'space-around': return 'space-around';
            case 'space-evenly': return 'space-evenly';
            default: return 'flex-start';
        }
    }
}