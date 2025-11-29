export type NxTagMode = 'default' | 'closeable' | 'checkable';
export type NxTagColor = 'default' | 'success' | 'error' | 'warning' | 'info' | 'processing';
export type NxTagSize = 'default' | 'small';

export interface NxTagConfig {
    /**
     * Tag content text
     */
    content: string;

    /**
     * Tag color
     */
    color?: NxTagColor;

    /**
     * Tag size
     */
    size?: NxTagSize;

    /**
     * Tag mode/behavior
     */
    mode?: NxTagMode;

    /**
     * Whether tag is selected (for checkable mode)
     */
    selected?: boolean;

    /**
     * Whether tag is disabled
     */
    disabled?: boolean;

    /**
     * Whether tag is checked (for checkable mode)
     */
    checked?: boolean;

    /**
     * Custom icon for closeable tags
     */
    closeIcon?: string;

    /**
     * Custom icon for checkable tags
     */
    checkIcon?: string;

    /**
     * Custom CSS classes
     */
    className?: string;

    /**
     * Custom styles
     */
    style?: Record<string, any>;

    /**
     * Tag value for form integration
     */
    value?: any;

    /**
     * Whether tag can be closed
     */
    closable?: boolean;
}

export interface NxTagContext {
    /**
     * Tag text content
     */
    content: string;

    /**
     * Current tag mode
     */
    mode: NxTagMode;

    /**
     * Whether tag is selected/checked
     */
    isSelected: boolean;

    /**
     * Whether tag is disabled
     */
    isDisabled: boolean;

    /**
     * Current tag color
     */
    color: NxTagColor;

    /**
     * Tag value
     */
    value: any;
}

export interface NxTagClickEvent {
    /**
     * Tag value
     */
    value: any;

    /**
     * Tag content
     */
    content: string;

    /**
     * Whether tag is selected/checked
     */
    selected: boolean;

    /**
     * Original DOM event
     */
    event: MouseEvent | KeyboardEvent;
}

export interface NxTagCloseEvent {
    /**
     * Tag value
     */
    value: any;

    /**
     * Tag content
     */
    content: string;

    /**
     * Original DOM event
     */
    event: MouseEvent | KeyboardEvent;
}

export interface NxTagChangeEvent {
    /**
     * Tag value
     */
    value: any;

    /**
     * Tag content
     */
    content: string;

    /**
     * Whether tag is checked/selected
     */
    checked: boolean;

    /**
     * Original DOM event
     */
    event: MouseEvent | KeyboardEvent;
}