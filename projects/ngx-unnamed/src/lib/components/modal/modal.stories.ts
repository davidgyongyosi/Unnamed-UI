import type { Meta, StoryObj, StoryFn } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ModalComponent } from './modal.component';
import { ButtonComponent } from '../button/button.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

const meta: Meta<ModalComponent> = {
    title: 'Components/Modal',
    component: ModalComponent,
    tags: [],
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                FormsModule,
                ModalComponent,
                ButtonComponent,
            ],
        }),
    ],
    argTypes: {
        nxTitle: {
            control: 'text',
            description: 'Modal title text',
        },
        nxSize: {
            control: 'select',
            options: ['small', 'default', 'large', 'fullscreen'],
            description: 'Modal size',
        },
        nxMask: {
            control: 'boolean',
            description: 'Whether to show backdrop mask',
        },
        nxMaskClosable: {
            control: 'boolean',
            description: 'Whether clicking mask closes modal',
        },
        nxKeyboard: {
            control: 'boolean',
            description: 'Whether ESC key closes modal',
        },
        nxOkText: {
            control: 'text',
            description: 'OK button text',
        },
        nxCancelText: {
            control: 'text',
            description: 'Cancel button text',
        },
        nxOkDanger: {
            control: 'boolean',
            description: 'Whether OK button has danger styling',
        },
        nxLoading: {
            control: 'boolean',
            description: 'Whether OK button shows loading state',
        },
    },
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Modal dialog component with customizable content, size, and actions.',
            },
        },
    },
};

export default meta;
type Story = StoryObj<ModalComponent>;

// Basic modal story
export const Default: Story = {
    args: {
        nxTitle: 'Basic Modal',
        visible: true,
        nxSize: 'default',
        nxMask: true,
        nxMaskClosable: true,
        nxKeyboard: true,
        nxOkText: 'OK',
        nxCancelText: 'Cancel',
        nxOkDanger: false,
        nxLoading: false,
    },
    render: (args) => ({
        props: args,
        template: `
            <nx-modal
                [nxTitle]="nxTitle"
                [nxSize]="nxSize"
                [nxMask]="nxMask"
                [nxMaskClosable]="nxMaskClosable"
                [nxKeyboard]="nxKeyboard"
                [nxOkText]="nxOkText"
                [nxCancelText]="nxCancelText"
                [nxOkDanger]="nxOkDanger"
                [nxLoading]="nxLoading"
                [visible]="visible"
                (nxOnOk)="onOk()"
                (nxOnCancel)="onCancel()"
                (nxOnClose)="onClose()">

                <p>This is the modal content. You can put any content here including forms, text, or other components.</p>
                <p>Modals are great for confirmation dialogs, forms, or important information that requires user attention.</p>
            </nx-modal>

            <div style="text-align: center; margin-top: 20px;">
                <button nx-button (click)="visible = true">Open Modal</button>
            </div>
        `,
    }),
};

// Small modal story
export const Small: Story = {
    args: {
        ...Default.args,
        nxTitle: 'Small Modal',
        nxSize: 'small',
        visible: true,
    },
    render: (args) => ({
        props: args,
        template: `
            <nx-modal
                [nxTitle]="nxTitle"
                [nxSize]="nxSize"
                [visible]="visible">

                <p>This is a small modal with compact content.</p>
            </nx-modal>
        `,
    }),
};

// Large modal story
export const Large: Story = {
    args: {
        ...Default.args,
        nxTitle: 'Large Modal',
        nxSize: 'large',
        visible: true,
    },
    render: (args) => ({
        props: args,
        template: `
            <nx-modal
                [nxTitle]="nxTitle"
                [nxSize]="nxSize"
                [visible]="visible">

                <h3>Large Modal Content</h3>
                <p>This modal has more space for complex content.</p>
                <p>You can include:</p>
                <ul>
                    <li>Detailed forms</li>
                    <li>Tables with data</li>
                    <li>Complex workflows</li>
                    <li>Rich content with images</li>
                </ul>
                <p>The large size provides 880px width for your content.</p>
            </nx-modal>
        `,
    }),
};

// Fullscreen modal story
export const Fullscreen: Story = {
    args: {
        ...Default.args,
        nxTitle: 'Fullscreen Modal',
        nxSize: 'fullscreen',
        visible: true,
    },
    render: (args) => ({
        props: args,
        template: `
            <nx-modal
                [nxTitle]="nxTitle"
                [nxSize]="nxSize"
                [visible]="visible">

                <div style="text-align: center; padding: 50px;">
                    <h2>Fullscreen Modal</h2>
                    <p>This modal takes up the entire viewport.</p>
                    <p>Perfect for:</p>
                    <ul style="text-align: left; display: inline-block;">
                        <li>Image galleries</li>
                        <li>Video players</li>
                        <li>Complex forms</li>
                        <li>Document viewers</li>
                    </ul>
                </div>
            </nx-modal>
        `,
    }),
};

// Modal with custom footer
export const CustomFooter: Story = {
    args: {
        ...Default.args,
        nxTitle: 'Custom Footer Modal',
        visible: true,
    },
    render: (args) => ({
        props: args,
        template: `
            <nx-modal
                [nxTitle]="nxTitle"
                [visible]="visible">

                <p>This modal has a custom footer with additional actions.</p>

                <ng-template #footer>
                    <button nx-button nxVariant="ghost">Previous</button>
                    <button nx-button nxVariant="secondary">Save Draft</button>
                    <button nx-button nxVariant="primary">Submit</button>
                </ng-template>
            </nx-modal>
        `,
    }),
};

// Confirmation modal story
export const Confirmation: Story = {
    args: {
        ...Default.args,
        nxTitle: 'Confirm Action',
        nxOkDanger: false,
        visible: true,
    },
    render: (args) => ({
        props: args,
        template: `
            <nx-modal
                [nxTitle]="nxTitle"
                [nxOkDanger]="nxOkDanger"
                [visible]="visible">

                <p>Are you sure you want to perform this action?</p>
                <p>This action cannot be undone.</p>
            </nx-modal>
        `,
    }),
};

// Danger modal story
export const Danger: Story = {
    args: {
        ...Default.args,
        nxTitle: 'Delete Confirmation',
        nxOkDanger: true,
        visible: true,
    },
    render: (args) => ({
        props: args,
        template: `
            <nx-modal
                [nxTitle]="nxTitle"
                [nxOkDanger]="nxOkDanger"
                [visible]="visible">

                <p><strong>Warning:</strong> This will permanently delete the selected item.</p>
                <p>Are you sure you want to continue?</p>
            </nx-modal>
        `,
    }),
};

// Loading modal story
export const Loading: Story = {
    args: {
        ...Default.args,
        nxTitle: 'Processing',
        nxLoading: true,
        visible: true,
    },
    render: (args) => ({
        props: args,
        template: `
            <nx-modal
                [nxTitle]="nxTitle"
                [nxLoading]="nxLoading"
                [visible]="visible">

                <p>Please wait while we process your request...</p>
                <p>This may take a few moments.</p>
            </nx-modal>
        `,
    }),
};

// Modal without mask
export const NoMask: Story = {
    args: {
        ...Default.args,
        nxTitle: 'Frameless Modal',
        nxMask: false,
        visible: true,
    },
    render: (args) => ({
        props: args,
        template: `
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
                <p>This is the background content.</p>
                <p>The modal below has no backdrop mask.</p>

                <nx-modal
                    [nxTitle]="nxTitle"
                    [nxMask]="nxMask"
                    [visible]="visible">

                    <p>This modal floats above the content without a mask.</p>
                </nx-modal>
            </div>
        `,
    }),
};

// Interactive modal example
const InteractiveTemplate: StoryFn<ModalComponent> = (args) => ({
    props: {
        ...args,
        isVisible: false,
        modalSize: 'default',
        handleOk: () => {
            console.log('Modal OK clicked');
            args.visible = false;
        },
        handleCancel: () => {
            console.log('Modal Cancel clicked');
            args.visible = false;
        },
        handleClose: () => {
            console.log('Modal closed');
            args.visible = false;
        },
    },
    template: `
        <div style="text-align: center; padding: 40px;">
            <h2>Interactive Modal Demo</h2>
            <p>Click the buttons below to open different modal configurations:</p>

            <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-top: 20px;">
                <button nx-button (click)="isVisible = true; modalSize = 'small'">Small Modal</button>
                <button nx-button (click)="isVisible = true; modalSize = 'default'">Default Modal</button>
                <button nx-button (click)="isVisible = true; modalSize = 'large'">Large Modal</button>
                <button nx-button (click)="isVisible = true; modalSize = 'fullscreen'">Fullscreen Modal</button>
            </div>

            <nx-modal
                [nxTitle]="'Interactive Modal (' + modalSize + ')'"
                [nxSize]="modalSize"
                [visible]="isVisible"
                (nxOnOk)="handleOk()"
                (nxOnCancel)="handleCancel()"
                (nxOnClose)="handleClose()">

                <h3>Modal Content</h3>
                <p>This is an interactive modal with size: <strong>{{modalSize}}</strong></p>
                <p>You can close this modal by:</p>
                <ul style="text-align: left;">
                    <li>Clicking the OK or Cancel buttons</li>
                    <li>Clicking the × close button</li>
                    <li>Pressing the Escape key</li>
                    <li>Clicking the backdrop (if enabled)</li>
                </ul>
            </nx-modal>
        </div>
    `,
});

export const Interactive: Story = {
    render: InteractiveTemplate,
    parameters: {
        docs: {
            description: {
                story: 'Interactive demo showing different modal sizes and behaviors.',
            },
        },
    },
};