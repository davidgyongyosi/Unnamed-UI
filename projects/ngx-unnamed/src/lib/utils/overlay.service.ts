import { Injectable, NgZone, OnDestroy, inject } from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

/**
 * Placement options for overlays.
 */
export type OverlayPlacement =
    | 'top'
    | 'topStart'
    | 'topEnd'
    | 'right'
    | 'rightStart'
    | 'rightEnd'
    | 'bottom'
    | 'bottomStart'
    | 'bottomEnd'
    | 'left'
    | 'leftStart'
    | 'leftEnd';

/**
 * Position coordinates for an overlay.
 */
export interface OverlayPosition {
    top: number;
    left: number;
    placement: OverlayPlacement;
}

/**
 * Configuration for overlay positioning.
 */
export interface OverlayConfig {
    /** The preferred placement of the overlay */
    placement: OverlayPlacement;
    /** Offset from the trigger element in pixels */
    offset?: number;
    /** Whether to automatically reposition on collision */
    autoReposition?: boolean;
    /** Z-index for the overlay */
    zIndex?: number;
}

/**
 * Registered overlay data for tracking.
 */
interface OverlayData {
    triggerElement: HTMLElement;
    overlayElement: HTMLElement;
    config: Required<OverlayConfig>;
    updatePosition: () => void;
}

/**
 * Service for positioning and managing overlays (dropdowns, popovers, tooltips).
 * Provides automatic repositioning on scroll/resize and collision detection.
 *
 * @example
 * ```typescript
 * export class DropdownComponent {
 *   private overlayService = inject(OverlayService);
 *
 *   showDropdown(): void {
 *     const position = this.overlayService.calculatePosition(
 *       this.triggerElement,
 *       this.dropdownElement,
 *       { placement: 'bottom', autoReposition: true }
 *     );
 *     this.overlayService.applyPosition(this.dropdownElement, position);
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class OverlayService implements OnDestroy {
    private ngZone = inject(NgZone);

    /** Map of registered overlays */
    private overlays = new Map<HTMLElement, OverlayData>();

    /** Subject for cleanup on destroy */
    private destroy$ = new Subject<void>();

    /** Counter for assigning z-indices */
    private zIndexCounter = 1000;

    /** Default offset in pixels */
    private readonly DEFAULT_OFFSET = 8;

    constructor() {
        // Set up scroll and resize listeners outside Angular zone for performance
        this.ngZone.runOutsideAngular(() => {
            fromEvent(window, 'scroll', { capture: true })
                .pipe(debounceTime(10), takeUntil(this.destroy$))
                .subscribe(() => this.updateAllPositions());

            fromEvent(window, 'resize')
                .pipe(debounceTime(50), takeUntil(this.destroy$))
                .subscribe(() => this.updateAllPositions());
        });
    }

    /**
     * Calculates the optimal position for an overlay relative to a trigger element.
     *
     * @param triggerElement The element that triggers the overlay
     * @param overlayElement The overlay element to position
     * @param config Configuration for positioning
     * @returns The calculated position coordinates
     */
    calculatePosition(triggerElement: HTMLElement, overlayElement: HTMLElement, config: OverlayConfig): OverlayPosition {
        const fullConfig: Required<OverlayConfig> = {
            placement: config.placement,
            offset: config.offset ?? this.DEFAULT_OFFSET,
            autoReposition: config.autoReposition ?? true,
            zIndex: config.zIndex ?? this.zIndexCounter++,
        };

        const triggerRect = triggerElement.getBoundingClientRect();
        const overlayRect = overlayElement.getBoundingClientRect();
        const viewport = this.getViewportSize();

        let placement = fullConfig.placement;

        // Check for collisions and find best placement if autoReposition is enabled
        if (fullConfig.autoReposition) {
            placement = this.findBestPlacement(triggerRect, overlayRect, fullConfig.placement, fullConfig.offset, viewport);
        }

        return this.calculatePositionForPlacement(triggerRect, overlayRect, placement, fullConfig.offset);
    }

    /**
     * Applies the calculated position to an overlay element.
     *
     * @param overlayElement The overlay element to position
     * @param position The position to apply
     */
    applyPosition(overlayElement: HTMLElement, position: OverlayPosition): void {
        overlayElement.style.position = 'fixed';
        overlayElement.style.top = `${position.top}px`;
        overlayElement.style.left = `${position.left}px`;
    }

    /**
     * Registers an overlay for automatic position updates on scroll/resize.
     *
     * @param triggerElement The trigger element
     * @param overlayElement The overlay element
     * @param config Configuration for positioning
     */
    register(triggerElement: HTMLElement, overlayElement: HTMLElement, config: OverlayConfig): void {
        const fullConfig: Required<OverlayConfig> = {
            placement: config.placement,
            offset: config.offset ?? this.DEFAULT_OFFSET,
            autoReposition: config.autoReposition ?? true,
            zIndex: config.zIndex ?? this.zIndexCounter++,
        };

        const updatePosition = (): void => {
            const position = this.calculatePosition(triggerElement, overlayElement, fullConfig);
            this.applyPosition(overlayElement, position);
            overlayElement.style.zIndex = fullConfig.zIndex.toString();
        };

        const overlayData: OverlayData = {
            triggerElement,
            overlayElement,
            config: fullConfig,
            updatePosition,
        };

        this.overlays.set(overlayElement, overlayData);

        // Apply initial position
        updatePosition();
    }

    /**
     * Unregisters an overlay to stop automatic updates.
     *
     * @param overlayElement The overlay element to unregister
     */
    unregister(overlayElement: HTMLElement): void {
        this.overlays.delete(overlayElement);
    }

    /**
     * Gets the next available z-index value.
     *
     * @returns The next z-index value
     */
    getNextZIndex(): number {
        return this.zIndexCounter++;
    }

    /**
     * Cleans up resources on destroy.
     */
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.overlays.clear();
    }

    /**
     * Updates positions for all registered overlays.
     */
    private updateAllPositions(): void {
        this.ngZone.run(() => {
            this.overlays.forEach((data) => {
                data.updatePosition();
            });
        });
    }

    /**
     * Finds the best placement that avoids viewport collisions.
     *
     * @param triggerRect Trigger element bounds
     * @param overlayRect Overlay element bounds
     * @param preferredPlacement The preferred placement
     * @param offset Offset in pixels
     * @param viewport Viewport dimensions
     * @returns The best placement option
     */
    private findBestPlacement(
        triggerRect: DOMRect,
        overlayRect: DOMRect,
        preferredPlacement: OverlayPlacement,
        offset: number,
        viewport: { width: number; height: number }
    ): OverlayPlacement {
        // Try preferred placement first
        if (!this.hasCollision(triggerRect, overlayRect, preferredPlacement, offset, viewport)) {
            return preferredPlacement;
        }

        // Try opposite placement
        const oppositePlacement = this.getOppositePlacement(preferredPlacement);
        if (!this.hasCollision(triggerRect, overlayRect, oppositePlacement, offset, viewport)) {
            return oppositePlacement;
        }

        // Try all placements and return first without collision
        const allPlacements: OverlayPlacement[] = [
            'bottom',
            'top',
            'right',
            'left',
            'bottomStart',
            'bottomEnd',
            'topStart',
            'topEnd',
            'rightStart',
            'rightEnd',
            'leftStart',
            'leftEnd',
        ];

        for (const placement of allPlacements) {
            if (!this.hasCollision(triggerRect, overlayRect, placement, offset, viewport)) {
                return placement;
            }
        }

        // If all placements have collisions, return preferred
        return preferredPlacement;
    }

    /**
     * Checks if a placement would cause a viewport collision.
     *
     * @param triggerRect Trigger element bounds
     * @param overlayRect Overlay element bounds
     * @param placement The placement to check
     * @param offset Offset in pixels
     * @param viewport Viewport dimensions
     * @returns True if there would be a collision
     */
    private hasCollision(
        triggerRect: DOMRect,
        overlayRect: DOMRect,
        placement: OverlayPlacement,
        offset: number,
        viewport: { width: number; height: number }
    ): boolean {
        const position = this.calculatePositionForPlacement(triggerRect, overlayRect, placement, offset);

        const right = position.left + overlayRect.width;
        const bottom = position.top + overlayRect.height;

        return position.left < 0 || position.top < 0 || right > viewport.width || bottom > viewport.height;
    }

    /**
     * Calculates position coordinates for a specific placement.
     *
     * @param triggerRect Trigger element bounds
     * @param overlayRect Overlay element bounds
     * @param placement The placement option
     * @param offset Offset in pixels
     * @returns Position coordinates
     */
    private calculatePositionForPlacement(triggerRect: DOMRect, overlayRect: DOMRect, placement: OverlayPlacement, offset: number): OverlayPosition {
        let top = 0;
        let left = 0;

        switch (placement) {
            case 'top':
                top = triggerRect.top - overlayRect.height - offset;
                left = triggerRect.left + (triggerRect.width - overlayRect.width) / 2;
                break;
            case 'topStart':
                top = triggerRect.top - overlayRect.height - offset;
                left = triggerRect.left;
                break;
            case 'topEnd':
                top = triggerRect.top - overlayRect.height - offset;
                left = triggerRect.right - overlayRect.width;
                break;
            case 'bottom':
                top = triggerRect.bottom + offset;
                left = triggerRect.left + (triggerRect.width - overlayRect.width) / 2;
                break;
            case 'bottomStart':
                top = triggerRect.bottom + offset;
                left = triggerRect.left;
                break;
            case 'bottomEnd':
                top = triggerRect.bottom + offset;
                left = triggerRect.right - overlayRect.width;
                break;
            case 'left':
                top = triggerRect.top + (triggerRect.height - overlayRect.height) / 2;
                left = triggerRect.left - overlayRect.width - offset;
                break;
            case 'leftStart':
                top = triggerRect.top;
                left = triggerRect.left - overlayRect.width - offset;
                break;
            case 'leftEnd':
                top = triggerRect.bottom - overlayRect.height;
                left = triggerRect.left - overlayRect.width - offset;
                break;
            case 'right':
                top = triggerRect.top + (triggerRect.height - overlayRect.height) / 2;
                left = triggerRect.right + offset;
                break;
            case 'rightStart':
                top = triggerRect.top;
                left = triggerRect.right + offset;
                break;
            case 'rightEnd':
                top = triggerRect.bottom - overlayRect.height;
                left = triggerRect.right + offset;
                break;
        }

        return { top, left, placement };
    }

    /**
     * Gets the opposite placement for a given placement.
     *
     * @param placement The placement to invert
     * @returns The opposite placement
     */
    private getOppositePlacement(placement: OverlayPlacement): OverlayPlacement {
        const opposites: Record<OverlayPlacement, OverlayPlacement> = {
            top: 'bottom',
            topStart: 'bottomStart',
            topEnd: 'bottomEnd',
            bottom: 'top',
            bottomStart: 'topStart',
            bottomEnd: 'topEnd',
            left: 'right',
            leftStart: 'rightStart',
            leftEnd: 'rightEnd',
            right: 'left',
            rightStart: 'leftStart',
            rightEnd: 'leftEnd',
        };
        return opposites[placement];
    }

    /**
     * Gets the current viewport dimensions.
     *
     * @returns Viewport width and height
     */
    private getViewportSize(): { width: number; height: number } {
        return {
            width: window.innerWidth || document.documentElement.clientWidth,
            height: window.innerHeight || document.documentElement.clientHeight,
        };
    }
}
