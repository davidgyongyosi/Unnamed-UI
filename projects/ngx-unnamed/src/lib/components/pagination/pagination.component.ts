import {
    Component,
    Input,
    Output,
    EventEmitter,
    computed,
    signal,
    inject,
    ChangeDetectionStrategy,
    Signal
} from '@angular/core';
import {
    NxPaginationConfig,
    NxPaginationContext,
    NxPaginationChangeEvent,
    NxPaginationPageEvent,
    NxPaginationVariant,
    NxPaginationSize,
    DEFAULT_PAGINATION_CONFIG,
    DEFAULT_PAGINATION_LAYOUT_CONFIG
} from './pagination.types';
import { NxIconComponent } from '../icon/icon.component';

@Component({
    selector: 'nx-pagination',
    standalone: true,
    imports: [NxIconComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div [class]="paginationClasses()" role="navigation" aria-label="Pagination navigation">
            <!-- Total items info -->
            @if (showTotal$() && totalItems$() > 0) {
                <div class="nx-pagination-total">
                    <span class="nx-pagination-total-text">
                        {{ getTotalText() }}
                    </span>
                </div>
            }

            <!-- Page size changer -->
            @if (showSizeChanger$() && !simple$()) {
                <div class="nx-pagination-sizer">
                    <select
                        [value]="pageSize$()"
                        [disabled]="disabled$()"
                        (change)="onPageSizeChange($event)"
                        class="nx-pagination-select"
                        aria-label="Page size">
                        @for (size of pageSizeOptions$(); track size) {
                            <option [value]="size">{{ size }} items/page</option>
                        }
                    </select>
                </div>
            }

            <!-- Pagination controls -->
            <ul class="nx-pagination-list" role="list">
                <!-- First page button -->
                @if (showFirstLast$() && !simple$()) {
                    <li class="nx-pagination-item">
                        <button
                            type="button"
                            class="nx-pagination-link"
                            [class.disabled]="!hasPrev$()"
                            [attr.aria-disabled]="!hasPrev$()"
                            [attr.aria-label]="'First page'"
                            (click)="onPageChange(1, 'first')"
                            [disabled]="!hasPrev$() || disabled$()">
                            <nx-icon type="caret-double-left" />
                        </button>
                    </li>
                }

                <!-- Previous page button -->
                @if (showPrevNext$()) {
                    <li class="nx-pagination-item">
                        <button
                            type="button"
                            class="nx-pagination-link"
                            [class.disabled]="!hasPrev$()"
                            [attr.aria-disabled]="!hasPrev$()"
                            [attr.aria-label]="'Previous page'"
                            (click)="onPageChange(currentPage$() - 1, 'prev')"
                            [disabled]="!hasPrev$() || disabled$()">
                            <nx-icon type="caret-left" />
                        </button>
                    </li>
                }

                <!-- Page numbers -->
                @if (!simple$()) {
                    @for (page of visiblePages$(); track page) {
                        <li class="nx-pagination-item">
                            @if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                                <span class="nx-pagination-ellipsis">...</span>
                            } @else {
                                <button
                                    type="button"
                                    class="nx-pagination-link"
                                    [class.active]="page === currentPage$()"
                                    [attr.aria-current]="page === currentPage$() ? 'page' : null"
                                    [attr.aria-label]="'Page ' + page"
                                    (click)="onPageChange(page, 'page')"
                                    [disabled]="disabled$()">
                                    {{ page }}
                                </button>
                            }
                        </li>
                    }
                }

                <!-- Simple pager -->
                @if (simple$()) {
                    <li class="nx-pagination-item">
                        <span class="nx-pagination-simple">
                            <input
                                type="number"
                                [value]="currentPage$()"
                                [min]="1"
                                [max]="totalPages$()"
                                [disabled]="disabled$()"
                                (change)="onSimplePageChange($event)"
                                class="nx-pagination-simple-input"
                                aria-label="Page number" />
                            <span class="nx-pagination-simple-divider">/</span>
                            <span class="nx-pagination-simple-total">{{ totalPages$() }}</span>
                        </span>
                    </li>
                }

                <!-- Next page button -->
                @if (showPrevNext$()) {
                    <li class="nx-pagination-item">
                        <button
                            type="button"
                            class="nx-pagination-link"
                            [class.disabled]="!hasNext$()"
                            [attr.aria-disabled]="!hasNext$()"
                            [attr.aria-label]="'Next page'"
                            (click)="onPageChange(currentPage$() + 1, 'next')"
                            [disabled]="!hasNext$() || disabled$()">
                            <nx-icon type="caret-right" />
                        </button>
                    </li>
                }

                <!-- Last page button -->
                @if (showFirstLast$() && !simple$()) {
                    <li class="nx-pagination-item">
                        <button
                            type="button"
                            class="nx-pagination-link"
                            [class.disabled]="!hasNext$()"
                            [attr.aria-disabled]="!hasNext$()"
                            [attr.aria-label]="'Last page'"
                            (click)="onPageChange(totalPages$(), 'last')"
                            [disabled]="!hasNext$() || disabled$()">
                            <nx-icon type="caret-double-right" />
                        </button>
                    </li>
                }
            </ul>

                <!-- Quick jumper -->
                @if (showQuickJumper$() && !simple$()) {
                    <div class="nx-pagination-jumper">
                        <span class="nx-pagination-jumper-text">Go to</span>
                        <input
                            type="number"
                            [value]="currentPage$()"
                            [min]="1"
                            [max]="totalPages$()"
                            [disabled]="disabled$()"
                            (change)="onQuickJump($event)"
                            class="nx-pagination-jumper-input"
                            aria-label="Go to page" />
                    </div>
                }
            </div>
        `,
        styles: [`
            :host {
                display: block;
                width: 100%;
            }

            .nx-pagination {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                flex-wrap: wrap;
                gap: 8px;
                margin: 0;
                padding: 0;
                list-style: none;
                font-size: 14px;
                line-height: 1.5715;
            }

            .nx-pagination-list {
                display: flex;
                align-items: center;
                margin: 0;
                padding: 0;
                list-style: none;
                gap: 4px;
            }

            .nx-pagination-item {
                display: flex;
                align-items: center;
            }

            .nx-pagination-link {
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: 32px;
                height: 32px;
                padding: 0 8px;
                margin: 0;
                border: 1px solid #d9d9d9;
                border-radius: 6px;
                background: #fff;
                color: rgba(0, 0, 0, 0.88);
                font-size: 14px;
                font-weight: 500;
                text-decoration: none;
                cursor: pointer;
                transition: all 0.2s;
                user-select: none;
            }

            .nx-pagination-link:hover:not(.disabled) {
                border-color: #1677ff;
                color: #1677ff;
            }

            .nx-pagination-link.active {
                background: #1677ff;
                border-color: #1677ff;
                color: #fff;
            }

            .nx-pagination-link.disabled {
                background: #f5f5f5;
                border-color: #d9d9d9;
                color: rgba(0, 0, 0, 0.25);
                cursor: not-allowed;
            }

            .nx-pagination-ellipsis {
                min-width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: rgba(0, 0, 0, 0.25);
                user-select: none;
            }

            .nx-pagination-simple {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .nx-pagination-simple-input {
                width: 50px;
                height: 32px;
                padding: 4px 8px;
                border: 1px solid #d9d9d9;
                border-radius: 6px;
                text-align: center;
                font-size: 14px;
            }

            .nx-pagination-simple-divider {
                color: rgba(0, 0, 0, 0.25);
                margin: 0 4px;
            }

            .nx-pagination-simple-total {
                color: rgba(0, 0, 0, 0.88);
                font-weight: 500;
            }

            .nx-pagination-total {
                color: rgba(0, 0, 0, 0.88);
                font-size: 14px;
            }

            .nx-pagination-sizer {
                margin-right: 8px;
            }

            .nx-pagination-select {
                height: 32px;
                padding: 4px 8px;
                border: 1px solid #d9d9d9;
                border-radius: 6px;
                background: #fff;
                font-size: 14px;
            }

            .nx-pagination-jumper {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-left: 8px;
            }

            .nx-pagination-jumper-text {
                color: rgba(0, 0, 0, 0.88);
                font-size: 14px;
            }

            .nx-pagination-jumper-input {
                width: 50px;
                height: 32px;
                padding: 4px 8px;
                border: 1px solid #d9d9d9;
                border-radius: 6px;
                text-align: center;
                font-size: 14px;
            }

            /* Size variants */
            .nx-pagination.small .nx-pagination-link,
            .nx-pagination.small .nx-pagination-simple-input,
            .nx-pagination.small .nx-pagination-select,
            .nx-pagination.small .nx-pagination-jumper-input {
                min-width: 24px;
                height: 24px;
                padding: 0 6px;
                font-size: 12px;
            }

            .nx-pagination.large .nx-pagination-link,
            .nx-pagination.large .nx-pagination-simple-input,
            .nx-pagination.large .nx-pagination-select,
            .nx-pagination.large .nx-pagination-jumper-input {
                min-width: 40px;
                height: 40px;
                padding: 0 12px;
                font-size: 16px;
            }

            /* Responsive */
            @media (max-width: 768px) {
                .nx-pagination {
                    justify-content: center;
                }

                .nx-pagination-total,
                .nx-pagination-sizer,
                .nx-pagination-jumper {
                    display: none;
                }
            }
        `]
})
export class NxPaginationComponent {
    /** Pagination configuration */
    @Input({ required: false })
    set config(value: NxPaginationConfig) {
        this.configSignal.set(value);
    }

    /** Current page number */
    @Input()
    set current(value: number) {
        this.currentSignal.set(value);
    }

    /** Total number of pages */
    @Input()
    set total(value: number) {
        this.totalSignal.set(value);
    }

    /** Total number of items */
    @Input()
    set totalItems(value: number) {
        this.totalItemsSignal.set(value);
    }

    /** Page size */
    @Input()
    set pageSize(value: number) {
        this.pageSizeSignal.set(value);
    }

    /** Pagination variant */
    @Input()
    set variant(value: NxPaginationVariant) {
        this.variantSignal.set(value);
    }

    /** Pagination size */
    @Input()
    set size(value: NxPaginationSize) {
        this.sizeSignal.set(value);
    }

    /** Whether to show page size selector */
    @Input()
    set showSizeChanger(value: boolean) {
        this.showSizeChangerSignal.set(value);
    }

    /** Whether to show quick jumper */
    @Input()
    set showQuickJumper(value: boolean) {
        this.showQuickJumperSignal.set(value);
    }

    /** Whether to show total items count */
    @Input()
    set showTotal(value: boolean) {
        this.showTotalSignal.set(value);
    }

    /** Available page sizes */
    @Input()
    set pageSizeOptions(value: number[]) {
        this.pageSizeOptionsSignal.set(value);
    }

    /** Whether pagination is disabled */
    @Input()
    set disabled(value: boolean) {
        this.disabledSignal.set(value);
    }

    /** Whether to show simple pagination */
    @Input()
    set simple(value: boolean) {
        this.simpleSignal.set(value);
    }

    /** Events */
    @Output() pageChange = new EventEmitter<NxPaginationPageEvent>();
    @Output() change = new EventEmitter<NxPaginationChangeEvent>();

    /** Internal signals */
    private configSignal = signal<NxPaginationConfig | null>(null);
    private currentSignal = signal<number>(1);
    private totalSignal = signal<number>(0);
    private totalItemsSignal = signal<number>(0);
    private pageSizeSignal = signal<number>(10);
    private variantSignal = signal<NxPaginationVariant>('default');
    private sizeSignal = signal<NxPaginationSize>('default');
    private showSizeChangerSignal = signal<boolean>(false);
    private showQuickJumperSignal = signal<boolean>(false);
    private showTotalSignal = signal<boolean>(true);
    private pageSizeOptionsSignal = signal<number[]>([10, 20, 50, 100]);
    private disabledSignal = signal<boolean>(false);
    private simpleSignal = signal<boolean>(false);

    /** Computed signals for reactive properties */
    currentConfig = computed(() => {
        const config = this.configSignal();
        return {
            ...DEFAULT_PAGINATION_CONFIG,
            ...config,
            current: this.currentSignal(),
            total: this.totalSignal(),
            totalItems: this.totalItemsSignal(),
            pageSize: this.pageSizeSignal(),
            variant: this.variantSignal(),
            size: this.sizeSignal(),
            showSizeChanger: this.showSizeChangerSignal(),
            showQuickJumper: this.showQuickJumperSignal(),
            showTotal: this.showTotalSignal(),
            pageSizeOptions: this.pageSizeOptionsSignal(),
            disabled: this.disabledSignal(),
            simple: this.simpleSignal()
        };
    });

    currentPage$ = computed(() => this.currentConfig().current || 1);
    total$ = computed(() => this.currentConfig().total || 0);
    totalItems$ = computed(() => this.currentConfig().totalItems || 0);
    pageSize$ = computed(() => this.currentConfig().pageSize || 10);
    variant$ = computed(() => this.currentConfig().variant || 'default');
    size$ = computed(() => this.currentConfig().size || 'default');
    showSizeChanger$ = computed(() => this.currentConfig().showSizeChanger || false);
    showQuickJumper$ = computed(() => this.currentConfig().showQuickJumper || false);
    showTotal$ = computed(() => this.currentConfig().showTotal !== false && this.currentConfig().variant !== 'mini');
    pageSizeOptions$ = computed(() => this.currentConfig().pageSizeOptions || [10, 20, 50, 100]);
    disabled$ = computed(() => this.currentConfig().disabled || false);
    simple$ = computed(() => this.currentConfig().simple || this.currentConfig().variant === 'simple');

    /** Computed pagination state */
    totalPages$ = computed(() => {
        const total = this.total$();
        const totalItems = this.totalItems$();
        const pageSize = this.pageSize$();

        if (total > 0) {
            return total;
        }

        return Math.max(1, Math.ceil(totalItems / pageSize));
    });

    hasPrev$ = computed(() => this.currentPage$() > 1);
    hasNext$ = computed(() => this.currentPage$() < this.totalPages$());

    showFirstLast$ = computed(() => this.totalPages$() > (DEFAULT_PAGINATION_LAYOUT_CONFIG.minPagesForEllipsis || 7) && !this.simple$());
    showPrevNext$ = computed(() => true);

    startItem$ = computed(() => {
        const currentPage = this.currentPage$();
        const pageSize = this.pageSize$();
        return (currentPage - 1) * pageSize + 1;
    });

    endItem$ = computed(() => {
        const currentPage = this.currentPage$();
        const pageSize = this.pageSize$();
        const totalItems = this.totalItems$();
        const totalPages = this.totalPages$();

        if (currentPage === totalPages && totalItems > 0) {
            return totalItems;
        }

        return currentPage * pageSize;
    });

    visiblePages$ = computed(() => {
        const currentPage = this.currentPage$();
        const totalPages = this.totalPages$();
        const bufferSize = DEFAULT_PAGINATION_LAYOUT_CONFIG.pageBufferSize || 2;
        const minPagesForEllipsis = DEFAULT_PAGINATION_LAYOUT_CONFIG.minPagesForEllipsis || 7;

        if (totalPages <= minPagesForEllipsis) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = [];

        // Always show first page
        pages.push(1);

        // Show ellipsis if needed
        if (currentPage > bufferSize + 2) {
            pages.push('ellipsis-start');
        }

        // Calculate range around current page
        const start = Math.max(2, currentPage - bufferSize);
        const end = Math.min(totalPages - 1, currentPage + bufferSize);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // Show ellipsis if needed
        if (currentPage < totalPages - bufferSize - 1) {
            pages.push('ellipsis-end');
        }

        // Always show last page
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    });

    /** Generate CSS classes for the pagination */
    paginationClasses = computed(() => {
        const config = this.currentConfig();
        const classes = ['nx-pagination'];

        // Size classes
        if (config.size !== 'default') {
            classes.push(`nx-pagination-${config.size}`);
        }

        // State classes
        if (config.disabled) {
            classes.push('nx-pagination-disabled');
        }

        if (config.simple) {
            classes.push('nx-pagination-simple');
        }

        return classes.join(' ');
    });

    /** Event handlers */
    onPageChange(page: number | string, type: NxPaginationPageEvent['type']): void {
        const pageNumber = typeof page === 'number' ? page : parseInt(page.toString(), 10);

        if (this.disabled$() || isNaN(pageNumber) || pageNumber < 1 || pageNumber > this.totalPages$()) {
            return;
        }

        this.currentSignal.set(pageNumber);
        this.pageChange.emit({ page: pageNumber, type });
        this.change.emit({ page: pageNumber, pageSize: this.pageSize$(), type: 'page' });
    }

    onPageSizeChange(event: Event): void {
        const select = event.target as HTMLSelectElement;
        const newPageSize = parseInt(select.value, 10);

        if (newPageSize === this.pageSize$()) {
            return;
        }

        // Calculate new current page based on new page size
        const currentStartItem = this.startItem$();
        const newCurrentPage = Math.max(1, Math.ceil(currentStartItem / newPageSize));

        this.pageSizeSignal.set(newPageSize);
        this.currentSignal.set(newCurrentPage);

        this.change.emit({
            page: newCurrentPage,
            pageSize: newPageSize,
            type: 'size'
        });
    }

    onSimplePageChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        const newPage = parseInt(input.value, 10);

        if (!isNaN(newPage)) {
            this.onPageChange(newPage, 'page');
        }
    }

    onQuickJump(event: Event): void {
        const input = event.target as HTMLInputElement;
        const newPage = parseInt(input.value, 10);

        if (!isNaN(newPage)) {
            this.onPageChange(newPage, 'jump');
        }
    }

    /** Helper methods */
    getTotalText(): string {
        const totalItems = this.totalItems$();
        const startItem = this.startItem$();
        const endItem = this.endItem$();

        if (totalItems === 0) {
            return 'No items';
        }

        return `${startItem}-${endItem} of ${totalItems} items`;
    }

    /** Pagination context for child components */
    paginationContext: Signal<NxPaginationContext> = computed(() => ({
        pagination: this.currentConfig(),
        currentPage: this.currentPage$(),
        totalPages: this.totalPages$(),
        pages: this.visiblePages$().filter(p => typeof p === 'number') as number[],
        showFirst: this.showFirstLast$(),
        showLast: this.showFirstLast$(),
        hasPrev: this.hasPrev$(),
        hasNext: this.hasNext$(),
        startItem: this.startItem$(),
        endItem: this.endItem$()
    }));
}