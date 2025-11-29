import type { Meta, StoryObj } from '@storybook/angular';
import { NxPaginationComponent } from './pagination.component';

const meta: Meta<NxPaginationComponent> = {
    title: 'Components/Pagination',
    component: NxPaginationComponent,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
Pagination component for navigating through large datasets or content collections with multiple styles and configuration options.

## Features
- Multiple pagination styles (default, simple, mini)
- Configurable page sizes and total items
- Keyboard navigation and accessibility support
- Size changer and quick jumper options
- Responsive design
- Customizable appearance and behavior

## Accessibility
- Full keyboard navigation support
- ARIA labels and landmarks
- Screen reader compatible
- Focus management
- High contrast support
                `
            }
        }
    },
    argTypes: {
        current: {
            description: 'Current page number (1-based)',
            control: { type: 'number' },
            min: 1
        },
        total: {
            description: 'Total number of pages',
            control: { type: 'number' },
            min: 0
        },
        totalItems: {
            description: 'Total number of items',
            control: { type: 'number' },
            min: 0
        },
        pageSize: {
            description: 'Number of items per page',
            control: { type: 'number' },
            min: 1
        },
        variant: {
            description: 'Pagination style variant',
            control: 'select',
            options: ['default', 'simple', 'mini']
        },
        size: {
            description: 'Pagination size',
            control: 'select',
            options: ['small', 'default', 'large']
        },
        showSizeChanger: {
            description: 'Whether to show page size selector',
            control: 'boolean'
        },
        showQuickJumper: {
            description: 'Whether to show quick page jumper',
            control: 'boolean'
        },
        showTotal: {
            description: 'Whether to show total items count',
            control: 'boolean'
        },
        pageSizeOptions: {
            description: 'Available page sizes for size changer',
            control: 'object'
        },
        disabled: {
            description: 'Whether pagination is disabled',
            control: 'boolean'
        },
        simple: {
            description: 'Whether to show simple pagination',
            control: 'boolean'
        }
    }
};

export default meta;
type Story = StoryObj<NxPaginationComponent>;

export const Default: Story = {
    args: {
        current: 1,
        total: 10,
        totalItems: 100,
        pageSize: 10
    }
};

export const Simple: Story = {
    args: {
        current: 5,
        total: 20,
        totalItems: 200,
        pageSize: 10,
        variant: 'simple'
    },
    parameters: {
        docs: {
            description: {
                story: 'Simple pagination with page number input and total pages display.'
            }
        }
    }
};

export const Mini: Story = {
    args: {
        current: 3,
        total: 8,
        totalItems: 80,
        pageSize: 10,
        variant: 'mini'
    },
    parameters: {
        docs: {
            description: {
                story: 'Mini pagination with compact layout and no total count display.'
            }
        }
    }
};

export const WithSizeChanger: Story = {
    args: {
        current: 2,
        total: 15,
        totalItems: 300,
        pageSize: 20,
        showSizeChanger: true,
        pageSizeOptions: [10, 20, 50, 100]
    },
    parameters: {
        docs: {
            description: {
                story: 'Pagination with page size selector for changing the number of items per page.'
            }
        }
    }
};

export const WithQuickJumper: Story = {
    args: {
        current: 7,
        total: 25,
        totalItems: 250,
        pageSize: 10,
        showQuickJumper: true
    },
    parameters: {
        docs: {
            description: {
                story: 'Pagination with quick jumper input for directly navigating to any page.'
            }
        }
    }
};

export const WithAllFeatures: Story = {
    args: {
        current: 4,
        total: 30,
        totalItems: 600,
        pageSize: 20,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: true,
        pageSizeOptions: [10, 20, 50, 100]
    },
    parameters: {
        docs: {
            description: {
                story: 'Full-featured pagination with all controls enabled.'
            }
        }
    }
};

export const LargeDataSet: Story = {
    args: {
        current: 50,
        total: 100,
        totalItems: 1000,
        pageSize: 10
    },
    parameters: {
        docs: {
            description: {
                story: 'Pagination with large number of pages showing ellipsis for better UX.'
            }
        }
    }
};

export const SmallSize: Story = {
    args: {
        current: 3,
        total: 8,
        totalItems: 80,
        pageSize: 10,
        size: 'small'
    },
    parameters: {
        docs: {
            description: {
                story: 'Small pagination variant for compact layouts.'
            }
        }
    }
};

export const LargeSize: Story = {
    args: {
        current: 3,
        total: 8,
        totalItems: 80,
        pageSize: 10,
        size: 'large'
    },
    parameters: {
        docs: {
            description: {
                story: 'Large pagination variant for better accessibility on touch devices.'
            }
        }
    }
};

export const Disabled: Story = {
    args: {
        current: 3,
        total: 8,
        totalItems: 80,
        pageSize: 10,
        disabled: true
    },
    parameters: {
        docs: {
            description: {
                story: 'Disabled pagination state.'
            }
        }
    }
};

export const NoItems: Story = {
    args: {
        current: 1,
        total: 0,
        totalItems: 0,
        pageSize: 10
    },
    parameters: {
        docs: {
            description: {
                story: 'Pagination with no items to display.'
            }
        }
    }
};

export const SinglePage: Story = {
    args: {
        current: 1,
        total: 1,
        totalItems: 5,
        pageSize: 10
    },
    parameters: {
        docs: {
            description: {
                story: 'Pagination with only one page of results.'
            }
        }
    }
};

export const CustomPageSizeOptions: Story = {
    args: {
        current: 1,
        total: 50,
        totalItems: 500,
        pageSize: 25,
        showSizeChanger: true,
        pageSizeOptions: [5, 10, 25, 50, 100]
    },
    parameters: {
        docs: {
            description: {
                story: 'Pagination with custom page size options.'
            }
        }
    }
};

export const HiddenTotal: Story = {
    args: {
        current: 5,
        total: 20,
        totalItems: 200,
        pageSize: 10,
        showTotal: false
    },
    parameters: {
        docs: {
            description: {
                story: 'Pagination with hidden total count display.'
            }
        }
    }
};