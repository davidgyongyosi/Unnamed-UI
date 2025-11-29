import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SimpleTableColumn {
    key: string;
    title: string;
    width?: string;
    sortable?: boolean;
}

export type SimpleTableRow = Record<string, any>;

@Component({
    selector: 'nx-simple-table',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="nx-simple-table">
            <table class="nx-table" [class.nx-table-bordered]="bordered">
                <thead>
                    <tr>
                        <th *ngFor="let column of columns; trackBy: trackByKey"
                            [style.width]="column.width"
                            [class.nx-table-sortable]="column.sortable"
                            (click)="onSortClick(column)">
                            {{ column.title }}
                            <span *ngIf="column.sortable && sortKey === column.key" class="sort-indicator">
                                {{ sortDirection === 'asc' ? '↑' : '↓' }}
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr *ngIf="data.length === 0">
                        <td [attr.colspan]="columns.length" class="nx-table-empty">
                            {{ emptyText }}
                        </td>
                    </tr>
                    <tr *ngFor="let row of data; trackBy: trackByRow">
                        <td *ngFor="let column of columns; trackBy: trackByKey">
                            {{ row[column.key] }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `,
    styleUrls: ['./style/simple-table.component.scss']
})
export class SimpleTableComponent {
    @Input() data: SimpleTableRow[] = [];
    @Input() columns: SimpleTableColumn[] = [];
    @Input() bordered = false;
    @Input() emptyText = 'No data available';

    @Output() sortChange = new EventEmitter<{ key: string; direction: 'asc' | 'desc' }>();

    sortKey: string | null = null;
    sortDirection: 'asc' | 'desc' = 'asc';

    trackByKey(index: number, column: SimpleTableColumn): string {
        return column.key;
    }

    trackByRow(index: number, row: SimpleTableRow): any {
        return row;
    }

    onSortClick(column: SimpleTableColumn): void {
        if (!column.sortable) {
            return;
        }

        if (this.sortKey === column.key) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortKey = column.key;
            this.sortDirection = 'asc';
        }

        this.sortChange.emit({
            key: this.sortKey!,
            direction: this.sortDirection
        });

        this.sortData();
    }

    private sortData(): void {
        if (!this.sortKey) {
            return;
        }

        this.data.sort((a, b) => {
            const aValue = a[this.sortKey!];
            const bValue = b[this.sortKey!];

            if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }
}