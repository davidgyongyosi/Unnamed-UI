export interface NxCardConfig {
    /** Card title text */
    title?: string;
    /** Card subtitle text */
    subtitle?: string;
    /** Card content/description text */
    content?: string;
    /** Whether the card is hoverable */
    hoverable?: boolean;
    /** Whether the card is loading */
    loading?: boolean;
    /** Whether the card is selectable */
    selectable?: boolean;
    /** Whether the card is selected */
    selected?: boolean;
    /** Whether the card is disabled */
    disabled?: boolean;
    /** Card size variant */
    size?: NxCardSize;
    /** Card variant */
    variant?: NxCardVariant;
    /** Card border style */
    border?: NxCardBorder;
    /** Card shadow level */
    shadow?: NxCardShadow;
    /** Custom CSS class */
    className?: string;
    /** Action area configuration */
    actions?: NxCardAction[];
    /** Meta information (likes, views, etc.) */
    meta?: NxCardMetaItem[];
    /** Cover image URL */
    cover?: string;
    /** Avatar image URL */
    avatar?: string;
    /** Extra content slot configuration */
    extra?: string;
}

export interface NxCardAction {
    /** Action text */
    text: string;
    /** Action type */
    type?: 'default' | 'primary' | 'danger';
    /** Action icon */
    icon?: string;
    /** Whether the action is disabled */
    disabled?: boolean;
    /** Action click handler */
    handler?: () => void;
}

export interface NxCardMetaItem {
    /** Meta item key */
    key: string;
    /** Meta item value */
    value: string | number;
    /** Meta item icon */
    icon?: string;
    /** Meta item color */
    color?: string;
}

export interface NxCardContext {
    /** Current card configuration */
    card: NxCardConfig;
    /** Whether the card is currently hovered */
    hovered: boolean;
    /** Whether the card is currently focused */
    focused: boolean;
    /** Whether the card is currently pressed */
    pressed: boolean;
    /** Card click handler */
    onClick: (event: MouseEvent) => void;
    /** Card hover handler */
    onHover: (hovered: boolean) => void;
    /** Card focus handler */
    onFocus: (focused: boolean) => void;
}

export type NxCardSize = 'small' | 'default' | 'large';
export type NxCardVariant = 'default' | 'bordered' | 'filled' | 'outlined';
export type NxCardBorder = 'none' | 'light' | 'medium' | 'strong';
export type NxCardShadow = 'none' | 'small' | 'medium' | 'large' | 'always';

export interface NxCardClickEvent {
    /** The card that was clicked */
    card: NxCardConfig;
    /** Click event details */
    event: MouseEvent;
    /** Card state at time of click */
    state: {
        hovered: boolean;
        focused: boolean;
        pressed: boolean;
    };
}

export interface NxCardHoverEvent {
    /** The card that was hovered */
    card: NxCardConfig;
    /** Whether the card is being hovered */
    hovered: boolean;
    /** Hover event details */
    event: MouseEvent;
}

export interface NxCardSelectEvent {
    /** The card that was selected/deselected */
    card: NxCardConfig;
    /** Whether the card is now selected */
    selected: boolean;
    /** Select event details */
    event: MouseEvent;
}

// Default configurations
export const DEFAULT_CARD_CONFIG: NxCardConfig = {
    size: 'default',
    variant: 'default',
    border: 'light',
    shadow: 'small',
    hoverable: false,
    loading: false,
    selectable: false,
    selected: false,
    disabled: false
};

// Grid layout configurations for card containers
export interface NxCardGridConfig {
    /** Number of columns in the grid */
    columns?: number | 'auto';
    /** Gap between cards */
    gap?: string | number;
    /** Responsive breakpoints */
    responsive?: boolean;
    /** Minimum card width */
    minWidth?: string | number;
    /** Maximum card width */
    maxWidth?: string | number;
}

export const DEFAULT_CARD_GRID_CONFIG: NxCardGridConfig = {
    columns: 'auto',
    gap: '16px',
    responsive: true,
    minWidth: '300px',
    maxWidth: '400px'
};