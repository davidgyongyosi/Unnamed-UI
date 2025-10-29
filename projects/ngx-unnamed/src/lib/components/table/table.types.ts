/**
 * Type definitions and interfaces for the Table component
 */

import { TemplateRef } from '@angular/core';

/**
 * Table column definition interface
 */
export interface TableColumn {
    /** Unique key for the column */
    key: string;
    /** Column title displayed in header */
    title: string;
    /** Column width (CSS value) */
    width?: string;
    /** Minimum column width (CSS value) */
    minWidth?: string;
    /** Maximum column width (CSS value) */
    maxWidth?: string;
    /** Text alignment in cells */
    align?: 'left' | 'center' | 'right';
    /** Enable sorting for this column */
    sortable?: boolean;
    /** Custom sort function */
    sortFn?: (a: any, b: any) => number;
    /** Fixed column position */
    fixed?: 'left' | 'right';
    /** Column visibility */
    visible?: boolean;
    /** Custom cell template */
    cellTemplate?: TemplateRef<any>;
    /** Custom header template */
    headerTemplate?: TemplateRef<any>;
    /** Enable column resizing */
    resizable?: boolean;
}

/**
 * Table sort configuration
 */
export interface TableSort {
    /** Column key being sorted */
    key: string;
    /** Sort direction */
    direction: 'asc' | 'desc';
}

/**
 * Table pagination configuration
 */
export interface TablePagination {
    /** Current page number (1-based) */
    current: number;
    /** Number of items per page */
    pageSize: number;
    /** Total number of items */
    total: number;
    /** Available page size options */
    pageSizeOptions: number[];
    /** Whether to show quick jumper */
    showQuickJumper?: boolean;
    /** Whether to show page size selector */
    showSizeChanger?: boolean;
}

/**
 * Table selection configuration
 */
export interface TableSelection {
    /** Selected row keys */
    selectedRowKeys: any[];
    /** Selection mode */
    mode: 'single' | 'multiple';
    /** Column key for row identification */
    rowKey: string;
    /** Whether to select on row click */
    selectOnRowClick?: boolean;
    /** Disabled row keys */
    disabledRowKeys?: any[];
}

/**
 * Table row data interface
 */
export interface TableRow {
    /** Unique row identifier */
    [key: string]: any;
}

/**
 * Table cell data interface
 */
export interface TableCell {
    /** Column key */
    column: string;
    /** Cell value */
    value: any;
    /** Row data */
    record: TableRow;
    /** Column definition */
    columnDef: TableColumn;
}

/**
 * Table events
 */
export interface TableSortEvent {
    /** Column key */
    column: string;
    /** Sort direction */
    direction: 'asc' | 'desc' | null;
    /** Multiple sort columns */
    multiple?: TableSort[];
}

export interface TableSelectionEvent {
    /** Selected row keys */
    selectedRowKeys: any[];
    /** Selected rows */
    selectedRows: TableRow[];
    /** Current row */
    row?: TableRow;
    /** Whether row is selected */
    selected: boolean;
}

export interface TablePageChangeEvent {
    /** Current page */
    current: number;
    /** Page size */
    pageSize: number;
}

export interface TableRowClickEvent {
    /** Row data */
    record: TableRow;
    /** Row index */
    index: number;
    /** Event */
    event: MouseEvent;
}

/**
 * Table configuration interface
 */
export interface TableConfig {
    /** Table size */
    size?: 'small' | 'default' | 'large';
    /** Whether to show table header */
    showHeader?: boolean;
    /** Whether table is bordered */
    bordered?: boolean;
    /** Whether to enable row hover */
    hoverable?: boolean;
    /** Whether to enable striped rows */
    striped?: boolean;
    /** Whether table is loading */
    loading?: boolean;
    /** Whether to show pagination */
    showPagination?: boolean;
    /** Empty state text */
    emptyText?: string;
    /** Scroll configuration */
    scroll?: { x?: string; y?: string };
    /** Row selection configuration */
    rowSelection?: TableSelection;
    /** Sort configuration */
    sort?: TableSort | TableSort[];
    /** Pagination configuration */
    pagination?: TablePagination | false;
}

/**
 * Table size options
 */
export type NxTableSize = 'small' | 'default' | 'large';

/**
 * Table column alignment
 */
export type NxTableAlign = 'left' | 'center' | 'right';

/**
 * Table sort direction
 */
export type NxTableSortDirection = 'asc' | 'desc' | null;

/**
 * Table selection mode
 */
export type NxTableSelectionMode = 'single' | 'multiple';

/**
 * Table template context for custom cells
 */
export interface NxTableCellTemplateContext<T = any> {
    /** Cell value */
    $implicit: T;
    /** Row data */
    record: TableRow;
    /** Column definition */
    column: TableColumn;
    /** Row index */
    index: number;
}