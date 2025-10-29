import { Component, computed, input, TemplateRef } from '@angular/core';
import { TableColumn, NxTableAlign } from './table.types';

@Component({
    selector: 'nx-table-column',
    standalone: true,
    template: `
        <!-- Column definition component - no visible output -->
        <ng-content></ng-content>
    `
})
export class TableColumnComponent {
    // Column definition inputs
    key = input.required<string>();
    title = input<string>('');
    width = input<string>('');
    minWidth = input<string>('');
    maxWidth = input<string>('');
    align = input<NxTableAlign>('left');
    sortable = input<boolean>(false);
    fixed = input<'left' | 'right'>();
    visible = input<boolean>(true);
    resizable = input<boolean>(false);

    // Template references
    headerTemplate = input<TemplateRef<any>>();
    cellTemplate = input<TemplateRef<any>>();

    // Computed property to get column definition
    columnDef = computed<TableColumn>(() => ({
        key: this.key(),
        title: this.title() || this.key(),
        width: this.width(),
        minWidth: this.minWidth(),
        maxWidth: this.maxWidth(),
        align: this.align(),
        sortable: this.sortable(),
        fixed: this.fixed(),
        visible: this.visible(),
        resizable: this.resizable(),
        headerTemplate: this.headerTemplate(),
        cellTemplate: this.cellTemplate()
    }));
}