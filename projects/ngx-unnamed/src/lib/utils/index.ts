/**
 * Public API for utility classes and services
 */

// Control Value Accessor Base
export { ControlValueAccessorBase } from './control-value-accessor-base';

// Focus Monitor
export { FocusMonitor } from './focus-monitor';
export type { FocusOrigin } from './focus-monitor';

// Overlay Service
export { OverlayService } from './overlay.service';
export type { OverlayPlacement, OverlayPosition, OverlayConfig } from './overlay.service';

// Responsive Utility
export { ResponsiveUtility, DEFAULT_BREAKPOINTS } from './responsive.utility';
export type { Breakpoint, BreakpointConfig } from './responsive.utility';

// A11y Utility
export { A11yUtility } from './a11y.utility';
export type { AriaPoliteness } from './a11y.utility';
