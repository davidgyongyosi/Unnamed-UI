import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { action } from '@storybook/addon-actions';
import { TableComponent } from './table.component';
import { TableColumn, TableRow, TablePagination, TableSelection } from './table.types';
import { ButtonComponent } from '../button/button.component';
import { NxIconDirective } from '../icon/icon.directive';

// Mock data
const sampleData: TableRow[] = [
    { id: 1, name: 'John Doe', age: 32, email: 'john.doe@example.com', status: 'Active', salary: 75000 },
    { id: 2, name: 'Jane Smith', age: 28, email: 'jane.smith@example.com', status: 'Active', salary: 82000 },
    { id: 3, name: 'Bob Johnson', age: 45, email: 'bob.johnson@example.com', status: 'Inactive', salary: 65000 },
    { id: 4, name: 'Alice Brown', age: 34, email: 'alice.brown@example.com', status: 'Active', salary: 91000 },
    { id: 5, name: 'Charlie Wilson', age: 29, email: 'charlie.wilson@example.com', status: 'Active', salary: 78000 },
    { id: 6, name: 'Diana Miller', age: 41, email: 'diana.miller@example.com', status: 'Inactive', salary: 88000 },
    { id: 7, name: 'Edward Davis', age: 37, email: 'edward.davis@example.com', status: 'Active', salary: 95000 },
    { id: 8, name: 'Fiona Garcia', age: 26, email: 'fiona.garcia@example.com', status: 'Active', salary: 68000 }
];

const basicColumns: TableColumn[] = [
    { key: 'id', title: 'ID', width: '80px', sortable: true },
    { key: 'name', title: 'Name', sortable: true },
    { key: 'age', title: 'Age', width: '100px', sortable: true, align: 'center' },
    { key: 'email', title: 'Email', sortable: false }
];

const advancedColumns: TableColumn[] = [
    { key: 'id', title: 'ID', width: '80px', sortable: true, fixed: 'left' },
    { key: 'name', title: 'Name', sortable: true, fixed: 'left' },
    { key: 'age', title: 'Age', width: '100px', sortable: true, align: 'center' },
    { key: 'email', title: 'Email', sortable: false },
    { key: 'status', title: 'Status', width: '120px', sortable: true },
    { key: 'salary', title: 'Salary', width: '120px', sortable: true, align: 'right' }
];

const meta: Meta<TableComponent> = {
    title: 'Components/Table',
    component: TableComponent,
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                FormsModule,
                ReactiveFormsModule,
                TableComponent,
                ButtonComponent,
                NxIconDirective
            ]
        })
    ],
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: `
A comprehensive table component with sorting, pagination, row selection, and custom template support.

### Features
- **Sorting**: Single and multi-column sorting with visual indicators
- **Pagination**: Built-in pagination with page size options and quick jumper
- **Row Selection**: Single and multiple selection modes with checkbox support
- **Custom Templates**: Support for custom cell and header templates
- **Responsive**: Mobile-friendly with horizontal scrolling
- **Accessibility**: Full WCAG 2.1 AA compliance
- **Loading States**: Built-in loading overlay and skeleton states
- **Empty States**: Customizable empty state messages and icons

### Usage
\`\`\`typescript
import { TableComponent } from 'ngx-unnamed/table';
import { TableColumn, TableRow } from 'ngx-unnamed/table';

@Component({
  imports: [TableComponent]
})
export class MyComponent {
  data: TableRow[] = [
    { id: 1, name: 'John', age: 30 },
    { id: 2, name: 'Jane', age: 25 }
  ];

  columns: TableColumn[] = [
    { key: 'id', title: 'ID', sortable: true },
    { key: 'name', title: 'Name', sortable: true },
    { key: 'age', title: 'Age', sortable: true }
  ];
}
\`\`\`

\`\`\`html
<nx-table
  [data]="data"
  [columns]="columns"
  [rowSelection]="rowSelection"
  [pagination]="pagination"
  (sortChange)="onSortChange($event)"
  (selectionChange)="onSelectionChange($event)">
</nx-table>
\`\`\`
                `
            }
        }
    },
    argTypes: {
        data: {
            description: 'Array of row data objects',
            control: 'object'
        },
        columns: {
            description: 'Array of column definitions',
            control: 'object'
        },
        size: {
            description: 'Table size variant',
            control: 'select',
            options: ['small', 'default', 'large']
        },
        showHeader: {
            description: 'Whether to show table header',
            control: 'boolean'
        },
        bordered: {
            description: 'Whether to show borders',
            control: 'boolean'
        },
        hoverable: {
            description: 'Whether rows are hoverable',
            control: 'boolean'
        },
        striped: {
            description: 'Whether to show striped rows',
            control: 'boolean'
        },
        loading: {
            description: 'Whether table is in loading state',
            control: 'boolean'
        },
        emptyText: {
            description: 'Text to display when no data',
            control: 'text'
        }
    },
    args: {
        data: sampleData,
        columns: basicColumns,
        size: 'default',
        showHeader: true,
        bordered: false,
        hoverable: true,
        striped: false,
        loading: false,
        emptyText: 'No data available'
    }
};

export default meta;
type Story = StoryObj<TableComponent>;

// Basic table story
export const Basic: Story = {
    args: {
        data: sampleData,
        columns: basicColumns
    }
};

// Bordered table story
export const Bordered: Story = {
    args: {
        data: sampleData,
        columns: basicColumns,
        bordered: true
    }
};

// Striped table story
export const Striped: Story = {
    args: {
        data: sampleData,
        columns: basicColumns,
        striped: true
    }
};

// Small table story
export const Small: Story = {
    args: {
        data: sampleData,
        columns: basicColumns,
        size: 'small'
    }
};

// Large table story
export const Large: Story = {
    args: {
        data: sampleData,
        columns: basicColumns,
        size: 'large'
    }
};

// Sortable table story
export const Sortable: Story = {
    args: {
        data: sampleData,
        columns: advancedColumns,
        bordered: true
    },
    parameters: {
        docs: {
            description: {
                story: 'Table with sortable columns. Click column headers to sort. Hold Shift and click for multi-column sorting.'
            }
        }
    }
};

// Row selection story
export const RowSelection: Story = {
    args: {
        data: sampleData,
        columns: basicColumns,
        bordered: true,
        rowSelection: {
            selectedRowKeys: [],
            mode: 'multiple',
            rowKey: 'id',
            selectOnRowClick: false
        } as TableSelection
    },
    parameters: {
        docs: {
            description: {
                story: 'Table with row selection. Use checkboxes to select rows or enable selectOnRowClick to select by clicking rows.'
            }
        }
    }
};

// Single selection story
export const SingleSelection: Story = {
    args: {
        data: sampleData,
        columns: basicColumns,
        bordered: true,
        rowSelection: {
            selectedRowKeys: [],
            mode: 'single',
            rowKey: 'id',
            selectOnRowClick: true
        } as TableSelection
    },
    parameters: {
        docs: {
            description: {
                story: 'Table with single row selection. Click any row to select it.'
            }
        }
    }
};

// Paginated table story
export const Paginated: Story = {
    args: {
        data: sampleData,
        columns: basicColumns,
        bordered: true,
        pagination: {
            current: 1,
            pageSize: 3,
            total: sampleData.length,
            pageSizeOptions: [3, 5, 10],
            showQuickJumper: true,
            showSizeChanger: true
        } as TablePagination
    },
    parameters: {
        docs: {
            description: {
                story: 'Table with pagination controls. Navigate through pages using buttons, page size selector, or quick jumper.'
            }
        }
    }
};

// Loading state story
export const Loading: Story = {
    args: {
        data: sampleData,
        columns: basicColumns,
        loading: true
    },
    parameters: {
        docs: {
            description: {
                story: 'Table in loading state. Shows loading overlay with spinner.'
            }
        }
    }
};

// Empty state story
export const Empty: Story = {
    args: {
        data: [],
        columns: basicColumns,
        emptyText: 'No employees found'
    },
    parameters: {
        docs: {
            description: {
                story: 'Table with empty state. Shows custom message when no data is available.'
            }
        }
    }
};

// Complex table story
export const Complex: Story = {
    args: {
        data: sampleData,
        columns: advancedColumns,
        bordered: true,
        hoverable: true,
        striped: true,
        rowSelection: {
            selectedRowKeys: [],
            mode: 'multiple',
            rowKey: 'id',
            selectOnRowClick: false,
            disabledRowKeys: [3, 6] // Disable some rows
        } as TableSelection,
        pagination: {
            current: 1,
            pageSize: 5,
            total: sampleData.length,
            pageSizeOptions: [5, 10, 20],
            showQuickJumper: true,
            showSizeChanger: true
        } as TablePagination
    },
    parameters: {
        docs: {
            description: {
                story: 'Complex table demonstrating all features: sorting, pagination, row selection, disabled rows, and styling options.'
            }
        }
    }
};

// Custom template story
export const CustomTemplates: Story = {
    render: (args) => ({
        props: args,
        template: `
            <nx-table
                [data]="data"
                [columns]="columns"
                [bordered]="true">

                <!-- Custom status cell template -->
                <ng-template #statusCell let-value let-record="record">
                    <span
                        class="status-badge"
                        [class.status-active]="value === 'Active'"
                        [class.status-inactive]="value === 'Inactive'">
                        {{ value }}
                    </span>
                </ng-template>

                <!-- Custom salary cell template -->
                <ng-template #salaryCell let-value>
                    <strong>${{ value.toLocaleString() }}</strong>
                </ng-template>

                <!-- Custom header template -->
                <ng-template #nameHeader let-column>
                    <strong>{{ column.title }}</strong>
                    <span style="font-size: 12px; color: #666;"> (Full Name)</span>
                </ng-template>
            </nx-table>

            <style>
                .status-badge {
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 500;
                }
                .status-active {
                    background: #f0f9ff;
                    color: #0369a1;
                }
                .status-inactive {
                    background: #f5f5f5;
                    color: #666;
                }
            </style>
        `
    }),
    args: {
        data: sampleData,
        columns: [
            { key: 'id', title: 'ID', width: '80px', sortable: true },
            { key: 'name', title: 'Name', sortable: true },
            { key: 'age', title: 'Age', width: '100px', sortable: true, align: 'center' },
            { key: 'email', title: 'Email', sortable: false },
            {
                key: 'status',
                title: 'Status',
                width: '120px',
                sortable: true,
                cellTemplate: 'statusCell'
            },
            {
                key: 'salary',
                title: 'Salary',
                width: '120px',
                sortable: true,
                align: 'right',
                cellTemplate: 'salaryCell'
            }
        ].map((col, index) => ({
            ...col,
            headerTemplate: col.key === 'name' ? 'nameHeader' : undefined
        }))
    },
    parameters: {
        docs: {
            description: {
                story: 'Table with custom cell and header templates. Status column shows colored badges, salary column shows formatted currency, and name header has custom styling.'
            }
        }
    }
};

// Responsive table story
export const Responsive: Story = {
    render: (args) => ({
        props: {
            ...args,
            wideData: [
                ...sampleData,
                { id: 9, name: 'George Anderson', age: 52, email: 'george.anderson@company.com', department: 'Engineering', position: 'Senior Software Engineer', location: 'San Francisco', hireDate: '2015-03-15' },
                { id: 10, name: 'Helen Taylor', age: 38, email: 'helen.taylor@company.com', department: 'Marketing', position: 'Marketing Manager', location: 'New York', hireDate: '2018-07-22' }
            ],
            wideColumns: [
                { key: 'id', title: 'ID', width: '80px', sortable: true },
                { key: 'name', title: 'Name', sortable: true, fixed: 'left' },
                { key: 'department', title: 'Department', sortable: true },
                { key: 'position', title: 'Position', sortable: false },
                { key: 'location', title: 'Location', sortable: true },
                { key: 'hireDate', title: 'Hire Date', sortable: true },
                { key: 'email', title: 'Email', sortable: false }
            ]
        },
        template: `
            <div style="max-width: 800px;">
                <h3>Responsive Table (viewport width: 800px)</h3>
                <nx-table
                    [data]="wideData"
                    [columns]="wideColumns"
                    [bordered]="true"
                    [hoverable]="true"
                    [scroll]="{ x: '1000px' }">
                </nx-table>
            </div>
        `
    }),
    parameters: {
        viewport: {
            viewports: {
                tablet: {
                    name: 'Tablet',
                    styles: {
                        width: '800px',
                        height: '600px'
                    }
                }
            },
            defaultViewport: 'tablet'
        },
        docs: {
            description: {
                story: 'Responsive table with horizontal scrolling. Fixed left column stays visible while scrolling horizontally.'
            }
        }
    }
};

// Interactive demo story
export const InteractiveDemo: Story = {
    render: (args) => ({
        props: {
            ...args,
            onSortChange: action('sortChange'),
            onSelectionChange: action('selectionChange'),
            onPageChange: action('pageChange'),
            onRowClick: action('rowClick')
        },
        template: `
            <div style="padding: 20px;">
                <div style="margin-bottom: 20px;">
                    <h3>Interactive Table Demo</h3>
                    <p>Click column headers to sort, select rows, and navigate pages. Check the Actions panel for event details.</p>
                </div>

                <nx-table
                    [data]="data"
                    [columns]="columns"
                    [bordered]="true"
                    [hoverable]="true"
                    [rowSelection]="rowSelection"
                    [pagination]="pagination"
                    (sortChange)="onSortChange($event)"
                    (selectionChange)="onSelectionChange($event)"
                    (pageChange)="onPageChange($event)"
                    (rowClick)="onRowClick($event)">
                </nx-table>
            </div>
        `
    }),
    args: {
        data: sampleData,
        columns: advancedColumns,
        rowSelection: {
            selectedRowKeys: [],
            mode: 'multiple',
            rowKey: 'id',
            selectOnRowClick: false
        } as TableSelection,
        pagination: {
            current: 1,
            pageSize: 5,
            total: sampleData.length,
            pageSizeOptions: [5, 10],
            showQuickJumper: true,
            showSizeChanger: true
        } as TablePagination
    },
    parameters: {
        docs: {
            description: {
                story: 'Interactive demo with event handling. All table events are logged in the Actions panel.'
            }
        }
    }
};