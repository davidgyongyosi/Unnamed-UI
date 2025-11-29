import { Signal } from '@angular/core';

export interface NxPaginationConfig {
    /** Current page number (1-based) */
    current?: number;
    /** Total number of pages */
    total?: number;
    /** Total number of items */
    totalItems?: number;
    /** Number of items per page */
    pageSize?: number;
    /** Pagination style */
    variant?: NxPaginationVariant;
    /** Pagination size */
    size?: NxPaginationSize;
    /** Whether to show page size selector */
    showSizeChanger?: boolean;
    /** Whether to show quick jumper */
    showQuickJumper?: boolean;
    /** Whether to show total items count */
    showTotal?: boolean;
    /** Available page sizes for size changer */
    pageSizeOptions?: number[];
    /** Custom CSS class */
    className?: string;
    /** Whether pagination is disabled */
    disabled?: boolean;
    /** Whether to show less page buttons on mobile */
    simple?: boolean;
}

export interface NxPaginationContext {
    /** Current pagination configuration */
    pagination: NxPaginationConfig;
    /** Current page number */
    currentPage: number;
    /** Total pages */
    totalPages: number;
    /** Array of page numbers to show */
    pages: number[];
    /** Whether first page is visible */
    showFirst: boolean;
    /** Whether last page is visible */
    showLast: boolean;
    /** Whether previous page is available */
    hasPrev: boolean;
    /** Whether next page is available */
    hasNext: boolean;
    /** Start item index */
    startItem: number;
    /** End item index */
    endItem: number;
}

export type NxPaginationVariant = 'default' | 'simple' | 'mini';
export type NxPaginationSize = 'small' | 'default' | 'large';

export interface NxPaginationChangeEvent {
    /** Current page number */
    page: number;
    /** Page size */
    pageSize: number;
    /** Type of change */
    type: 'page' | 'size';
}

export interface NxPaginationPageEvent {
    /** Page number */
    page: number;
    /** Page change type */
    type: 'first' | 'prev' | 'page' | 'next' | 'last' | 'jump';
}

// Default configurations
export const DEFAULT_PAGINATION_CONFIG: NxPaginationConfig = {
    current: 1,
    total: 0,
    totalItems: 0,
    pageSize: 10,
    variant: 'default',
    size: 'default',
    showSizeChanger: false,
    showQuickJumper: false,
    showTotal: true,
    pageSizeOptions: [10, 20, 50, 100],
    disabled: false,
    simple: false
};

// Pagination layout configurations
export interface NxPaginationLayoutConfig {
    /** Number of page buttons to show on each side of current page */
    pageBufferSize?: number;
    /** Minimum number of pages to show before showing ellipsis */
    minPagesForEllipsis?: number;
    /** Whether to show first/last buttons */
    showFirstLast?: boolean;
    /** Whether to show prev/next buttons */
    showPrevNext?: boolean;
}

export const DEFAULT_PAGINATION_LAYOUT_CONFIG: NxPaginationLayoutConfig = {
    pageBufferSize: 2,
    minPagesForEllipsis: 7,
    showFirstLast: true,
    showPrevNext: true
};