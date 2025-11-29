import type { Meta, StoryObj } from '@storybook/angular';

import { BadgeComponent } from './badge.component';
import { NxBadgeStatus } from './badge.types';

const meta: Meta<BadgeComponent> = {
    title: 'Components/Badge',
    component: BadgeComponent,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
Badge components are used to display status indicators, notification counts, or small labels.
They can be positioned relative to parent elements or used as standalone indicators.
                `,
            },
        },
    },
    argTypes: {
        content: {
            control: 'text',
            description: 'Badge content - can be a string for text badges or number for count badges',
        },
        status: {
            control: 'select',
            options: ['default', 'success', 'error', 'warning', 'info'],
            description: 'Badge status/color',
        },
        size: {
            control: 'select',
            options: ['default', 'small'],
            description: 'Badge size',
        },
        position: {
            control: 'select',
            options: ['top-right', 'top-left', 'bottom-right', 'bottom-left'],
            description: 'Position relative to parent element',
        },
        dot: {
            control: 'boolean',
            description: 'Show as a dot (no content) - useful for status indicators',
        },
        count: {
            control: 'number',
            description: 'Show count badge with overflow formatting',
        },
        maxCount: {
            control: 'number',
            description: 'Maximum count to display before showing overflow',
        },
        color: {
            control: 'color',
            description: 'Custom color override',
        },
        bordered: {
            control: 'boolean',
            description: 'Show badge with border',
        },
        className: {
            control: 'text',
            description: 'Custom CSS classes',
        },
    },
};

export default meta;
type Story = StoryObj<BadgeComponent>;

export const Default: Story = {
    args: {
        content: 'New',
    },
};

export const StatusColors: Story = {
    render: () => ({
        template: `
            <div style="display: flex; gap: 16px; align-items: center;">
                <nx-badge content="Default" status="default"></nx-badge>
                <nx-badge content="Success" status="success"></nx-badge>
                <nx-badge content="Error" status="error"></nx-badge>
                <nx-badge content="Warning" status="warning"></nx-badge>
                <nx-badge content="Info" status="info"></nx-badge>
            </div>
        `,
    }),
    parameters: {
        docs: {
            description: {
                story: 'Badge comes in different status colors to indicate different types of information.',
            },
        },
    },
};

export const CountBadges: Story = {
    render: () => ({
        template: `
            <div style="display: flex; gap: 24px; align-items: center;">
                <div style="position: relative; display: inline-block;">
                    <button style="padding: 8px 16px; border: 1px solid #ccc; background: #fff; cursor: pointer;">
                        Notifications
                    </button>
                    <nx-badge [count]="5"></nx-badge>
                </div>
                <div style="position: relative; display: inline-block;">
                    <button style="padding: 8px 16px; border: 1px solid #ccc; background: #fff; cursor: pointer;">
                        Messages
                    </button>
                    <nx-badge [count]="99" [maxCount]="99"></nx-badge>
                </div>
                <div style="position: relative; display: inline-block;">
                    <button style="padding: 8px 16px; border: 1px solid #ccc; background: #fff; cursor: pointer;">
                        Alerts
                    </button>
                    <nx-badge [count]="150" [maxCount]="99" status="error"></nx-badge>
                </div>
            </div>
        `,
    }),
    parameters: {
        docs: {
            description: {
                story: 'Count badges display numbers and automatically show overflow formatting when the count exceeds maxCount.',
            },
        },
    },
};

export const DotIndicators: Story = {
    render: () => ({
        template: `
            <div style="display: flex; gap: 24px; align-items: center;">
                <div style="position: relative; display: inline-block;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: #f0f0f0; display: flex; align-items: center; justify-content: center;">
                        User
                    </div>
                    <nx-badge dot status="success"></nx-badge>
                </div>
                <div style="position: relative; display: inline-block;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: #f0f0f0; display: flex; align-items: center; justify-content: center;">
                        Device
                    </div>
                    <nx-badge dot status="error"></nx-badge>
                </div>
                <div style="position: relative; display: inline-block;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: #f0f0f0; display: flex; align-items: center; justify-content: center;">
                        Server
                    </div>
                    <nx-badge dot status="warning"></nx-badge>
                </div>
                <div style="position: relative; display: inline-block;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: #f0f0f0; display: flex; align-items: center; justify-content: center;">
                        System
                    </div>
                    <nx-badge dot status="info"></nx-badge>
                </div>
            </div>
        `,
    }),
    parameters: {
        docs: {
            description: {
                story: 'Dot badges are useful for status indicators without text content.',
            },
        },
    },
};

export const Positions: Story = {
    render: () => ({
        template: `
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; padding: 40px;">
                <div style="position: relative; display: inline-block;">
                    <div style="padding: 16px; border: 2px dashed #ccc; background: #f9f9f9;">
                        Top Right Badge
                        <nx-badge content="3" position="top-right"></nx-badge>
                    </div>
                </div>
                <div style="position: relative; display: inline-block;">
                    <div style="padding: 16px; border: 2px dashed #ccc; background: #f9f9f9;">
                        Top Left Badge
                        <nx-badge content="5" position="top-left"></nx-badge>
                    </div>
                </div>
                <div style="position: relative; display: inline-block;">
                    <div style="padding: 16px; border: 2px dashed #ccc; background: #f9f9f9;">
                        Bottom Right Badge
                        <nx-badge content="7" position="bottom-right"></nx-badge>
                    </div>
                </div>
                <div style="position: relative; display: inline-block;">
                    <div style="padding: 16px; border: 2px dashed #ccc; background: #f9f9f9;">
                        Bottom Left Badge
                        <nx-badge content="9" position="bottom-left"></nx-badge>
                    </div>
                </div>
            </div>
        `,
    }),
    parameters: {
        docs: {
            description: {
                story: 'Badges can be positioned in four corners relative to their parent element.',
            },
        },
    },
};

export const Sizes: Story = {
    render: () => ({
        template: `
            <div style="display: flex; gap: 24px; align-items: center;">
                <div style="position: relative; display: inline-block;">
                    <button style="padding: 12px 20px; font-size: 16px; border: 1px solid #ccc; background: #fff; cursor: pointer;">
                        Default Size
                    </button>
                    <nx-badge content="New" size="default"></nx-badge>
                </div>
                <div style="position: relative; display: inline-block;">
                    <button style="padding: 8px 12px; font-size: 12px; border: 1px solid #ccc; background: #fff; cursor: pointer;">
                        Small Size
                    </button>
                    <nx-badge content="New" size="small"></nx-badge>
                </div>
            </div>
        `,
    }),
    parameters: {
        docs: {
            description: {
                story: 'Badges come in default and small sizes to match different component sizes.',
            },
        },
    },
};

export const Bordered: Story = {
    render: () => ({
        template: `
            <div style="display: flex; gap: 24px; align-items: center;">
                <div style="position: relative; display: inline-block;">
                    <button style="padding: 8px 16px; border: 1px solid #ccc; background: #fff; cursor: pointer;">
                        Bordered Badge
                    </button>
                    <nx-badge content="3" bordered="true"></nx-badge>
                </div>
                <div style="position: relative; display: inline-block;">
                    <button style="padding: 8px 16px; border: 1px solid #ccc; background: #fff; cursor: pointer;">
                        Bordered Dot
                    </button>
                    <nx-badge dot="true" status="success" bordered="true"></nx-badge>
                </div>
            </div>
        `,
    }),
    parameters: {
        docs: {
            description: {
                story: 'Bordered badges have an additional white border for better visibility on colored backgrounds.',
            },
        },
    },
};

export const CustomColors: Story = {
    render: () => ({
        template: `
            <div style="display: flex; gap: 24px; align-items: center;">
                <div style="position: relative; display: inline-block;">
                    <button style="padding: 8px 16px; border: 1px solid #ccc; background: #fff; cursor: pointer;">
                        Purple Badge
                    </button>
                    <nx-badge content="Custom" color="#9333ea"></nx-badge>
                </div>
                <div style="position: relative; display: inline-block;">
                    <button style="padding: 8px 16px; border: 1px solid #ccc; background: #fff; cursor: pointer;">
                        Green Badge
                    </button>
                    <nx-badge content="Custom" color="#10b981"></nx-badge>
                </div>
                <div style="position: relative; display: inline-block;">
                    <button style="padding: 8px 16px; border: 1px solid #ccc; background: #fff; cursor: pointer;">
                        Orange Badge
                    </button>
                    <nx-badge content="Custom" color="#f97316"></nx-badge>
                </div>
            </div>
        `,
    }),
    parameters: {
        docs: {
            description: {
                story: 'Custom colors can be applied to badges for brand consistency or specific visual requirements.',
            },
        },
    },
};

export const Standalone: Story = {
    render: () => ({
        template: `
            <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
                <nx-badge content="Label"></nx-badge>
                <nx-badge [count]="25"></nx-badge>
                <nx-badge content="Hot" status="error"></nx-badge>
                <nx-badge content="Sale" color="#ff6b6b"></nx-badge>
                <nx-badge dot status="success"></nx-badge>
            </div>
        `,
    }),
    parameters: {
        docs: {
            description: {
                story: 'Badges can be used as standalone elements without wrapping content.',
            },
        },
    },
};

export const AccessibilityDemo: Story = {
    render: () => ({
        template: `
            <div style="display: flex; gap: 24px; align-items: center;">
                <div style="position: relative; display: inline-block;">
                    <button style="padding: 8px 16px; border: 1px solid #ccc; background: #fff; cursor: pointer;"
                            aria-describedby="inbox-status">
                        Inbox
                    </button>
                    <nx-badge [count]="5" id="inbox-status"></nx-badge>
                </div>
                <div style="position: relative; display: inline-block;">
                    <button style="padding: 8px 16px; border: 1px solid #ccc; background: #fff; cursor: pointer;">
                        Online Status
                    </button>
                    <nx-badge dot status="success"></nx-badge>
                </div>
                <div style="position: relative; display: inline-block;">
                    <button style="padding: 8px 16px; border: 1px solid #ccc; background: #fff; cursor: pointer;">
                        Priority Alert
                    </button>
                    <nx-badge content="!" status="error" bordered="true"></nx-badge>
                </div>
            </div>
        `,
    }),
    parameters: {
        docs: {
            description: {
                story: 'Badges include proper ARIA labels and screen reader support for accessibility. Use screen reader to test announcements.',
            },
        },
    },
};

export const InteractiveExample: Story = {
    render: () => ({
        template: `
            <div style="padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h3 style="margin-top: 0;">Interactive Badge Demo</h3>
                <p style="margin-bottom: 20px; color: #666;">
                    Click the buttons to see badge counts update in real-time.
                </p>

                <div style="display: flex; gap: 24px; align-items: center; margin-bottom: 20px;">
                    <div style="position: relative; display: inline-block;">
                        <button style="padding: 8px 16px; border: 1px solid #ccc; background: #fff; cursor: pointer;"
                                (click)="incrementCount('notifications')">
                            Notifications ({{ notificationCount }})
                        </button>
                        <nx-badge [count]="notificationCount" id="notifications-badge"></nx-badge>
                    </div>

                    <div style="position: relative; display: inline-block;">
                        <button style="padding: 8px 16px; border: 1px solid #ccc; background: #fff; cursor: pointer;"
                                (click)="toggleStatus()">
                            User Status
                        </button>
                        <nx-badge dot [status]="userStatus" id="status-badge"></nx-badge>
                    </div>

                    <div style="position: relative; display: inline-block;">
                        <button style="padding: 8px 16px; border: 1px solid #ccc; background: #fff; cursor: pointer;"
                                (click)="addLabel()">
                            Add Label
                        </button>
                        <nx-badge [content]="currentLabel" status="warning" bordered="true" id="label-badge"></nx-badge>
                    </div>
                </div>

                <div style="display: flex; gap: 12px;">
                    <button (click)="resetBadges()"
                            style="padding: 6px 12px; border: 1px solid #999; background: #f5f5f5; cursor: pointer; border-radius: 4px;">
                        Reset All
                    </button>
                </div>
            </div>
        `,
        moduleMetadata: {
            imports: [BadgeComponent],
        },
        app: {
            data: {
                notificationCount: 3,
                userStatus: 'success' as NxBadgeStatus,
                currentLabel: 'New',
                labels: ['New', 'Updated', 'Important', 'Critical'],
            },
            methods: {
                incrementCount(type: string) {
                    if (type === 'notifications') {
                        this.notificationCount++;
                    }
                },
                toggleStatus() {
                    const statuses: NxBadgeStatus[] = ['success', 'error', 'warning', 'info'];
                    const currentIndex = statuses.indexOf(this.userStatus);
                    this.userStatus = statuses[(currentIndex + 1) % statuses.length];
                },
                addLabel() {
                    const currentIndex = this.labels.indexOf(this.currentLabel);
                    this.currentLabel = this.labels[(currentIndex + 1) % this.labels.length];
                },
                resetBadges() {
                    this.notificationCount = 0;
                    this.userStatus = 'default';
                    this.currentLabel = 'New';
                }
            }
        }
    }),
    parameters: {
        docs: {
            description: {
                story: 'Interactive demo showing how badges can be updated dynamically. Use this to test screen reader announcements.',
            },
        },
    },
};