import {
    ChangeDetectorRef,
    Component,
    computed,
    ContentChild,
    DestroyRef,
    effect,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    inject,
    input,
    OnDestroy,
    OnInit,
    output,
    signal,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { NxIconDirective } from '../icon/icon.directive';
import { OverlayService, OverlayPlacement } from '../../utils/overlay.service';
import {
    DEFAULT_DROPDOWN_CONFIG,
    NxDropdownConfig,
    NxDropdownItemClick,
    NxDropdownItem,
    NxDropdownPlacement,
    NxDropdownTrigger,
    NxDropdownVisibleChange,
} from './dropdown.types';
import { DropdownService } from './dropdown.service';

/**
 * Convert dropdown placement to overlay placement
 */
function toOverlayPlacement(placement: NxDropdownPlacement): OverlayPlacement {
    const placementMap: Record<NxDropdownPlacement, OverlayPlacement> = {
        top: 'top',
        topLeft: 'topStart',
        topRight: 'topEnd',
        bottom: 'bottom',
        bottomLeft: 'bottomStart',
        bottomRight: 'bottomEnd',
        left: 'left',
        leftTop: 'leftStart',
        leftBottom: 'leftEnd',
        right: 'right',
        rightTop: 'rightStart',
        rightBottom: 'rightEnd',
    };
    return placementMap[placement];
}

/**
 * Convert overlay placement to dropdown placement
 */
function fromOverlayPlacement(placement: OverlayPlacement): NxDropdownPlacement {
    const placementMap: Record<OverlayPlacement, NxDropdownPlacement> = {
        top: 'top',
        topStart: 'topLeft',
        topEnd: 'topRight',
        bottom: 'bottom',
        bottomStart: 'bottomLeft',
        bottomEnd: 'bottomRight',
        left: 'left',
        leftStart: 'leftTop',
        leftEnd: 'leftBottom',
        right: 'right',
        rightStart: 'rightTop',
        rightEnd: 'rightBottom',
    };
    return placementMap[placement];
}

@Component({
    selector: 'nx-dropdown',
    standalone: true,
    imports: [NxIconDirective],
    template: `
        <div class="nx-dropdown-trigger" #trigger>
            <ng-content select="[nx-dropdown-trigger]"></ng-content>
        </div>

        @if (visible()) {
            <div
                class="nx-dropdown-backdrop"
                (click)="onBackdropClick()"></div>
        }

        @if (visible()) {
            <div
                class="nx-dropdown"
                [class.nx-dropdown-placement-top]="actualPlacement().includes('Top')"
                [class.nx-dropdown-placement-bottom]="actualPlacement().includes('Bottom')"
                [class.nx-dropdown-placement-left]="actualPlacement().includes('Left')"
                [class.nx-dropdown-placement-right]="actualPlacement().includes('Right')"
                [style.width]="dropdownWidth()"
                [style.max-height]="config().maxHeight + 'px'"
                #dropdown>

                @if (showArrow()) {
                    <div class="nx-dropdown-arrow"></div>
                }

                <div class="nx-dropdown-content">
                    <ng-content></ng-content>
                </div>
            </div>
        }
    `,
    styleUrl: './style/dropdown.component.scss',
    host: {
        class: 'nx-dropdown-container',
        '[class.nx-dropdown-open]': 'visible()',
    }
})
export class DropdownComponent implements OnInit, OnDestroy {
    private cdr = inject(ChangeDetectorRef);
    private destroyRef = inject(DestroyRef);
    private overlayService = inject(OverlayService);
    private dropdownService = inject(DropdownService);
    private elementRef = inject(ElementRef<HTMLElement>);

    @ViewChild('trigger', { static: true }) triggerElement!: ElementRef<HTMLElement>;
    @ViewChild('dropdown', { static: false }) dropdownElement?: ElementRef<HTMLElement>;

    // Inputs
    config = input<NxDropdownConfig>({});
    items = input<NxDropdownItem[]>([]);
    disabled = input<boolean>(false);

    // Outputs
    visibleChange = output<NxDropdownVisibleChange>();
    itemClick = output<NxDropdownItemClick>();

    // Internal state
    private dropdownId = `dropdown-${Math.random().toString(36).substr(2, 9)}`;
    private hoverTimeoutRef?: number;
    private subscriptions: any[] = [];

    // Signals
    visible = signal(false);
    actualPlacement = signal<NxDropdownPlacement>('bottomLeft');

    // Computed properties
    fullConfig = computed(() => ({ ...DEFAULT_DROPDOWN_CONFIG, ...this.config() }));
    triggerMode = computed(() => this.fullConfig().trigger);
    closeOnOutsideClick = computed(() => this.fullConfig().closeOnOutsideClick);
    showArrow = computed(() => this.fullConfig().showArrow);

    dropdownWidth = computed(() => {
        const width = this.fullConfig().width;
        return typeof width === 'number' ? `${width}px` : width;
    });

    @HostBinding('attr.aria-expanded')
    get ariaExpanded(): boolean {
        return this.visible();
    }

    @HostBinding('attr.aria-haspopup')
    get ariaHasPopup(): string {
        return 'menu';
    }

    constructor() {
        // Auto-cleanup when component is destroyed
        effect(() => {
            if (this.visible()) {
                this.positionDropdown();
            }
        });
    }

    ngOnInit(): void {
        this.dropdownService.registerDropdown(this.dropdownId, () => this.close());
        this.setupEventListeners();

        // Listen for dropdown close events
        const closeSubscription = this.dropdownService.close$.pipe(
            filter(id => id !== this.dropdownId)
        ).subscribe(() => {
            if (this.visible()) {
                this.close();
            }
        });
        this.subscriptions.push(closeSubscription);
    }

    ngOnDestroy(): void {
        this.dropdownService.unregisterDropdown(this.dropdownId);
        this.close();
        this.clearHoverTimeout();

        // Unsubscribe from all subscriptions
        this.subscriptions.forEach(subscription => {
            if (subscription && subscription.unsubscribe) {
                subscription.unsubscribe();
            }
        });
        this.subscriptions = [];
    }

    private setupEventListeners(): void {
        const triggerElement = this.triggerElement.nativeElement;

        if (this.triggerMode() === 'click') {
            const clickSubscription = fromEvent(triggerElement, 'click').subscribe(() => this.toggle());
            this.subscriptions.push(clickSubscription);

            const keydownSubscription = fromEvent<KeyboardEvent>(triggerElement, 'keydown').pipe(
                filter(event => event.key === 'Enter' || event.key === ' '),
            ).subscribe(event => {
                event.preventDefault();
                this.open();
            });
            this.subscriptions.push(keydownSubscription);
        } else if (this.triggerMode() === 'hover') {
            const mouseenterSubscription = fromEvent(triggerElement, 'mouseenter').subscribe(() => this.onHoverEnter());
            this.subscriptions.push(mouseenterSubscription);

            const mouseleaveSubscription = fromEvent(triggerElement, 'mouseleave').subscribe(() => this.onHoverLeave());
            this.subscriptions.push(mouseleaveSubscription);
        }

        // Escape key handling
        if (this.fullConfig().closeOnEscape) {
            const escapeSubscription = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
                filter(event => event.key === 'Escape' && this.visible()),
            ).subscribe(() => this.close());
            this.subscriptions.push(escapeSubscription);
        }
    }

    private onHoverEnter(): void {
        this.clearHoverTimeout();
        this.hoverTimeoutRef = window.setTimeout(() => {
            this.open();
        }, this.fullConfig().hoverDelay);
    }

    private onHoverLeave(): void {
        this.clearHoverTimeout();

        // Check if mouse is still over dropdown
        setTimeout(() => {
            if (this.dropdownElement && !this.dropdownElement.nativeElement.matches(':hover')) {
                this.close();
            }
        }, 100);
    }

    private clearHoverTimeout(): void {
        if (this.hoverTimeoutRef) {
            clearTimeout(this.hoverTimeoutRef);
            this.hoverTimeoutRef = undefined;
        }
    }

    open(): void {
        if (this.disabled() || this.visible()) {
            return;
        }

        // Close other dropdowns
        this.dropdownService.closeAllDropdowns();

        this.visible.set(true);
        this.visibleChange.emit({ visible: true, dropdown: this.elementRef.nativeElement });
        this.cdr.detectChanges();

        // Position dropdown after it's rendered
        setTimeout(() => {
            this.positionDropdown();
        }, 0);
    }

    close(): void {
        if (!this.visible()) {
            return;
        }

        this.visible.set(false);
        this.visibleChange.emit({ visible: false, dropdown: this.elementRef.nativeElement });
        this.dropdownService.notifyClose(this.dropdownId);
        this.cdr.detectChanges();
    }

    toggle(): void {
        if (this.visible()) {
            this.close();
        } else {
            this.open();
        }
    }

    private positionDropdown(): void {
        if (!this.dropdownElement || !this.visible()) {
            return;
        }

        const triggerElement = this.triggerElement.nativeElement;
        const dropdownElement = this.dropdownElement.nativeElement;

        const config = {
            placement: toOverlayPlacement(this.fullConfig().placement),
            offset: this.fullConfig().offset,
            autoReposition: this.fullConfig().autoReposition,
            zIndex: this.fullConfig().zIndex,
        };

        const position = this.overlayService.calculatePosition(triggerElement, dropdownElement, config);
        this.overlayService.applyPosition(dropdownElement, position);
        this.overlayService.register(triggerElement, dropdownElement, config);

        // Update actual placement
        this.actualPlacement.set(fromOverlayPlacement(position.placement));
        this.cdr.detectChanges();
    }

    onBackdropClick(): void {
        if (this.closeOnOutsideClick()) {
            this.close();
        }
    }

    onItemClick(item: NxDropdownItem, index: number, event: MouseEvent): void {
        if (item.disabled || item.type === 'divider' || item.type === 'header') {
            return;
        }

        this.itemClick.emit({ item, index, event });

        if (item.onClick) {
            item.onClick();
        }

        // Auto-close on item click for click-triggered dropdowns
        if (this.triggerMode() === 'click') {
            this.close();
        }
    }

    @HostListener('click', ['$event'])
    private onHostClick(event: MouseEvent): void {
        // Prevent event propagation if already handled
        if (event.target === this.elementRef.nativeElement) {
            event.stopPropagation();
        }
    }
}