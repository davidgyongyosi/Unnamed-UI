/*
 * Public API Surface of ngx-unnamed
 */

// Button exports
export { ButtonComponent } from './lib/components/button/button.component';
export type { NxButtonShapes, NxButtonSizes, NxButtonVariants } from './lib/components/button/button.component';

// Alert exports
export { AlertComponent } from './lib/components/alert/alert.component';
export type { NxAlertType, NxAlertConfig, NxAlertIcons } from './lib/components/alert/alert.types';

// Input exports
export { InputDirective } from './lib/components/input/input.directive';
export type { NxInputSize, NxInputStatus, NxInputVariant } from './lib/components/input/input.directive';

// Modal exports
export { ModalComponent } from './lib/components/modal/modal.component';
export { NxModalService } from './lib/components/modal/nx-modal.service';
export { ModalRef } from './lib/components/modal/modal.ref';
export type {
    NxModalConfig,
    NxModalResult,
    NxModalRef as INxModalRef,
    NxModalSize
} from './lib/components/modal/modal.config';
export type { NxModalRef } from './lib/components/modal/nx-modal.service';

// Select exports
export { SelectComponent } from './lib/components/select/select.component';
export type {
    SelectOption,
    SelectMode,
    SelectSize,
    SelectPlacement,
    SelectOptionTemplateContext,
    SelectSelectionTemplateContext,
    SelectSearchEvent,
    SelectChangeEvent,
    SelectFocusEvent,
    SelectBlurEvent,
    SelectInternalState
} from './lib/components/select/select.types';

// Simple Table exports (basic working version)
export { SimpleTableComponent } from './lib/components/table/table.simple.component';
export type { SimpleTableColumn, SimpleTableRow } from './lib/components/table/table.simple.component';

// Table exports
export { TableComponent } from './lib/components/table/table.component';
export { TableColumnComponent } from './lib/components/table/table-column.component';
export type {
    TableColumn,
    TableRow,
    TableSort,
    TablePagination,
    TableSelection,
    TableCell,
    TableSortEvent,
    TableSelectionEvent,
    TablePageChangeEvent,
    TableRowClickEvent,
    TableConfig,
    NxTableSize,
    NxTableAlign,
    NxTableSortDirection,
    NxTableSelectionMode,
    NxTableCellTemplateContext
} from './lib/components/table/table.types';

// Form components
export { FormComponent } from './lib/components/form/form.component';
export { FormItemComponent } from './lib/components/form/form-item.component';
export { FormLabelComponent } from './lib/components/form/form-label.component';
export { FormControlComponent } from './lib/components/form/form-control.component';
export type {
    FormLayout,
    FormValidateStatus,
    FormItemColSpan,
    FormConfig,
    FormItemConfig,
    FormLabelConfig,
    FormControlConfig,
    FormValidationError
} from './lib/components/form/form.types';
export { FormValidationUtils, DEFAULT_FORM_CONFIG, DEFAULT_FORM_ITEM_CONFIG, DEFAULT_FORM_LABEL_CONFIG, DEFAULT_FORM_CONTROL_CONFIG } from './lib/components/form/form.types';

// Dropdown components
export { DropdownComponent } from './lib/components/dropdown/dropdown.component';
export { DropdownMenuComponent } from './lib/components/dropdown/dropdown.menu.component';
export { DropdownService } from './lib/components/dropdown/dropdown.service';
export type {
    NxDropdownConfig,
    NxDropdownItem,
    NxDropdownPlacement,
    NxDropdownTrigger,
    NxDropdownContext,
    NxDropdownItemContext,
    NxDropdownVisibleChange,
    NxDropdownItemClick
} from './lib/components/dropdown/dropdown.types';

// Badge components
export { BadgeComponent } from './lib/components/badge/badge.component';
export type {
    NxBadgeConfig,
    NxBadgeContext,
    NxBadgeStatus,
    NxBadgePosition,
    NxBadgeSize
} from './lib/components/badge/badge.types';

// Tag components
export { TagComponent } from './lib/components/tag/tag.component';
export type {
    NxTagConfig,
    NxTagContext,
    NxTagMode,
    NxTagColor,
    NxTagSize,
    NxTagClickEvent,
    NxTagCloseEvent,
    NxTagChangeEvent
} from './lib/components/tag/tag.types';

// Icon components
export { NxIconComponent } from './lib/components/icon/icon.component';
export { NxIconDirective } from './lib/components/icon/icon.directive';
export { NxIconModule } from './lib/components/icon/icon.module';
export { IconService, NX_ICONS } from './lib/components/icon/icon.service';
export { provideNxIcons } from './lib/components/icon/provide-icons';

// Grid components
export { NxGridComponent } from './lib/components/grid/grid.component';
export { NxGridColComponent } from './lib/components/grid/grid-col.component';
export { NxGridRowComponent } from './lib/components/grid/grid-row.component';
export type {
    NxGridConfig,
    NxGridContext,
    NxGridBreakpoints,
    NxGridColConfig,
    NxGridRowConfig,
    NxGridAlign,
    NxGridJustify,
    NxGridWrap,
    NxGridSpan,
    DEFAULT_GRID_CONFIG,
    DEFAULT_COL_CONFIG,
    DEFAULT_ROW_CONFIG
} from './lib/components/grid/grid.types';

// Card components
export { NxCardComponent } from './lib/components/card/card.component';
export type {
    NxCardConfig,
    NxCardContext,
    NxCardAction,
    NxCardMetaItem,
    NxCardClickEvent,
    NxCardHoverEvent,
    NxCardSelectEvent,
    NxCardSize,
    NxCardVariant,
    NxCardBorder,
    NxCardShadow,
    NxCardGridConfig,
    DEFAULT_CARD_CONFIG,
    DEFAULT_CARD_GRID_CONFIG
} from './lib/components/card/card.types';

// Pagination components
export { NxPaginationComponent } from './lib/components/pagination/pagination.component';
export type {
    NxPaginationConfig,
    NxPaginationContext,
    NxPaginationChangeEvent,
    NxPaginationPageEvent,
    NxPaginationVariant,
    NxPaginationSize,
    NxPaginationLayoutConfig,
    DEFAULT_PAGINATION_CONFIG,
    DEFAULT_PAGINATION_LAYOUT_CONFIG
} from './lib/components/pagination/pagination.types';

// Utility exports
export { ControlValueAccessorBase } from './lib/utils/control-value-accessor-base';
export { FocusMonitor } from './lib/utils/focus-monitor';
export type { FocusOrigin } from './lib/utils/focus-monitor';
export { OverlayService } from './lib/utils/overlay.service';
export type { OverlayPlacement, OverlayPosition, OverlayConfig } from './lib/utils/overlay.service';
export { ResponsiveUtility, DEFAULT_BREAKPOINTS } from './lib/utils/responsive.utility';
export type { Breakpoint, BreakpointConfig } from './lib/utils/responsive.utility';
export { A11yUtility } from './lib/utils/a11y.utility';
export type { AriaPoliteness } from './lib/utils/a11y.utility';
export { VirtualScroller } from './lib/utils/virtual-scroll.utility';
export type { VirtualScrollConfig, VirtualScrollData } from './lib/utils/virtual-scroll.utility';
