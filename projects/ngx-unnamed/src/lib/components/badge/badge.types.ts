export type NxBadgeStatus = 'default' | 'success' | 'error' | 'warning' | 'info';
export type NxBadgeSize = 'default' | 'small';
export type NxBadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface NxBadgeConfig {
    /**
     * Badge content - can be a string for text badges or number for count badges
     */
    content?: string | number;

    /**
     * Badge status/color
     */
    status?: NxBadgeStatus;

    /**
     * Badge size
     */
    size?: NxBadgeSize;

    /**
     * Position relative to parent element
     */
    position?: NxBadgePosition;

    /**
     * Show as a dot (no content) - useful for status indicators
     */
    dot?: boolean;

    /**
     * Show count badge with overflow formatting (99+, 1000+, etc.)
     */
    count?: number;

    /**
     * Maximum count to display before showing overflow
     */
    maxCount?: number;

    /**
     * Custom color override
     */
    color?: string;

    /**
     * Show badge with border
     */
    bordered?: boolean;

    /**
     * Custom CSS classes
     */
    className?: string;

    /**
     * Custom styles
     */
    style?: Record<string, any>;
}

export interface NxBadgeContext {
    /**
     * Display text for the badge
     */
    displayText: string;

    /**
     * Whether badge is a dot indicator
     */
    isDot: boolean;

    /**
     * Whether badge shows a count
     */
    isCount: boolean;

    /**
     * Current badge status
     */
    status: NxBadgeStatus;
}