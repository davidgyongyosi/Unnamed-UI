import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, Input, TemplateRef, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { TableComponent } from './table.component';
import { TableColumn, TableRow, TablePagination, TableSelection } from './table.types';
import { ButtonComponent } from '../button/button.component';
import { NxIconDirective } from '../icon/icon.directive';

// Mock dependencies
@Component({
    selector: 'nx-button',
    standalone: true,
    template: '<button><ng-content></ng-content></button>'
})
class MockButtonComponent {
    @Input() variant = 'default';
    @Input() size = 'default';
    @Input() disabled = false;
}

@Component({
    selector: 'span[nxIcon]',
    standalone: true,
    template: '<span class="mock-icon"></span>'
})
class MockIconDirective {
    @Input() nxIcon = '';
}

// Test host component
@Component({
    selector: 'nx-test-host',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, TableComponent, MockButtonComponent, MockIconDirective],
    template: `
        <nx-table
            [data]="data"
            [columns]="columns"
            [size]="size"
            [showHeader]="showHeader"
            [bordered]="bordered"
            [hoverable]="hoverable"
            [striped]="striped"
            [loading]="loading"
            [emptyText]="emptyText"
            [rowSelection]="rowSelection"
            [pagination]="pagination"
            (sortChange)="onSortChange($event)"
            (selectionChange)="onSelectionChange($event)"
            (pageChange)="onPageChange($event)"
            (rowClick)="onRowClick($event)">
        </nx-table>

        <!-- Template test -->
        <ng-template #customCell let-value let-record="record" let-column="column">
            <span class="custom-cell">{{ value }} ({{ column.key }})</span>
        </ng-template>

        <ng-template #customHeader let-column>
            <span class="custom-header">{{ column.title }} ↑</span>
        </ng-template>
    `
})
class TestHostComponent {
    data: TableRow[] = [
        { id: 1, name: 'John Doe', age: 30, email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com' },
        { id: 3, name: 'Bob Johnson', age: 35, email: 'bob@example.com' }
    ];

    columns: TableColumn[] = [
        { key: 'id', title: 'ID', width: '80px', sortable: true },
        { key: 'name', title: 'Name', sortable: true },
        { key: 'age', title: 'Age', width: '100px', sortable: true, align: 'center' },
        { key: 'email', title: 'Email', sortable: false }
    ];

    size = 'default';
    showHeader = true;
    bordered = false;
    hoverable = true;
    striped = false;
    loading = false;
    emptyText = 'No data';

    rowSelection: TableSelection = {
        selectedRowKeys: [],
        mode: 'multiple',
        rowKey: 'id',
        selectOnRowClick: false
    };

    pagination: TablePagination = {
        current: 1,
        pageSize: 10,
        total: 3,
        pageSizeOptions: [5, 10, 20]
    };

    sortChangeEvents: any[] = [];
    selectionChangeEvents: any[] = [];
    pageChangeEvents: any[] = [];
    rowClickEvents: any[] = [];

    onSortChange(event: any): void {
        this.sortChangeEvents.push(event);
    }

    onSelectionChange(event: any): void {
        this.selectionChangeEvents.push(event);
    }

    onPageChange(event: any): void {
        this.pageChangeEvents.push(event);
    }

    onRowClick(event: any): void {
        this.rowClickEvents.push(event);
    }

    @ViewChild('customCell') customCellTemplate!: TemplateRef<any>;
    @ViewChild('customHeader') customHeaderTemplate!: TemplateRef<any>;
}

describe('TableComponent', () => {
    let component: TableComponent;
    let fixture: ComponentFixture<TableComponent>;
    let hostFixture: ComponentFixture<TestHostComponent>;
    let hostComponent: TestHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                FormsModule,
                ReactiveFormsModule,
                TableComponent,
                MockButtonComponent,
                MockIconDirective,
                TestHostComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        hostFixture = TestBed.createComponent(TestHostComponent);
        hostComponent = hostFixture.componentInstance;
        hostFixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create test host', () => {
        expect(hostComponent).toBeTruthy();
    });

    describe('Basic Rendering', () => {
        it('should render table with data', () => {
            const tableElement = hostFixture.debugElement.query(By.css('.nx-table'));
            expect(tableElement).toBeTruthy();

            const rows = hostFixture.debugElement.queryAll(By.css('.nx-table-tbody .nx-table-row'));
            expect(rows.length).toBe(3);
        });

        it('should render table header when showHeader is true', () => {
            const headerElement = hostFixture.debugElement.query(By.css('.nx-table-thead'));
            expect(headerElement).toBeTruthy();

            const headerCells = hostFixture.debugElement.queryAll(By.css('.nx-table-header-cell'));
            expect(headerCells.length).toBe(4); // 4 columns
        });

        it('should not render table header when showHeader is false', () => {
            hostComponent.showHeader = false;
            hostFixture.detectChanges();

            const headerElement = hostFixture.debugElement.query(By.css('.nx-table-thead'));
            expect(headerElement).toBeFalsy();
        });

        it('should render empty state when no data', () => {
            hostComponent.data = [];
            hostFixture.detectChanges();

            const emptyRow = hostFixture.debugElement.query(By.css('.nx-table-empty-row'));
            expect(emptyRow).toBeTruthy();

            const emptyText = hostFixture.debugElement.query(By.css('.nx-table-empty-text'));
            expect(emptyText.nativeElement.textContent).toContain('No data');
        });

        it('should apply size classes correctly', () => {
            const tableElement = hostFixture.debugElement.query(By.css('.nx-table'));

            // Default size
            expect(tableElement.classes['nx-table-sm']).toBeFalsy();
            expect(tableElement.classes['nx-table-lg']).toBeFalsy();

            // Small size
            hostComponent.size = 'small';
            hostFixture.detectChanges();
            expect(tableElement.classes['nx-table-sm']).toBeTruthy();

            // Large size
            hostComponent.size = 'large';
            hostFixture.detectChanges();
            expect(tableElement.classes['nx-table-lg']).toBeTruthy();
        });

        it('should apply bordered class correctly', () => {
            const wrapperElement = hostFixture.debugElement.query(By.css('.nx-table-wrapper'));

            expect(wrapperElement.classes['nx-table-bordered']).toBeFalsy();

            hostComponent.bordered = true;
            hostFixture.detectChanges();

            expect(wrapperElement.classes['nx-table-bordered']).toBeTruthy();
        });

        it('should apply striped class correctly', () => {
            const wrapperElement = hostFixture.debugElement.query(By.css('.nx-table-wrapper'));

            expect(wrapperElement.classes['nx-table-striped']).toBeFalsy();

            hostComponent.striped = true;
            hostFixture.detectChanges();

            expect(wrapperElement.classes['nx-table-striped']).toBeTruthy();
        });
    });

    describe('Sorting Functionality', () => {
        it('should show sort indicators for sortable columns', () => {
            const sortableHeaders = hostFixture.debugElement.queryAll(By.css('.nx-table-sortable'));
            expect(sortableHeaders.length).toBe(3); // id, name, age are sortable

            const sortIcons = hostFixture.debugElement.queryAll(By.css('.nx-table-sort-icon'));
            expect(sortIcons.length).toBe(3);
        });

        it('should emit sort change event when clicking sortable column', () => {
            const nameHeader = hostFixture.debugElement.query(By.css('.nx-table-header-cell:nth-child(3)')); // name column
            nameHeader.nativeElement.click();
            hostFixture.detectChanges();

            expect(hostComponent.sortChangeEvents.length).toBe(1);
            expect(hostComponent.sortChangeEvents[0]).toEqual({
                column: 'name',
                direction: 'asc',
                multiple: [{ key: 'name', direction: 'asc' }]
            });
        });

        it('should cycle through sort directions', () => {
            const nameHeader = hostFixture.debugElement.query(By.css('.nx-table-header-cell:nth-child(3)'));

            // First click - asc
            nameHeader.nativeElement.click();
            hostFixture.detectChanges();
            expect(hostComponent.sortChangeEvents[0].direction).toBe('asc');

            // Second click - desc
            nameHeader.nativeElement.click();
            hostFixture.detectChanges();
            expect(hostComponent.sortChangeEvents[1].direction).toBe('desc');

            // Third click - null
            nameHeader.nativeElement.click();
            hostFixture.detectChanges();
            expect(hostComponent.sortChangeEvents[2].direction).toBeNull();
        });

        it('should apply sort classes correctly', () => {
            const nameHeader = hostFixture.debugElement.query(By.css('.nx-table-header-cell:nth-child(3)'));

            // Click to sort ascending
            nameHeader.nativeElement.click();
            hostFixture.detectChanges();

            expect(nameHeader.classes['nx-table-sort-active']).toBeTruthy();
            expect(nameHeader.classes['nx-table-sort-asc']).toBeTruthy();
            expect(nameHeader.classes['nx-table-sort-desc']).toBeFalsy();
        });

        it('should handle multi-column sort with shift key', () => {
            const idHeader = hostFixture.debugElement.query(By.css('.nx-table-header-cell:nth-child(2)')); // id column
            const nameHeader = hostFixture.debugElement.query(By.css('.nx-table-header-cell:nth-child(3)')); // name column

            // Sort by id first
            idHeader.nativeElement.click();
            hostFixture.detectChanges();

            // Shift+click to sort by name as well
            const clickEvent = new MouseEvent('click', { shiftKey: true });
            nameHeader.nativeElement.dispatchEvent(clickEvent);
            hostFixture.detectChanges();

            expect(hostComponent.sortChangeEvents.length).toBe(2);
            expect(hostComponent.sortChangeEvents[1].multiple.length).toBe(2);
        });
    });

    describe('Row Selection', () => {
        it('should render selection checkboxes when rowSelection is configured', () => {
            const selectionHeaders = hostFixture.debugElement.queryAll(By.css('.nx-table-selection-header'));
            const selectionCells = hostFixture.debugElement.queryAll(By.css('.nx-table-selection-cell'));

            expect(selectionHeaders.length).toBe(1);
            expect(selectionCells.length).toBe(3); // One for each row
        });

        it('should emit selection change when row checkbox is clicked', () => {
            const firstRowCheckbox = hostFixture.debugElement.query(By.css('.nx-table-selection-cell input[type="checkbox"]'));
            firstRowCheckbox.nativeElement.checked = true;
            firstRowCheckbox.nativeElement.dispatchEvent(new Event('change'));
            hostFixture.detectChanges();

            expect(hostComponent.selectionChangeEvents.length).toBe(1);
            expect(hostComponent.selectionChangeEvents[0].selectedRowKeys).toContain(1);
        });

        it('should handle select all functionality', () => {
            const selectAllCheckbox = hostFixture.debugElement.query(By.css('.nx-table-selection-header input[type="checkbox"]'));

            // Select all
            selectAllCheckbox.nativeElement.checked = true;
            selectAllCheckbox.nativeElement.dispatchEvent(new Event('change'));
            hostFixture.detectChanges();

            expect(hostComponent.selectionChangeEvents.length).toBe(1);
            expect(hostComponent.selectionChangeEvents[0].selectedRowKeys).toEqual([1, 2, 3]);
        });

        it('should show indeterminate state for partial selection', () => {
            // Select one row first
            const firstRowCheckbox = hostFixture.debugElement.query(By.css('.nx-table-selection-cell input[type="checkbox"]'));
            firstRowCheckbox.nativeElement.checked = true;
            firstRowCheckbox.nativeElement.dispatchEvent(new Event('change'));
            hostFixture.detectChanges();

            const selectAllCheckbox = hostFixture.debugElement.query(By.css('.nx-table-selection-header input[type="checkbox"]'));
            expect(selectAllCheckbox.nativeElement.indeterminate).toBeTruthy();
        });

        it('should handle row click selection when selectOnRowClick is true', () => {
            hostComponent.rowSelection.selectOnRowClick = true;
            hostFixture.detectChanges();

            const firstRow = hostFixture.debugElement.query(By.css('.nx-table-tbody .nx-table-row'));
            firstRow.nativeElement.click();
            hostFixture.detectChanges();

            expect(hostComponent.selectionChangeEvents.length).toBe(1);
            expect(hostComponent.selectionChangeEvents[0].selectedRowKeys).toContain(1);
        });

        it('should emit row click events', () => {
            const firstRow = hostFixture.debugElement.query(By.css('.nx-table-tbody .nx-table-row'));
            firstRow.nativeElement.click();
            hostFixture.detectChanges();

            expect(hostComponent.rowClickEvents.length).toBe(1);
            expect(hostComponent.rowClickEvents[0].record.id).toBe(1);
            expect(hostComponent.rowClickEvents[0].index).toBe(0);
        });
    });

    describe('Pagination', () => {
        it('should render pagination controls', () => {
            const paginationElement = hostFixture.debugElement.query(By.css('.nx-table-pagination'));
            expect(paginationElement).toBeTruthy();

            const pageInfo = hostFixture.debugElement.query(By.css('.nx-table-pagination-info'));
            expect(pageInfo.nativeElement.textContent).toContain('Showing 1-3 of 3 items');

            const pageButtons = hostFixture.debugElement.queryAll(By.css('nx-button'));
            expect(pageButtons.length).toBe(2); // Previous and Next buttons
        });

        it('should emit page change events', () => {
            const nextButton = hostFixture.debugElement.queryAll(By.css('nx-button'))[1]; // Next button
            nextButton.nativeElement.click();
            hostFixture.detectChanges();

            expect(hostComponent.pageChangeEvents.length).toBe(1);
            expect(hostComponent.pageChangeEvents[0].current).toBe(2);
        });

        it('should handle page size changes', () => {
            const sizeChanger = hostFixture.debugElement.query(By.css('.nx-table-size-changer'));
            sizeChanger.nativeElement.value = '5';
            sizeChanger.nativeElement.dispatchEvent(new Event('change'));
            hostFixture.detectChanges();

            expect(hostComponent.pageChangeEvents.length).toBe(1);
            expect(hostComponent.pageChangeEvents[0].pageSize).toBe(5);
        });

        it('should handle quick jumper input', () => {
            const jumperInput = hostFixture.debugElement.query(By.css('.nx-table-pagination-input'));
            jumperInput.nativeElement.value = '2';
            jumperInput.nativeElement.dispatchEvent(new Event('change'));
            hostFixture.detectChanges();

            expect(hostComponent.pageChangeEvents.length).toBe(1);
            expect(hostComponent.pageChangeEvents[0].current).toBe(2);
        });

        it('should disable pagination buttons appropriately', () => {
            const previousButton = hostFixture.debugElement.queryAll(By.css('nx-button'))[0];
            const nextButton = hostFixture.debugElement.queryAll(By.css('nx-button'))[1];

            // On first page, previous should be disabled
            expect(previousButton.nativeElement.disabled).toBeTruthy();
            expect(nextButton.nativeElement.disabled).toBeFalsy();

            // Go to last page
            hostComponent.pagination.current = 3;
            hostFixture.detectChanges();

            expect(previousButton.nativeElement.disabled).toBeFalsy();
            expect(nextButton.nativeElement.disabled).toBeTruthy();
        });
    });

    describe('Loading State', () => {
        it('should show loading overlay when loading is true', () => {
            hostComponent.loading = true;
            hostFixture.detectChanges();

            const loadingOverlay = hostFixture.debugElement.query(By.css('.nx-table-loading-overlay'));
            expect(loadingOverlay).toBeTruthy();

            const loadingSpinner = hostFixture.debugElement.query(By.css('.nx-table-loading-spinner'));
            expect(loadingSpinner).toBeTruthy();
        });

        it('should apply loading class to container', () => {
            hostComponent.loading = true;
            hostFixture.detectChanges();

            const container = hostFixture.debugElement.query(By.css('.nx-table-container'));
            expect(container.classes['nx-table-loading']).toBeTruthy();
        });
    });

    describe('Custom Templates', () => {
        it('should use custom cell templates when provided', () => {
            hostComponent.columns[0].cellTemplate = hostComponent.customCellTemplate;
            hostFixture.detectChanges();

            const customCells = hostFixture.debugElement.queryAll(By.css('.custom-cell'));
            expect(customCells.length).toBe(3);
            expect(customCells[0].nativeElement.textContent).toContain('1 (id)');
        });

        it('should use custom header templates when provided', () => {
            hostComponent.columns[0].headerTemplate = hostComponent.customHeaderTemplate;
            hostFixture.detectChanges();

            const customHeaders = hostFixture.debugElement.queryAll(By.css('.custom-header'));
            expect(customHeaders.length).toBe(1);
            expect(customHeaders[0].nativeElement.textContent).toContain('ID ↑');
        });
    });

    describe('Accessibility', () => {
        it('should have proper table structure', () => {
            const table = hostFixture.debugElement.query(By.css('.nx-table'));
            expect(table.nativeElement.getAttribute('role')).toBeFalsy(); // Native table has implicit role

            const thead = hostFixture.debugElement.query(By.css('.nx-table-thead'));
            expect(thead.nativeElement.tagName).toBe('THEAD');

            const tbody = hostFixture.debugElement.query(By.css('.nx-table-tbody'));
            expect(tbody.nativeElement.tagName).toBe('TBODY');
        });

        it('should have sortable headers with proper interactions', () => {
            const sortableHeaders = hostFixture.debugElement.queryAll(By.css('.nx-table-sortable'));
            expect(sortableHeaders.length).toBeGreaterThan(0);

            sortableHeaders.forEach(header => {
                expect(header.nativeElement.style.cursor).toBe('pointer');
            });
        });

        it('should have proper checkbox attributes for selection', () => {
            const checkboxes = hostFixture.debugElement.queryAll(By.css('input[type="checkbox"]'));
            expect(checkboxes.length).toBeGreaterThan(0);

            checkboxes.forEach(checkbox => {
                expect(checkbox.nativeElement.getAttribute('type')).toBe('checkbox');
            });
        });
    });

    describe('Responsive Behavior', () => {
        it('should handle horizontal scrolling', () => {
            const wrapper = hostFixture.debugElement.query(By.css('.nx-table-wrapper'));
            const table = hostFixture.debugElement.query(By.css('.nx-table'));

            // Set a fixed width to force horizontal scrolling
            table.nativeElement.style.width = '1500px';
            hostFixture.detectChanges();

            expect(wrapper.nativeElement.style.overflowX).toBe('auto');
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty columns array', () => {
            hostComponent.columns = [];
            hostFixture.detectChanges();

            const headerCells = hostFixture.debugElement.queryAll(By.css('.nx-table-header-cell'));
            expect(headerCells.length).toBe(0);
        });

        it('should handle null/undefined data', () => {
            hostComponent.data = [];
            hostFixture.detectChanges();

            const emptyState = hostFixture.debugElement.query(By.css('.nx-table-empty-row'));
            expect(emptyState).toBeTruthy();
        });

        it('should handle pagination with total less than pageSize', () => {
            hostComponent.pagination.total = 1;
            hostComponent.pagination.pageSize = 10;
            hostFixture.detectChanges();

            const pageInfo = hostFixture.debugElement.query(By.css('.nx-table-pagination-info'));
            expect(pageInfo.nativeElement.textContent).toContain('Showing 1-1 of 1 items');
        });

        it('should handle disabled rows in selection', () => {
            hostComponent.rowSelection.disabledRowKeys = [1, 2];
            hostFixture.detectChanges();

            const disabledCheckboxes = hostFixture.debugElement.queryAll(
                By.css('.nx-table-selection-cell input[type="checkbox"]:disabled')
            );
            expect(disabledCheckboxes.length).toBe(2);
        });
    });

    describe('Performance', () => {
        it('should handle large datasets efficiently', () => {
            // Create a large dataset
            const largeData: TableRow[] = [];
            for (let i = 1; i <= 1000; i++) {
                largeData.push({
                    id: i,
                    name: `User ${i}`,
                    age: 20 + (i % 50),
                    email: `user${i}@example.com`
                });
            }

            hostComponent.data = largeData;
            hostComponent.pagination.total = 1000;
            hostFixture.detectChanges();

            const rows = hostFixture.debugElement.queryAll(By.css('.nx-table-tbody .nx-table-row'));
            expect(rows.length).toBe(10); // Should only render current page
        });
    });
});