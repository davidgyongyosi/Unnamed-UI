import {
    Component,
    computed,
    EventEmitter,
    inject,
    input,
    OnDestroy,
    Output,
    signal,
    TemplateRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime } from 'rxjs';
import { ButtonComponent } from '../button/button.component';
import { NxIconDirective } from '../icon/icon.directive';
import { ResponsiveUtility } from '../../utils/responsive.utility';
import {
    TableColumn,
    TableRow,
    TableSort,
    TablePagination,
    TableSelection,
    TableSortEvent,
    TableSelectionEvent,
    TablePageChangeEvent,
    TableRowClickEvent,
    NxTableSize,
    NxTableSortDirection,
    NxTableSelectionMode,
    NxTableCellTemplateContext
} from './table.types';
import { TableColumnComponent } from './table-column.component';

@Component({
    selector: 'nx-table',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgTemplateOutlet
    ],
    template: `
        <div class="nx-table-container" [class.nx-table-loading]="loading()">
            <!-- Loading overlay -->
            <div *ngIf="loading()" class="nx-table-loading-overlay">
                <div class="nx-table-loading-spinner"></div>
            </div>

            <!-- Table wrapper -->
            <div class="nx-table-wrapper" [class.nx-table-bordered]="bordered"
                 [class.nx-table-striped]="striped" [class.nx-table-hoverable]="hoverable">

                <!-- Table element -->
                <table class="nx-table" [class.nx-table-sm]="size() === 'small'"
                       [class.nx-table-lg]="size() === 'large'">

                    <!-- Table header -->
                    <thead *ngIf="showHeader() && columns().length > 0" class="nx-table-thead">
                        <tr class="nx-table-row">
                            <!-- Selection column header -->
                            <th *ngIf="rowSelection()?.mode === 'multiple'"
                                class="nx-table-cell nx-table-selection-header">
                                <input type="checkbox"
                                       class="nx-checkbox"
                                       [checked]="allRowsSelected()"
                                       [indeterminate]="someRowsSelected()"
                                       (change)="onSelectAllChangeHandler($event)"
                                       [disabled]="loading()">
                            </th>

                            <!-- Column headers -->
                            <th *ngFor="let column of visibleColumns(); trackBy: trackByKey"
                                class="nx-table-cell nx-table-header-cell"
                                [class.nx-table-sortable]="column.sortable"
                                [class.nx-table-sort-active]="isSortActive(column.key)"
                                [class.nx-table-sort-asc]="getSortDirection(column.key) === 'asc'"
                                [class.nx-table-sort-desc]="getSortDirection(column.key) === 'desc'"
                                [style.width]="column.width"
                                [style.min-width]="column.minWidth"
                                [style.max-width]="column.maxWidth"
                                [style.text-align]="column.align || 'left'"
                                (click)="onSortClick($event, column)">

                                <!-- Custom header template -->
                                <ng-container *ngIf="column.headerTemplate"
                                             [ngTemplateOutlet]="column.headerTemplate"
                                             [ngTemplateOutletContext]="{ column: column }"></ng-container>

                                <span *ngIf="!column.headerTemplate" class="nx-table-header-title">{{ column.title }}</span>

                                <!-- Sort indicator -->
                                <span *ngIf="column.sortable" class="nx-table-sort-icon">
                                    ↑
                                </span>
                            </th>
                        </tr>
                    </thead>

                    <!-- Table body -->
                    <tbody class="nx-table-tbody">
                        <tr *ngIf="paginatedData().length === 0 && !loading()"
                            class="nx-table-row nx-table-empty-row">
                            <td class="nx-table-cell nx-table-empty-cell" [attr.colspan]="totalColumns()">
                                <div class="nx-table-empty">
                                    <span class="nx-table-empty-icon">📦</span>
                                    <span class="nx-table-empty-text">{{ emptyText() }}</span>
                                </div>
                            </td>
                        </tr>

                        <tr *ngFor="let row of paginatedData(); trackBy: trackByRowKey; let rowIndex = index"
                            class="nx-table-row"
                            [class.nx-table-row-selected]="isRowSelected(getRowKey(row))"
                            [class.nx-table-row-disabled]="isRowDisabled(getRowKey(row))"
                            (click)="onRowClick(row, rowIndex, $event)">

                            <!-- Selection column cell -->
                            <td *ngIf="rowSelection()?.mode === 'multiple'"
                                class="nx-table-cell nx-table-selection-cell">
                                <input type="checkbox"
                                       class="nx-checkbox"
                                       [checked]="isRowSelected(getRowKey(row))"
                                       [disabled]="isRowDisabled(getRowKey(row)) || loading()"
                                       (change)="onRowSelectChangeHandler(getRowKey(row), $event)">
                            </td>

                            <!-- Data cells -->
                            <td *ngFor="let column of visibleColumns(); trackBy: trackByKey"
                                class="nx-table-cell"
                                [style.text-align]="column.align || 'left'">

                                <!-- Custom cell template -->
                                <ng-container *ngIf="column.cellTemplate"
                                             [ngTemplateOutlet]="column.cellTemplate"
                                             [ngTemplateOutletContext]="{
                                                 $implicit: row[column.key],
                                                 record: row,
                                                 column: column,
                                                 index: rowIndex
                                             }"></ng-container>

                                <span *ngIf="!column.cellTemplate" class="nx-table-cell-content">{{ row[column.key] }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div *ngIf="showPagination() && paginationConfig()" class="nx-table-pagination">
                @let pagination = paginationConfig();
                <div class="nx-table-pagination-left">
                    <select *ngIf="pagination?.showSizeChanger"
                            class="nx-table-size-changer"
                            [value]="pagination?.pageSize"
                            (change)="onPageSizeChange($event)">
                        <option *ngFor="let size of pagination?.pageSizeOptions; trackBy: trackByValue"
                                [value]="size">{{ size }} items/page</option>
                    </select>

                    <span class="nx-table-pagination-info">
                        Showing {{ (pagination!.current - 1) * pagination!.pageSize + 1 }}-
                        {{ min(pagination!.current * pagination!.pageSize, pagination!.total) }}
                        of {{ pagination!.total }} items
                    </span>
                </div>

                <div class="nx-table-pagination-right">
                    <button class="nx-button nx-button-variant-outline nx-button-size-small"
                            [disabled]="pagination!.current <= 1"
                            (click)="onPageChange(pagination!.current - 1)">
                        ←
                    </button>

                    <span *ngIf="!pagination?.showQuickJumper" class="nx-table-pagination-current">
                        {{ pagination!.current }} / {{ getTotalPages() }}
                    </span>

                    <div *ngIf="pagination?.showQuickJumper" class="nx-table-pagination-jumper">
                        Page
                        <input type="number"
                               class="nx-table-pagination-input"
                               [value]="pagination!.current"
                               (change)="onQuickJumpHandler($event)"
                               [min]="1"
                               [max]="getTotalPages()">
                        of {{ getTotalPages() }}
                    </div>

                    <button class="nx-button nx-button-variant-outline nx-button-size-small"
                            [disabled]="pagination!.current >= getTotalPages()"
                            (click)="onPageChange(pagination!.current + 1)">
                        →
                    </button>
                </div>
            </div>
        </div>
    `,
    styleUrl: './style/table.component.scss',
    host: {
        '[class.nx-table-wrapper-external]': 'true'
    }
})
export class TableComponent implements OnDestroy {
    private responsiveUtility = inject(ResponsiveUtility);
    private destroy$ = new Subject<void>();

    // Inputs
    data = input<TableRow[]>([]);
    columns = input<TableColumn[]>([]);
    size = input<NxTableSize>('default');
    showHeader = input<boolean>(true);
    bordered = input<boolean>(false);
    hoverable = input<boolean>(true);
    striped = input<boolean>(false);
    loading = input<boolean>(false);
    emptyText = input<string>('No data');
    rowSelection = input<TableSelection>();
    pagination = input<TablePagination | false>();
    scroll = input<{ x?: string; y?: string }>();

    // Outputs
    sortChange = new EventEmitter<TableSortEvent>();
    selectionChange = new EventEmitter<TableSelectionEvent>();
    pageChange = new EventEmitter<TablePageChangeEvent>();
    rowClick = new EventEmitter<TableRowClickEvent>();

    // Internal state
    private internalSort = signal<TableSort[]>([]);
    private internalSelection = signal<any[]>([]);

    // Computed properties
    visibleColumns = computed(() => {
        return this.columns().filter(col => col.visible !== false);
    });

    sortedData = computed(() => {
        const sortedData = [...this.data()];
        const sortConfigs = this.internalSort();

        if (sortConfigs.length === 0) {
            return sortedData;
        }

        // Apply sorting for each sort configuration
        return sortedData.sort((a, b) => {
            for (const sort of sortConfigs) {
                const { key, direction } = sort;
                if (direction) {
                    const aValue = a[key];
                    const bValue = b[key];

                    let comparison = 0;
                    if (aValue < bValue) comparison = -1;
                    if (aValue > bValue) comparison = 1;

                    if (direction === 'desc') {
                        comparison = -comparison;
                    }

                    return comparison;
                }
            }
            return 0;
        });
    });

    paginatedData = computed(() => {
        const pagination = this.pagination();
        if (!pagination) {
            return this.sortedData();
        }

        const { current, pageSize } = pagination;
        const startIndex = (current - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        return this.sortedData().slice(startIndex, endIndex);
    });

    allRowsSelected = computed(() => {
        if (!this.rowSelection() || !this.paginatedData().length) {
            return false;
        }

        const selectableRows = this.paginatedData().filter(row =>
            !this.isRowDisabled(this.getRowKey(row))
        );

        return selectableRows.every(row =>
            this.isRowSelected(this.getRowKey(row))
        );
    });

    someRowsSelected = computed(() => {
        if (!this.rowSelection() || !this.paginatedData().length) {
            return false;
        }

        const selectedCount = this.paginatedData().filter(row =>
            this.isRowSelected(this.getRowKey(row))
        ).length;

        return selectedCount > 0 && selectedCount < this.paginatedData().length;
    });

    showPagination = computed(() => {
        const pagination = this.pagination();
        return pagination !== false && pagination && pagination.total > pagination.pageSize;
    });

    // Helper for template access to pagination
    paginationConfig = computed(() => {
        const pagination = this.pagination();
        return pagination !== false ? pagination : null;
    });

    // Methods
    getRowKey(row: TableRow): any {
        if (!this.rowSelection()) {
            return row;
        }
        return row[this.rowSelection()!.rowKey] || row;
    }

    isRowSelected(key: any): boolean {
        return this.internalSelection().includes(key);
    }

    isRowDisabled(key: any): boolean {
        return this.rowSelection()?.disabledRowKeys?.includes(key) || false;
    }

    totalColumns(): number {
        let count = this.visibleColumns().length;
        if (this.rowSelection() && this.rowSelection()!.mode === 'multiple') {
            count++;
        }
        return count;
    }

    // Helper for Math.min in template
    min = (a: number, b: number) => Math.min(a, b);

    // TrackBy functions for ngFor
    trackByKey(index: number, column: TableColumn): string {
        return column.key;
    }

    trackByRowKey(index: number, row: TableRow): any {
        return this.getRowKey(row);
    }

    trackByValue(index: number, value: any): any {
        return value;
    }

    isSortActive(columnKey: string): boolean {
        return this.internalSort().some(sort => sort.key === columnKey);
    }

    getSortDirection(columnKey: string): NxTableSortDirection {
        const sort = this.internalSort().find(s => s.key === columnKey);
        return sort?.direction || null;
    }

    getTotalPages(): number {
        const pagination = this.pagination();
        if (!pagination) {
            return 1;
        }
        return Math.ceil(pagination.total / pagination.pageSize);
    }

    // Event handlers
    onSelectAllChangeHandler(event: Event): void {
        this.onSelectAllChange(event);
    }

    onRowSelectChangeHandler(key: any, event: Event): void {
        this.onRowSelectChange(key, event);
    }

    onQuickJumpHandler(event: Event): void {
        this.onQuickJump(event);
    }

    onSortClick(event: MouseEvent, column: TableColumn): void {
        if (!column.sortable || this.loading()) {
            return;
        }

        event.preventDefault();
        const currentDirection = this.getSortDirection(column.key);
        let newDirection: NxTableSortDirection;

        // Cycle through: null -> asc -> desc -> null
        if (currentDirection === null) {
            newDirection = 'asc';
        } else if (currentDirection === 'asc') {
            newDirection = 'desc';
        } else {
            newDirection = null;
        }

        // Update sort state
        if (event.shiftKey && this.internalSort().length > 0) {
            // Multi-column sort
            const newSort = this.internalSort().filter(s => s.key !== column.key);
            if (newDirection) {
                newSort.push({ key: column.key, direction: newDirection });
            }
            this.internalSort.set(newSort);
        } else {
            // Single column sort
            this.internalSort.set(newDirection ? [{ key: column.key, direction: newDirection }] : []);
        }

        // Emit sort change event
        this.sortChange.emit({
            column: column.key,
            direction: newDirection,
            multiple: this.internalSort()
        });
    }

    onRowSelectChange(key: any, event: Event): void {
        event.stopPropagation();
        const checkbox = event.target as HTMLInputElement;
        const checked = checkbox.checked;

        let newSelection: any[];
        if (checked) {
            newSelection = [...this.internalSelection(), key];
        } else {
            newSelection = this.internalSelection().filter(k => k !== key);
        }

        this.internalSelection.set(newSelection);
        this.emitSelectionChange();
    }

    onSelectAllChange(event: Event): void {
        const checkbox = event.target as HTMLInputElement;
        const checked = checkbox.checked;

        let newSelection: any[];
        if (checked) {
            // Select all non-disabled rows
            const allKeys = this.paginatedData()
                .filter(row => !this.isRowDisabled(this.getRowKey(row)))
                .map(row => this.getRowKey(row));
            newSelection = [...new Set([...this.internalSelection(), ...allKeys])];
        } else {
            // Deselect all rows on current page
            const pageKeys = this.paginatedData().map(row => this.getRowKey(row));
            newSelection = this.internalSelection().filter(key => !pageKeys.includes(key));
        }

        this.internalSelection.set(newSelection);
        this.emitSelectionChange();
    }

    onRowClick(row: TableRow, index: number, event: MouseEvent): void {
        this.rowClick.emit({
            record: row,
            index,
            event
        });

        // Handle row selection if enabled
        if (this.rowSelection()?.selectOnRowClick && !this.isRowDisabled(this.getRowKey(row))) {
            const key = this.getRowKey(row);
            const isSelected = this.isRowSelected(key);

            let newSelection: any[];
            if (this.rowSelection()!.mode === 'single') {
                newSelection = isSelected ? [] : [key];
            } else {
                if (isSelected) {
                    newSelection = this.internalSelection().filter(k => k !== key);
                } else {
                    newSelection = [...this.internalSelection(), key];
                }
            }

            this.internalSelection.set(newSelection);
            this.emitSelectionChange();
        }
    }

    onPageChange(page: number): void {
        const pagination = this.pagination();
        if (page < 1 || page > this.getTotalPages() || !pagination) {
            return;
        }

        this.pageChange.emit({
            current: page,
            pageSize: pagination.pageSize
        });
    }

    onPageSizeChange(event: Event): void {
        const select = event.target as HTMLSelectElement;
        const newPageSize = parseInt(select.value, 10);

        const pagination = this.pagination();
        if (!pagination) {
            return;
        }

        // Calculate new page number to maintain relative position
        const currentStart = (pagination.current - 1) * pagination.pageSize;
        const newPage = Math.floor(currentStart / newPageSize) + 1;

        this.pageChange.emit({
            current: Math.max(1, newPage),
            pageSize: newPageSize
        });
    }

    onQuickJump(event: Event): void {
        const input = event.target as HTMLInputElement;
        const page = parseInt(input.value, 10);

        const pagination = this.pagination();
        if (page >= 1 && page <= this.getTotalPages()) {
            this.onPageChange(page);
        } else if (pagination) {
            // Reset to current page if invalid
            input.value = pagination.current.toString();
        }
    }

    private emitSelectionChange(): void {
        if (!this.rowSelection()) {
            return;
        }

        const selectedRows = this.data().filter(row =>
            this.isRowSelected(this.getRowKey(row))
        );

        this.selectionChange.emit({
            selectedRowKeys: this.internalSelection(),
            selectedRows,
            selected: false, // Not applicable for multi-selection change
            row: undefined
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}