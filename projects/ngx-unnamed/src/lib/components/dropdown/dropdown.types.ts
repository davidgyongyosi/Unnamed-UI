/**
 * Type definitions and interfaces for the Dropdown component
 */

import { TemplateRef } from '@angular/core';

/**
 * Dropdown trigger modes
 */
export type NxDropdownTrigger = 'click' | 'hover' | 'manual';

/**
 * Dropdown placement options
 */
export type NxDropdownPlacement =
    | 'top'
    | 'topLeft'
    | 'topRight'
    | 'bottom'
    | 'bottomLeft'
    | 'bottomRight'
    | 'left'
    | 'leftTop'
    | 'leftBottom'
    | 'right'
    | 'rightTop'
    | 'rightBottom';

/**
 * Dropdown item interface
 */
export interface NxDropdownItem {
    /** Unique key for the item */
    key: string;
    /** Display label */
    label: string;
    /** Item type */
    type?: 'item' | 'divider' | 'header';
    /** Whether the item is disabled */
    disabled?: boolean;
    /** Whether the item is selected */
    selected?: boolean;
    /** Whether to show a danger style */
    danger?: boolean;
    /** Icon for the item */
    icon?: string;
    /** Custom template for the item */
    template?: TemplateRef<any>;
    /** Click handler */
    onClick?: () => void;
}

/**
 * Dropdown configuration interface
 */
export interface NxDropdownConfig {
    /** Trigger mode */
    trigger?: NxDropdownTrigger;
    /** Preferred placement */
    placement?: NxDropdownPlacement;
    /** Offset from trigger in pixels */
    offset?: number;
    /** Whether to automatically reposition on collision */
    autoReposition?: boolean;
    /** Whether to close on outside click */
    closeOnOutsideClick?: boolean;
    /** Whether to close on escape key */
    closeOnEscape?: boolean;
    /** Delay for hover trigger in milliseconds */
    hoverDelay?: number;
    /** Custom width for dropdown */
    width?: string | number;
    /** Maximum height for dropdown */
    maxHeight?: string | number;
    /** Whether to show arrow */
    showArrow?: boolean;
    /** Z-index for dropdown */
    zIndex?: number;
}

/**
 * Dropdown context for custom templates
 */
export interface NxDropdownContext {
    /** Whether dropdown is visible */
    visible: boolean;
    /** Function to close dropdown */
    close: () => void;
    /** Trigger element reference */
    trigger: HTMLElement;
}

/**
 * Dropdown menu item template context
 */
export interface NxDropdownItemContext {
    /** Item data */
    item: NxDropdownItem;
    /** Item index */
    index: number;
    /** Whether item is selected */
    selected: boolean;
}

/**
 * Dropdown events
 */
export interface NxDropdownVisibleChange {
    /** Current visibility state */
    visible: boolean;
    /** Dropdown element */
    dropdown: HTMLElement;
}

export interface NxDropdownItemClick {
    /** Clicked item */
    item: NxDropdownItem;
    /** Item index */
    index: number;
    /** Original event */
    event: MouseEvent;
}

/**
 * Default dropdown configuration
 */
export const DEFAULT_DROPDOWN_CONFIG: Required<NxDropdownConfig> = {
    trigger: 'click',
    placement: 'bottomLeft',
    offset: 8,
    autoReposition: true,
    closeOnOutsideClick: true,
    closeOnEscape: true,
    hoverDelay: 150,
    width: 'auto',
    maxHeight: 256,
    showArrow: false,
    zIndex: 1050
};