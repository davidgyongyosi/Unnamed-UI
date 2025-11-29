import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { action } from '@storybook/addon-actions';
import { ButtonComponent } from '../button/button.component';
import { NxIconDirective } from '../icon/icon.directive';
import { DropdownComponent } from './dropdown.component';
import { DropdownMenuComponent } from './dropdown.menu.component';
import { NxDropdownConfig, NxDropdownItem } from './dropdown.types';

// Sample dropdown items
const basicItems: NxDropdownItem[] = [
    { key: '1', label: 'Edit', icon: 'edit' },
    { key: '2', label: 'Copy', icon: 'copy' },
    { key: '3', label: 'Delete', icon: 'delete', danger: true },
    { key: '4', label: 'Export', icon: 'download' },
];

const menuItems: NxDropdownItem[] = [
    { key: 'profile', label: 'Profile', icon: 'user' },
    { key: 'settings', label: 'Settings', icon: 'settings' },
    { key: 'divider1', label: '', type: 'divider' },
    { key: 'team', label: 'Team', icon: 'team' },
    { key: 'projects', label: 'Projects', icon: 'project' },
    { key: 'divider2', label: '', type: 'divider' },
    { key: 'logout', label: 'Logout', icon: 'logout', danger: true },
];

const selectionItems: NxDropdownItem[] = [
    { key: 'option1', label: 'Option 1', selected: true },
    { key: 'option2', label: 'Option 2' },
    { key: 'option3', label: 'Option 3' },
    { key: 'option4', label: 'Option 4', disabled: true },
    { key: 'option5', label: 'Option 5' },
];

const meta: Meta<DropdownComponent> = {
    title: 'Components/Dropdown',
    component: DropdownComponent,
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                DropdownComponent,
                DropdownMenuComponent,
                ButtonComponent,
                NxIconDirective
            ]
        })
    ],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
A flexible dropdown component with multiple trigger modes and positioning options.

### Features
- **Multiple Triggers**: Click, hover, and manual activation modes
- **Smart Positioning**: Automatic collision detection and configurable placement
- **Keyboard Navigation**: Full ARIA support with arrow key navigation
- **Flexible Content**: Support for action items, dividers, headers, and custom templates
- **Accessibility**: WCAG 2.1 AA compliant with proper ARIA attributes
- **Service Integration**: Automatic closing of other dropdowns when opening new ones

### Usage
\`\`\`typescript
import { DropdownComponent, DropdownMenuComponent } from 'ngx-unnamed/dropdown';
import { NxDropdownItem } from 'ngx-unnamed/dropdown';

@Component({
  imports: [DropdownComponent, DropdownMenuComponent]
})
export class MyComponent {
  items: NxDropdownItem[] = [
    { key: 'edit', label: 'Edit', icon: 'edit' },
    { key: 'delete', label: 'Delete', icon: 'delete', danger: true }
  ];

  onItemClick(event: NxDropdownItemClick): void {
    console.log('Clicked item:', event.item.key);
  }
}
\`\`\`

\`\`\`html
<nx-dropdown [config]="{ placement: 'bottomLeft' }">
  <button nx-button nx-dropdown-trigger>Actions</button>

  <nx-dropdown-menu [items]="items" (itemClick)="onItemClick($event)"></nx-dropdown-menu>
</nx-dropdown>
\`\`\`
                `
            }
        }
    },
    argTypes: {
        config: {
            description: 'Dropdown configuration options',
            control: 'object'
        },
        items: {
            description: 'Array of dropdown items',
            control: 'object'
        },
        disabled: {
            description: 'Whether dropdown is disabled',
            control: 'boolean'
        }
    },
    args: {
        config: {},
        items: basicItems,
        disabled: false
    }
};

export default meta;
type Story = StoryObj<DropdownComponent>;

// Basic dropdown story
export const Basic: Story = {
    render: (args) => ({
        props: {
            ...args,
            onItemClick: action('itemClick'),
            onVisibleChange: action('visibleChange')
        },
        template: `
            <div style="padding: 40px;">
                <nx-dropdown [config]="config" (visibleChange)="onVisibleChange($event)">
                    <button nx-button nx-dropdown-trigger>Actions</button>

                    <nx-dropdown-menu
                        [items]="items"
                        (itemClick)="onItemClick($event)"></nx-dropdown-menu>
                </nx-dropdown>
            </div>
        `
    }),
    args: {
        config: { placement: 'bottomLeft' },
        items: basicItems
    }
};

// Click trigger dropdown
export const ClickTrigger: Story = {
    render: (args) => ({
        props: {
            ...args,
            onItemClick: action('itemClick')
        },
        template: `
            <div style="padding: 40px;">
                <nx-dropdown [config]="{ trigger: 'click', placement: 'bottomLeft' }">
                    <button nx-button nx-dropdown-trigger>Click Me</button>

                    <nx-dropdown-menu [items]="menuItems" (itemClick)="onItemClick($event)"></nx-dropdown-menu>
                </nx-dropdown>
            </div>
        `
    }),
    args: {
        items: menuItems
    }
};

// Hover trigger dropdown
export const HoverTrigger: Story = {
    render: (args) => ({
        props: {
            ...args,
            onItemClick: action('itemClick')
        },
        template: `
            <div style="padding: 40px;">
                <nx-dropdown [config]="{ trigger: 'hover', placement: 'bottomLeft' }">
                    <button nx-button nx-dropdown-trigger>Hover Me</button>

                    <nx-dropdown-menu [items]="menuItems" (itemClick)="onItemClick($event)"></nx-dropdown-menu>
                </nx-dropdown>
            </div>
        `
    }),
    args: {
        items: menuItems
    }
};

// Different placements story
export const Placements: Story = {
    render: (args) => ({
        props: {
            ...args,
            onItemClick: action('itemClick')
        },
        template: `
            <div style="padding: 60px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; text-align: center;">
                <div>
                    <p style="margin-bottom: 20px;">Top Left</p>
                    <nx-dropdown [config]="{ placement: 'topLeft' }">
                        <button nx-button nx-dropdown-trigger>Dropdown</button>
                        <nx-dropdown-menu [items]="items" (itemClick)="onItemClick($event)"></nx-dropdown-menu>
                    </nx-dropdown>
                </div>

                <div>
                    <p style="margin-bottom: 20px;">Bottom Left</p>
                    <nx-dropdown [config]="{ placement: 'bottomLeft' }">
                        <button nx-button nx-dropdown-trigger>Dropdown</button>
                        <nx-dropdown-menu [items]="items" (itemClick)="onItemClick($event)"></nx-dropdown-menu>
                    </nx-dropdown>
                </div>

                <div>
                    <p style="margin-bottom: 20px;">Right</p>
                    <nx-dropdown [config]="{ placement: 'right' }">
                        <button nx-button nx-dropdown-trigger>Dropdown</button>
                        <nx-dropdown-menu [items]="items" (itemClick)="onItemClick($event)"></nx-dropdown-menu>
                    </nx-dropdown>
                </div>

                <div>
                    <p style="margin-bottom: 20px;">Left</p>
                    <nx-dropdown [config]="{ placement: 'left' }">
                        <button nx-button nx-dropdown-trigger>Dropdown</button>
                        <nx-dropdown-menu [items]="items" (itemClick)="onItemClick($event)"></nx-dropdown-menu>
                    </nx-dropdown>
                </div>
            </div>
        `
    }),
    args: {
        items: basicItems
    }
};

// With arrow dropdown
export const WithArrow: Story = {
    render: (args) => ({
        props: {
            ...args,
            onItemClick: action('itemClick')
        },
        template: `
            <div style="padding: 40px;">
                <nx-dropdown [config]="{ showArrow: true, placement: 'bottomLeft' }">
                    <button nx-button nx-dropdown-trigger>With Arrow</button>

                    <nx-dropdown-menu [items]="items" (itemClick)="onItemClick($event)"></nx-dropdown-menu>
                </nx-dropdown>
            </div>
        `
    })
};

// Selection dropdown story
export const Selection: Story = {
    render: (args) => ({
        props: {
            ...args,
            onItemClick: action('itemClick')
        },
        template: `
            <div style="padding: 40px;">
                <nx-dropdown [config]="{ placement: 'bottomLeft' }">
                    <button nx-button nx-dropdown-trigger>Select Option</button>

                    <nx-dropdown-menu [items]="selectionItems" (itemClick)="onItemClick($event)"></nx-dropdown-menu>
                </nx-dropdown>
            </div>
        `
    }),
    args: {
        items: selectionItems
    }
};

// Custom width dropdown
export const CustomWidth: Story = {
    render: (args) => ({
        props: {
            ...args,
            onItemClick: action('itemClick')
        },
        template: `
            <div style="padding: 40px;">
                <nx-dropdown [config]="{ width: 300, placement: 'bottomLeft' }">
                    <button nx-button nx-dropdown-trigger>Wide Dropdown</button>

                    <nx-dropdown-menu [items]="items" (itemClick)="onItemClick($event)"></nx-dropdown-menu>
                </nx-dropdown>
            </div>
        `
    })
};

// Disabled dropdown
export const Disabled: Story = {
    render: (args) => ({
        props: {
            ...args
        },
        template: `
            <div style="padding: 40px;">
                <nx-dropdown [disabled]="true">
                    <button nx-button disabled nx-dropdown-trigger>Disabled</button>

                    <nx-dropdown-menu [items]="items"></nx-dropdown-menu>
                </nx-dropdown>
            </div>
        `
    })
};

// Context menu story
export const ContextMenu: Story = {
    render: (args) => ({
        props: {
            ...args,
            onContextMenu: action('contextMenu'),
            onItemClick: action('itemClick')
        },
        template: `
            <div style="padding: 40px;">
                <div
                    style="background: #f5f5f5; padding: 60px; text-align: center; cursor: pointer;"
                    (contextmenu)="onContextMenu($event); $event.preventDefault()">
                    Right-click here for context menu
                </div>

                <nx-dropdown [config]="{ trigger: 'manual', placement: 'bottomLeft' }">
                    <div nx-dropdown-trigger></div>

                    <nx-dropdown-menu [items]="menuItems" (itemClick)="onItemClick($event)"></nx-dropdown-menu>
                </nx-dropdown>
            </div>
        `
    }),
    args: {
        items: menuItems
    }
};

// Complex dropdown story
export const Complex: Story = {
    render: (args) => ({
        props: {
            ...args,
            onItemClick: action('itemClick'),
            onVisibleChange: action('visibleChange')
        },
        template: `
            <div style="padding: 40px;">
                <h3>Complex Dropdown Demo</h3>
                <p>Features: Arrow, custom width, keyboard navigation, and various item types</p>

                <nx-dropdown
                    [config]="{
                        showArrow: true,
                        width: 280,
                        placement: 'bottomLeft',
                        closeOnEscape: true,
                        closeOnOutsideClick: true
                    }"
                    (visibleChange)="onVisibleChange($event)">

                    <button nx-button variant="outline" nx-dropdown-trigger>
                        <nx-icon nxIcon="more" style="margin-right: 8px;"></nx-icon>
                        Advanced Options
                    </button>

                    <nx-dropdown-menu [items]="menuItems" (itemClick)="onItemClick($event)"></nx-dropdown-menu>
                </nx-dropdown>
            </div>
        `
    }),
    args: {
        items: menuItems
    }
};

// Interactive demo story
export const InteractiveDemo: Story = {
    render: (args) => ({
        props: {
            ...args,
            onItemClick: action('itemClick'),
            onVisibleChange: action('visibleChange'),
            dropdownConfig: {
                placement: 'bottomLeft',
                showArrow: true,
                closeOnEscape: true
            }
        },
        template: `
            <div style="padding: 40px;">
                <div style="margin-bottom: 20px;">
                    <h3>Interactive Dropdown Demo</h3>
                    <p>Try different trigger modes and interact with keyboard navigation.</p>
                </div>

                <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                    <nx-dropdown [config]="dropdownConfig" (visibleChange)="onVisibleChange($event)">
                        <button nx-button nx-dropdown-trigger>Click Trigger</button>
                        <nx-dropdown-menu [items]="items" (itemClick)="onItemClick($event)"></nx-dropdown-menu>
                    </nx-dropdown>

                    <nx-dropdown [config]="{ ...dropdownConfig, trigger: 'hover' }">
                        <button nx-button variant="outline" nx-dropdown-trigger>Hover Trigger</button>
                        <nx-dropdown-menu [items]="items" (itemClick)="onItemClick($event)"></nx-dropdown-menu>
                    </nx-dropdown>
                </div>

                <div style="background: #f0f9ff; padding: 16px; border-radius: 8px;">
                    <h4>Keyboard Navigation:</h4>
                    <ul style="margin: 8px 0; padding-left: 20px;">
                        <li>Tab to focus dropdown button</li>
                        <li>Enter/Space to open dropdown</li>
                        <li>Arrow keys to navigate items</li>
                        <li>Home/End to jump to first/last item</li>
                        <li>Enter/Space to select item</li>
                        <li>Escape to close dropdown</li>
                    </ul>
                </div>
            </div>
        `
    })
};