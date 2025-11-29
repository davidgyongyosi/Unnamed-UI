import type { Meta, StoryObj } from '@storybook/angular';

import { TagComponent } from './tag.component';
import { NxTagMode, NxTagColor } from './tag.types';

const meta: Meta<TagComponent> = {
    title: 'Components/Tag',
    component: TagComponent,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
Tag components are used for categorizing and filtering content. They support basic, closable, and checkable variants with different colors and sizes.
                `,
            },
        },
    },
    argTypes: {
        content: {
            control: 'text',
            description: 'Tag content text',
        },
        color: {
            control: 'select',
            options: ['default', 'success', 'error', 'warning', 'info', 'processing'],
            description: 'Tag color',
        },
        size: {
            control: 'select',
            options: ['default', 'small'],
            description: 'Tag size',
        },
        mode: {
            control: 'select',
            options: ['default', 'closeable', 'checkable'],
            description: 'Tag mode/behavior',
        },
        selected: {
            control: 'boolean',
            description: 'Whether tag is selected (for checkable mode)',
        },
        disabled: {
            control: 'boolean',
            description: 'Whether tag is disabled',
        },
        checked: {
            control: 'boolean',
            description: 'Whether tag is checked (for checkable mode)',
        },
        closable: {
            control: 'boolean',
            description: 'Whether tag can be closed',
        },
        closeIcon: {
            control: 'text',
            description: 'Custom icon for closeable tags',
        },
        checkIcon: {
            control: 'text',
            description: 'Custom icon for checkable tags',
        },
    },
};

export default meta;
type Story = StoryObj<TagComponent>;

export const Default: Story = {
    args: {
        content: 'Tag 1',
    },
};

export const Colors: Story = {
    render: () => ({
        template: `
            <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
                <nx-tag content="Default" color="default"></nx-tag>
                <nx-tag content="Success" color="success"></nx-tag>
                <nx-tag content="Error" color="error"></nx-tag>
                <nx-tag content="Warning" color="warning"></nx-tag>
                <nx-tag content="Info" color="info"></nx-tag>
                <nx-tag content="Processing" color="processing"></nx-tag>
            </div>
        `,
    }),
    parameters: {
        docs: {
            description: {
                story: 'Tags come in different colors to indicate different types of information.',
            },
        },
    },
};

export const Sizes: Story = {
    render: () => ({
        template: `
            <div style="display: flex; gap: 16px; align-items: center;">
                <nx-tag content="Default Size" size="default"></nx-tag>
                <nx-tag content="Small Size" size="small"></nx-tag>
            </div>
        `,
    }),
    parameters: {
        docs: {
            description: {
                story: 'Tags come in default and small sizes.',
            },
        },
    },
};

export const Modes: Story = {
    render: () => ({
        template: `
            <div style="display: flex; gap: 24px; flex-wrap: wrap; align-items: center;">
                <div>
                    <h4 style="margin: 0 0 8px 0;">Default Mode</h4>
                    <div style="display: flex; gap: 8px;">
                        <nx-tag content="React" color="processing"></nx-tag>
                        <nx-tag content="Vue" color="success"></nx-tag>
                        <nx-tag content="Angular" color="error"></nx-tag>
                    </div>
                </div>
                <div>
                    <h4 style="margin: 0 0 8px 0;">Closeable Mode</h4>
                    <div style="display: flex; gap: 8px;">
                        <nx-tag content="Closable 1" mode="closeable" color="default"></nx-tag>
                        <nx-tag content="Closable 2" mode="closeable" color="success"></nx-tag>
                        <nx-tag content="Closable 3" mode="closeable" color="error"></nx-tag>
                    </div>
                </div>
                <div>
                    <h4 style="margin: 0 0 8px 0;">Checkable Mode</h4>
                    <div style="display: flex; gap: 8px;">
                        <nx-tag content="Option 1" mode="checkable" [checked]="false"></nx-tag>
                        <nx-tag content="Option 2" mode="checkable" [checked]="true"></nx-tag>
                        <nx-tag content="Option 3" mode="checkable" [checked]="false"></nx-tag>
                    </div>
                </div>
            </div>
        `,
    }),
    parameters: {
        docs: {
            description: {
                story: 'Tags have three modes: default (display only), closeable (can be removed), and checkable (can be selected).',
            },
        },
    },
};

export const DisabledTags: Story = {
    render: () => ({
        template: `
            <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
                <nx-tag content="Disabled Default" disabled="true"></nx-tag>
                <nx-tag content="Disabled Checkable" mode="checkable" disabled="true"></nx-tag>
                <nx-tag content="Disabled Closeable" mode="closeable" disabled="true"></nx-tag>
            </div>
        `,
    }),
    parameters: {
        docs: {
            description: {
                story: 'Disabled tags cannot be interacted with and have reduced opacity.',
            },
        },
    },
};

export const InteractiveExample: Story = {
    render: () => ({
        template: `
            <div style="padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h3 style="margin-top: 0;">Interactive Tag Demo</h3>
                <p style="margin-bottom: 20px; color: #666;">
                    Click tags to select them, use close buttons to remove them, or try keyboard navigation.
                </p>

                <div style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 12px 0;">Technology Stack (Checkable)</h4>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
                        <nx-tag content="JavaScript" mode="checkable" [checked]="selectedTags.includes('JavaScript')"
                               (change)="onTagChange($event)"></nx-tag>
                        <nx-tag content="TypeScript" mode="checkable" [checked]="selectedTags.includes('TypeScript')"
                               (change)="onTagChange($event)"></nx-tag>
                        <nx-tag content="React" mode="checkable" [checked]="selectedTags.includes('React')"
                               (change)="onTagChange($event)"></nx-tag>
                        <nx-tag content="Vue" mode="checkable" [checked]="selectedTags.includes('Vue')"
                               (change)="onTagChange($event)"></nx-tag>
                        <nx-tag content="Angular" mode="checkable" [checked]="selectedTags.includes('Angular')"
                               (change)="onTagChange($event)"></nx-tag>
                        <nx-tag content="Node.js" mode="checkable" [checked]="selectedTags.includes('Node.js')"
                               (change)="onTagChange($event)"></nx-tag>
                    </div>
                    <p style="margin: 0; color: #666; font-size: 14px;">
                        Selected: {{ selectedTags.length }} tags
                    </p>
                </div>

                <div style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 12px 0;">Categories (Closeable)</h4>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        @for (category of categories; track category.value) {
                            <nx-tag [content]="category.label" mode="closeable" [color]="category.color"
                                   [value]="category.value" (close)="onCategoryClose($event)"></nx-tag>
                        }
                        @if (categories.length === 0) {
                            <span style="color: #999;">No categories selected</span>
                        }
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 12px 0;">Status Tags (Mixed)</h4>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <nx-tag content="Active" color="success"></nx-tag>
                        <nx-tag content="In Review" color="warning" mode="closeable"></nx-tag>
                        <nx-tag content="Draft" color="default" mode="closeable"></nx-tag>
                        <nx-tag content="Published" color="info" mode="checkable" [checked]="true"></nx-tag>
                    </div>
                </div>

                <div>
                    <h4 style="margin: 0 0 12px 0;">Disabled Tags</h4>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <nx-tag content="Locked" color="error" disabled="true"></nx-tag>
                        <nx-tag content="Read Only" disabled="true"></nx-tag>
                        <nx-tag content="Archived" mode="closeable" disabled="true"></nx-tag>
                    </div>
                </div>
            </div>
        `,
        moduleMetadata: {
            imports: [TagComponent],
        },
        app: {
            data: {
                selectedTags: ['JavaScript', 'TypeScript'],
                categories: [
                    { label: 'Frontend', value: 'frontend', color: 'info' as NxTagColor },
                    { label: 'Backend', value: 'backend', color: 'success' as NxTagColor },
                    { label: 'DevOps', value: 'devops', color: 'warning' as NxTagColor },
                    { label: 'Database', value: 'database', color: 'processing' as NxTagColor },
                ]
            },
            methods: {
                onTagChange(event: any) {
                    const tag = event.content;
                    if (event.checked) {
                        if (!this.selectedTags.includes(tag)) {
                            this.selectedTags.push(tag);
                        }
                    } else {
                        const index = this.selectedTags.indexOf(tag);
                        if (index > -1) {
                            this.selectedTags.splice(index, 1);
                        }
                    }
                },
                onCategoryClose(event: any) {
                    const value = event.value;
                    this.categories = this.categories.filter(cat => cat.value !== value);
                }
            }
        }
    }),
    parameters: {
        docs: {
            description: {
                story: 'Interactive demo showing tag selection, removal, and different modes. Use keyboard navigation (Tab, Enter, Space, Delete, Backspace) to test accessibility.',
            },
        },
    },
};

export const FilteringExample: Story = {
    render: () => ({
        template: `
            <div style="padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h3 style="margin-top: 0;">Filtering Example</h3>
                <p style="margin-bottom: 20px; color: #666;">
                    Select tags to filter the content below.
                </p>

                <div style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 12px 0;">Filter by Department</h4>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <nx-tag content="Engineering" mode="checkable" [checked]="filters.includes('Engineering')"
                               color="processing" (change)="onFilterChange($event)"></nx-tag>
                        <nx-tag content="Design" mode="checkable" [checked]="filters.includes('Design')"
                               color="warning" (change)="onFilterChange($event)"></nx-tag>
                        <nx-tag content="Marketing" mode="checkable" [checked]="filters.includes('Marketing')"
                               color="info" (change)="onFilterChange($event)"></nx-tag>
                        <nx-tag content="Sales" mode="checkable" [checked]="filters.includes('Sales')"
                               color="success" (change)="onFilterChange($event)"></nx-tag>
                        <nx-tag content="HR" mode="checkable" [checked]="filters.includes('HR')"
                               color="error" (change)="onFilterChange($event)"></nx-tag>
                    </div>
                </div>

                <div style="background: #f9f9f9; padding: 16px; border-radius: 4px;">
                    <h4 style="margin-top: 0;">Filtered Results</h4>
                    <ul style="margin: 0; padding-left: 20px;">
                        @for (result of filteredResults; track result.id) {
                            <li>{{ result.name }} - {{ result.department }}</li>
                        }
                        @if (filteredResults.length === 0) {
                            <li style="color: #999;">No results match the selected filters</li>
                        }
                    </ul>
                    <p style="margin: 12px 0 0 0; color: #666; font-size: 14px;">
                        Showing {{ filteredResults.length }} of {{ allResults.length }} results
                    </p>
                </div>

                <div style="margin-top: 16px;">
                    <button (click)="clearFilters()" style="padding: 6px 12px; border: 1px solid #ccc; background: #f5f5f5; cursor: pointer; border-radius: 4px;">
                        Clear Filters
                    </button>
                </div>
            </div>
        `,
        moduleMetadata: {
            imports: [TagComponent],
        },
        app: {
            data: {
                filters: [],
                allResults: [
                    { id: 1, name: 'John Doe', department: 'Engineering' },
                    { id: 2, name: 'Jane Smith', department: 'Design' },
                    { id: 3, name: 'Bob Johnson', department: 'Marketing' },
                    { id: 4, name: 'Alice Brown', department: 'Engineering' },
                    { id: 5, name: 'Charlie Wilson', department: 'Sales' },
                    { id: 6, name: 'Diana Lee', department: 'HR' },
                    { id: 7, name: 'Eve Davis', department: 'Design' },
                    { id: 8, name: 'Frank Miller', department: 'Sales' },
                ]
            },
            computed: {
                filteredResults() {
                    if (this.filters.length === 0) {
                        return this.allResults;
                    }
                    return this.allResults.filter(result => this.filters.includes(result.department));
                }
            },
            methods: {
                onFilterChange(event: any) {
                    const department = event.content;
                    if (event.checked) {
                        if (!this.filters.includes(department)) {
                            this.filters.push(department);
                        }
                    } else {
                        const index = this.filters.indexOf(department);
                        if (index > -1) {
                            this.filters.splice(index, 1);
                        }
                    }
                },
                clearFilters() {
                    this.filters = [];
                }
            }
        }
    }),
    parameters: {
        docs: {
            description: {
                story: 'Tags are perfect for filtering interfaces. This example shows how tags can be used to filter content dynamically.',
            },
        },
    },
};

export const AccessibilityDemo: Story = {
    render: () => ({
        template: `
            <div style="padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h3 style="margin-top: 0;">Accessibility Demo</h3>
                <p style="margin-bottom: 20px; color: #666;">
                    This demo showcases accessibility features. Use screen reader or keyboard navigation to test.
                </p>

                <div style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 12px 0;">Keyboard Navigation Instructions:</h4>
                    <ul style="margin: 0; padding-left: 20px; color: #666;">
                        <li><strong>Tab:</strong> Navigate between tags</li>
                        <li><strong>Enter/Space:</strong> Select/deselect checkable tags</li>
                        <li><strong>Delete/Backspace:</strong> Remove closeable tags</li>
                        <li><strong>Enter:</strong> Close focused closeable tag</li>
                    </ul>
                </div>

                <div style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 12px 0;">Accessible Tags:</h4>
                    <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
                        <nx-tag content="Screen Reader Test" mode="checkable" [checked]="true"></nx-tag>
                        <nx-tag content="Keyboard Navigation" mode="closeable"></nx-tag>
                        <nx-tag content="ARIA Labels" color="info"></nx-tag>
                        <nx-tag content="Focus Visible" color="success"></nx-tag>
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 12px 0;">Disabled Tags (Screen Reader Announces):</h4>
                    <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
                        <nx-tag content="Disabled (disabled)" disabled="true"></nx-tag>
                        <nx-tag content="Locked (locked)" disabled="true" color="error"></nx-tag>
                    </div>
                </div>

                <div>
                    <h4 style="margin: 0 0 12px 0;">High Contrast Mode Support:</h4>
                    <p style="margin: 0; color: #666; font-size: 14px;">
                        Tags maintain proper contrast ratios and visual distinction in high contrast mode.
                    </p>
                </div>
            </div>
        `,
    }),
    parameters: {
        docs: {
            description: {
                story: 'Tags include comprehensive accessibility support with proper ARIA attributes, keyboard navigation, and screen reader announcements.',
            },
        },
    },
};

export const CustomColors: Story = {
    render: () => ({
        template: `
            <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
                <nx-tag content="Brand Purple" style="--nx-tag-bg: #9333ea; --nx-tag-border: #9333ea; --nx-tag-color: white; --nx-tag-hover-bg: #a855f7; --nx-tag-hover-border: #a855f7; --nx-tag-hover-color: white;"></nx-tag>
                <nx-tag content="Brand Orange" style="--nx-tag-bg: #f97316; --nx-tag-border: #f97316; --nx-tag-color: white; --nx-tag-hover-bg: #fb923c; --nx-tag-hover-border: #fb923c; --nx-tag-hover-color: white;"></nx-tag>
                <nx-tag content="Brand Green" style="--nx-tag-bg: #10b981; --nx-tag-border: #10b981; --nx-tag-color: white; --nx-tag-hover-bg: #34d399; --nx-tag-hover-border: #34d399; --nx-tag-hover-color: white;"></nx-tag>
            </div>
        `,
    }),
    parameters: {
        docs: {
            description: {
                story: 'Custom colors can be applied using CSS custom properties for brand consistency.',
            },
        },
    },
};