/**
 * Select Component Types and Interfaces
 */

/**
 * Select component modes
 */
export type SelectMode = 'default' | 'multiple' | 'tags';

/**
 * Select component sizes
 */
export type SelectSize = 'small' | 'default' | 'large';

/**
 * Select option interface
 */
export interface SelectOption<T = any> {
  /** Display label for the option */
  label: string;
  /** Option value */
  value: T;
  /** Whether the option is disabled */
  disabled?: boolean;
  /** Optional group for organizing options */
  group?: string;
  /** Optional additional data for custom templates */
  data?: any;
}

/**
 * Select dropdown placement options
 */
export type SelectPlacement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';

/**
 * Template context for custom option rendering
 */
export interface SelectOptionTemplateContext<T = any> {
  /** The option being rendered */
  $implicit: SelectOption<T>;
  /** Whether this option is selected */
  selected: boolean;
  /** Whether this option is disabled */
  disabled: boolean;
  /** The current index in the options list */
  index: number;
}

/**
 * Template context for custom selected value display
 */
export interface SelectSelectionTemplateContext<T = any> {
  /** The selected option(s) */
  $implicit: SelectOption<T> | SelectOption<T>[];
  /** Whether multiple values are selected */
  multiple: boolean;
  /** Number of selected items */
  count: number;
}

/**
 * Select search event data
 */
export interface SelectSearchEvent {
  /** Current search query */
  query: string;
  /** Number of matching options */
  resultCount: number;
  /** Whether this is server-side search */
  serverSide: boolean;
}

/**
 * Select change event data
 */
export interface SelectChangeEvent<T = any> {
  /** The new value(s) */
  value: T | T[];
  /** The selected option(s) */
  option: SelectOption<T> | SelectOption<T>[];
  /** Whether this was a programmatic change */
  isUserInput: boolean;
}

/**
 * Select focus event data
 */
export interface SelectFocusEvent<T = any> {
  /** The focused option */
  option: SelectOption<T>;
  /** Current keyboard navigation state */
  source: 'keyboard' | 'mouse';
}

/**
 * Select blur event data
 */
export interface SelectBlurEvent<T = any> {
  /** The option that had focus when blur occurred */
  option: SelectOption<T> | null;
  /** Whether a selection was made before blur */
  selected: boolean;
}

/**
 * Internal select state for debugging
 */
export interface SelectInternalState<T = any> {
  /** Whether the dropdown is open */
  isOpen: boolean;
  /** Current search value */
  searchValue: string;
  /** Filtered options list */
  filteredOptions: SelectOption<T>[];
  /** Currently active option for keyboard navigation */
  activeOption: SelectOption<T> | null;
  /** Currently selected option (single mode) */
  selectedOption: SelectOption<T> | null;
  /** Currently selected options (multi mode) */
  selectedOptions: SelectOption<T>[];
  /** Loading state */
  isLoading: boolean;
  /** Disabled state */
  isDisabled: boolean;
  /** Whether component has been touched */
  isTouched: boolean;
  /** Whether component has focus */
  isFocused: boolean;
}