/*
 * Public API Surface of ngx-unnamed
 */

// Button exports
export { ButtonComponent } from './lib/components/button/button.component';
export type { NxButtonShapes, NxButtonSizes, NxButtonVariants } from './lib/components/button/button.component';

// Input exports
export { InputDirective } from './lib/components/input/input.directive';
export type { NxInputSize, NxInputStatus, NxInputVariant } from './lib/components/input/input.directive';

// Modal exports
export { ModalComponent } from './lib/components/modal/modal.component';
export { ModalService } from './lib/components/modal/modal.service';
export { ModalRef } from './lib/components/modal/modal.ref';
export type {
    NxModalConfig,
    NxModalResult,
    NxModalRef as INxModalRef,
    NxModalSize
} from './lib/components/modal/modal.config';

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

// Icon components
export { NxIconComponent } from './lib/components/icon/icon.component';
export { NxIconDirective } from './lib/components/icon/icon.directive';
export { NxIconModule } from './lib/components/icon/icon.module';
export { IconService, NX_ICONS } from './lib/components/icon/icon.service';
export { provideNxIcons } from './lib/components/icon/provide-icons';

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
