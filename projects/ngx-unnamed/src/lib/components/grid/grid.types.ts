export interface NxGridConfig {
    /** Number of columns in the grid (default: 24) */
    columns?: number;
    /** Gap between grid items (default: 16px) */
    gap?: string | number;
    /** Whether to enable responsive behavior (default: true) */
    responsive?: boolean;
    /** Breakpoints for responsive behavior */
    breakpoints?: {
        xs?: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
        xxl?: number;
    };
}

export interface NxGridColConfig {
    /** Number of columns to span */
    span?: number | 'auto';
    /** Column start position */
    start?: number | 'auto';
    /** Column end position */
    end?: number | 'auto';
    /** Responsive column spans */
    xs?: number | 'auto';
    sm?: number | 'auto';
    md?: number | 'auto';
    lg?: number | 'auto';
    xl?: number | 'auto';
    xxl?: number | 'auto';
    /** Column order */
    order?: number;
    /** Offset columns */
    offset?: number;
    /** Push columns */
    push?: number;
    /** Pull columns */
    pull?: number;
}

export interface NxGridRowConfig {
    /** Gap between grid items in this row */
    gap?: string | number;
    /** Alignment of grid items in this row */
    align?: 'start' | 'center' | 'end' | 'stretch';
    /** Justification of grid items in this row */
    justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
    /** Wrap behavior */
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
}

export interface NxGridContext {
    /** Current grid configuration */
    grid: NxGridConfig;
    /** Current column configuration */
    col: NxGridColConfig;
    /** Current row configuration */
    row: NxGridRowConfig;
    /** Current breakpoint */
    breakpoint: string;
    /** Whether the grid is responsive */
    responsive: boolean;
}

export type NxGridAlign = 'start' | 'center' | 'end' | 'stretch';
export type NxGridJustify = 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
export type NxGridWrap = 'nowrap' | 'wrap' | 'wrap-reverse';
export type NxGridSpan = number | 'auto';

// Responsive breakpoint types
export interface NxGridBreakpoints {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
}

// Default configurations
export const DEFAULT_GRID_CONFIG: NxGridConfig = {
    columns: 24,
    gap: '16px',
    responsive: true,
    breakpoints: {
        xs: 576,
        sm: 768,
        md: 992,
        lg: 1200,
        xl: 1600,
        xxl: 1920
    }
};

export const DEFAULT_COL_CONFIG: NxGridColConfig = {
    span: 'auto',
    start: 'auto',
    end: 'auto'
};

export const DEFAULT_ROW_CONFIG: NxGridRowConfig = {
    gap: '16px',
    align: 'stretch',
    justify: 'start',
    wrap: 'wrap'
};

// Grid utility types
export type NxGridColumnClass =
    | `nx-col-${number}`
    | `nx-col-${'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'}-${number}`
    | `nx-col-offset-${number}`
    | `nx-col-push-${number}`
    | `nx-col-pull-${number}`
    | `nx-col-order-${number}`;

export type NxGridClass =
    | 'nx-grid'
    | 'nx-grid-row'
    | `nx-grid-gap-${string}`;

export type NxGridAlignmentClass =
    | 'nx-align-start'
    | 'nx-align-center'
    | 'nx-align-end'
    | 'nx-align-stretch';

export type NxGridJustifyClass =
    | 'nx-justify-start'
    | 'nx-justify-center'
    | 'nx-justify-end'
    | 'nx-justify-space-between'
    | 'nx-justify-space-around'
    | 'nx-justify-space-evenly';

export type NxGridWrapClass =
    | 'nx-wrap-nowrap'
    | 'nx-wrap'
    | 'nx-wrap-reverse';