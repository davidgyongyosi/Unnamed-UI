import {
    Component,
    Input,
    Output,
    EventEmitter,
    computed,
    signal,
    HostBinding,
    inject,
    ChangeDetectionStrategy,
    Signal
} from '@angular/core';
import {
    NxCardConfig,
    NxCardContext,
    NxCardClickEvent,
    NxCardHoverEvent,
    NxCardSelectEvent,
    NxCardSize,
    NxCardVariant,
    NxCardBorder,
    NxCardShadow,
    DEFAULT_CARD_CONFIG
} from './card.types';
import { NxIconComponent } from '../icon/icon.component';
import { ButtonComponent } from '../button/button.component';

@Component({
    selector: 'nx-card',
    standalone: true,
    imports: [NxIconComponent, ButtonComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div
            [class]="cardClasses()"
            [attr.aria-label]="title$() || 'Card'"
            [attr.aria-disabled]="disabled$() || null"
            role="article"
            tabindex="selectable$() ? 0 : -1"
            (click)="onCardClick($event)"
            (mouseenter)="onMouseEnter($event)"
            (mouseleave)="onMouseLeave($event)"
            (focus)="onFocus($event)"
            (blur)="onBlur($event)"
            (keydown)="onKeyDown($event)">

            <!-- Loading State -->
            @if (loading$()) {
                <div class="nx-card-loading">
                    <div class="nx-card-loading-spinner"></div>
                    <div class="nx-card-loading-text">Loading...</div>
                </div>
            }

            <!-- Cover Image -->
            @if (cover$() && !loading$()) {
                <div class="nx-card-cover">
                    <img [src]="cover$()" [alt]="title$() || 'Card cover image'" />
                </div>
            }

            <!-- Card Content -->
            @if (!loading$()) {
                <div class="nx-card-body">
                    <!-- Avatar and Title Section -->
                    @if (avatar$() || title$() || subtitle$()) {
                        <div class="nx-card-header">
                            @if (avatar$()) {
                                <div class="nx-card-avatar">
                                    <img [src]="avatar$()" [alt]="title$() || 'Avatar'" />
                                </div>
                            }
                            <div class="nx-card-title-section">
                                @if (title$()) {
                                    <h3 class="nx-card-title">{{ title$() }}</h3>
                                }
                                @if (subtitle$()) {
                                    <p class="nx-card-subtitle">{{ subtitle$() }}</p>
                                }
                            </div>
                            @if (selectable$()) {
                                <div class="nx-card-select">
                                    <div class="nx-card-select-indicator"
                                         [class.selected]="selected$()">
                                        <nx-icon type="check-fat" />
                                    </div>
                                </div>
                            }
                        </div>
                    }

                    <!-- Card Description -->
                    @if (content$()) {
                        <div class="nx-card-content">
                            <p>{{ content$() }}</p>
                        </div>
                    }

                    <!-- Custom Content Slot -->
                    <div class="nx-card-extra">
                        <ng-content />
                    </div>

                    <!-- Meta Information -->
                    @if (meta$() && meta$().length > 0) {
                        <div class="nx-card-meta">
                            @for (metaItem of meta$(); track metaItem.key) {
                                <div class="nx-card-meta-item">
                                    @if (metaItem.icon) {
                                        <nx-icon [type]="metaItem.icon" />
                                    }
                                    <span>{{ metaItem.value }}</span>
                                </div>
                            }
                        </div>
                    }

                    <!-- Action Area -->
                    @if (actions$() && actions$().length > 0) {
                        <div class="nx-card-actions">
                            @for (action of actions$(); track action.text) {
                                <button nx-button
                                        [nxVariant]="getActionVariant(action)"
                                        [nxSize]="'small'"
                                        [disabled]="disabled$() || action.disabled"
                                        [nxIcon]="action.icon || ''"
                                        (click)="onActionClick(action, $event)">
                                    {{ action.text }}
                                </button>
                            }
                        </div>
                    }
                </div>
            }
        </div>
    `,
    styleUrls: ['./style/card.component.scss']
})
export class NxCardComponent {
    /** Card configuration */
    @Input({ required: false })
    set config(value: NxCardConfig) {
        this.configSignal.set(value);
    }

    /** Card title */
    @Input()
    set title(value: string) {
        this.titleSignal.set(value);
    }

    /** Card subtitle */
    @Input()
    set subtitle(value: string) {
        this.subtitleSignal.set(value);
    }

    /** Card content */
    @Input()
    set content(value: string) {
        this.contentSignal.set(value);
    }

    /** Cover image URL */
    @Input()
    set cover(value: string) {
        this.coverSignal.set(value);
    }

    /** Avatar image URL */
    @Input()
    set avatar(value: string) {
        this.avatarSignal.set(value);
    }

    /** Whether the card is hoverable */
    @Input()
    set hoverable(value: boolean) {
        this.hoverableSignal.set(value);
    }

    /** Whether the card is loading */
    @Input()
    set loading(value: boolean) {
        this.loadingSignal.set(value);
    }

    /** Whether the card is selectable */
    @Input()
    set selectable(value: boolean) {
        this.selectableSignal.set(value);
    }

    /** Whether the card is selected */
    @Input()
    set selected(value: boolean) {
        this.selectedSignal.set(value);
    }

    /** Whether the card is disabled */
    @Input()
    set disabled(value: boolean) {
        this.disabledSignal.set(value);
    }

    /** Card size */
    @Input()
    set size(value: NxCardSize) {
        this.sizeSignal.set(value);
    }

    /** Card variant */
    @Input()
    set variant(value: NxCardVariant) {
        this.variantSignal.set(value);
    }

    /** Card border style */
    @Input()
    set border(value: NxCardBorder) {
        this.borderSignal.set(value);
    }

    /** Card shadow level */
    @Input()
    set shadow(value: NxCardShadow) {
        this.shadowSignal.set(value);
    }

    /** Card actions */
    @Input()
    set actions(value: any[]) {
        this.actionsSignal.set(value);
    }

    /** Card meta information */
    @Input()
    set meta(value: any[]) {
        this.metaSignal.set(value);
    }

    /** Events */
    @Output() cardClick = new EventEmitter<NxCardClickEvent>();
    @Output() cardHover = new EventEmitter<NxCardHoverEvent>();
    @Output() cardSelect = new EventEmitter<NxCardSelectEvent>();

    /** Internal signals */
    private configSignal = signal<NxCardConfig | null>(null);
    private titleSignal = signal<string>('');
    private subtitleSignal = signal<string>('');
    private contentSignal = signal<string>('');
    private coverSignal = signal<string>('');
    private avatarSignal = signal<string>('');
    private hoverableSignal = signal<boolean>(false);
    private loadingSignal = signal<boolean>(false);
    private selectableSignal = signal<boolean>(false);
    private selectedSignal = signal<boolean>(false);
    private disabledSignal = signal<boolean>(false);
    private sizeSignal = signal<NxCardSize>('default');
    private variantSignal = signal<NxCardVariant>('default');
    private borderSignal = signal<NxCardBorder>('light');
    private shadowSignal = signal<NxCardShadow>('small');
    private actionsSignal = signal<any[]>([]);
    private metaSignal = signal<any[]>([]);

    /** Internal state signals */
    private hoveredSignal = signal<boolean>(false);
    private focusedSignal = signal<boolean>(false);
    private pressedSignal = signal<boolean>(false);

    /** Computed signals for reactive properties */
    currentConfig = computed(() => {
        const config = this.configSignal();
        return {
            ...DEFAULT_CARD_CONFIG,
            ...config,
            title: this.titleSignal(),
            subtitle: this.subtitleSignal(),
            content: this.contentSignal(),
            cover: this.coverSignal(),
            avatar: this.avatarSignal(),
            hoverable: this.hoverableSignal(),
            loading: this.loadingSignal(),
            selectable: this.selectableSignal(),
            selected: this.selectedSignal(),
            disabled: this.disabledSignal(),
            size: this.sizeSignal(),
            variant: this.variantSignal(),
            border: this.borderSignal(),
            shadow: this.shadowSignal(),
            actions: this.actionsSignal(),
            meta: this.metaSignal()
        };
    });

    title$ = computed(() => this.currentConfig().title);
    subtitle$ = computed(() => this.currentConfig().subtitle);
    content$ = computed(() => this.currentConfig().content);
    cover$ = computed(() => this.currentConfig().cover);
    avatar$ = computed(() => this.currentConfig().avatar);
    hoverable$ = computed(() => this.currentConfig().hoverable);
    loading$ = computed(() => this.currentConfig().loading);
    selectable$ = computed(() => this.currentConfig().selectable);
    selected$ = computed(() => this.currentConfig().selected);
    disabled$ = computed(() => this.currentConfig().disabled);
    size$ = computed(() => this.currentConfig().size);
    variant$ = computed(() => this.currentConfig().variant);
    border$ = computed(() => this.currentConfig().border);
    shadow$ = computed(() => this.currentConfig().shadow);
    actions$ = computed(() => this.currentConfig().actions);
    meta$ = computed(() => this.currentConfig().meta);

    /** Generate CSS classes for the card */
    cardClasses = computed(() => {
        const config = this.currentConfig();
        const classes = ['nx-card'];

        // Size classes
        if (config.size !== 'default') {
            classes.push(`nx-card-${config.size}`);
        }

        // Variant classes
        classes.push(`nx-card-${config.variant}`);

        // Border classes
        if (config.border !== 'light') {
            classes.push(`nx-card-border-${config.border}`);
        }

        // Shadow classes
        if (config.shadow !== 'small') {
            classes.push(`nx-card-shadow-${config.shadow}`);
        }

        // State classes
        if (config.hoverable) {
            classes.push('nx-card-hoverable');
        }

        if (config.loading) {
            classes.push('nx-card-loading');
        }

        if (config.disabled) {
            classes.push('nx-card-disabled');
        }

        if (config.selectable && config.selected) {
            classes.push('nx-card-selected');
        }

        // Interactive state classes
        if (this.hoveredSignal() && config.hoverable) {
            classes.push('nx-card-hovered');
        }

        if (this.focusedSignal() && config.selectable) {
            classes.push('nx-card-focused');
        }

        if (this.pressedSignal()) {
            classes.push('nx-card-pressed');
        }

        return classes.join(' ');
    });

    /** Card context for child components */
    cardContext: Signal<NxCardContext> = computed(() => ({
        card: this.currentConfig(),
        hovered: this.hoveredSignal(),
        focused: this.focusedSignal(),
        pressed: this.pressedSignal(),
        onClick: (event: MouseEvent) => this.onCardClick(event),
        onHover: (hovered: boolean) => this.setHovered(hovered),
        onFocus: (focused: boolean) => this.setFocused(focused)
    }));

    /** Host binding for accessibility */
    @HostBinding('attr.role') role = 'article';
    @HostBinding('attr.tabindex') get tabindex() {
        return this.selectable$() ? 0 : -1;
    }

    /** Event handlers */
    onCardClick(event: MouseEvent): void {
        const config = this.currentConfig();

        // Handle selection for selectable cards
        if (config.selectable && !config.disabled) {
            this.selectedSignal.set(!config.selected);
            this.cardSelect.emit({
                card: config,
                selected: !config.selected,
                event
            });
        }

        // Emit click event
        this.cardClick.emit({
            card: config,
            event,
            state: {
                hovered: this.hoveredSignal(),
                focused: this.focusedSignal(),
                pressed: this.pressedSignal()
            }
        });
    }

    onMouseEnter(event: MouseEvent): void {
        if (this.currentConfig().hoverable && !this.currentConfig().disabled) {
            this.setHovered(true);
            this.cardHover.emit({
                card: this.currentConfig(),
                hovered: true,
                event
            });
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.currentConfig().hoverable && !this.currentConfig().disabled) {
            this.setHovered(false);
            this.cardHover.emit({
                card: this.currentConfig(),
                hovered: false,
                event
            });
        }
    }

    onFocus(event: FocusEvent): void {
        if (this.currentConfig().selectable && !this.currentConfig().disabled) {
            this.setFocused(true);
        }
    }

    onBlur(event: FocusEvent): void {
        if (this.currentConfig().selectable) {
            this.setFocused(false);
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.currentConfig().selectable && !this.currentConfig().disabled) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.onCardClick(event as any);
            }
        }
    }

    onActionClick(action: any, event: MouseEvent): void {
        event.stopPropagation();
        if (action.handler && !action.disabled && !this.currentConfig().disabled) {
            action.handler();
        }
    }

    /** Private helper methods */
    private setHovered(hovered: boolean): void {
        this.hoveredSignal.set(hovered);
    }

    private setFocused(focused: boolean): void {
        this.focusedSignal.set(focused);
    }

    private setPressed(pressed: boolean): void {
        this.pressedSignal.set(pressed);
    }

    /** Generate action button variant */
    getActionVariant(action: any): 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'dashed' | 'link' {
        // Map action types to button variants
        switch (action.type) {
            case 'primary':
                return 'primary';
            case 'danger':
                return 'danger';
            case 'ghost':
                return 'ghost';
            case 'link':
                return 'link';
            case 'dashed':
                return 'dashed';
            default:
                return 'outline'; // Default to outline for card actions
        }
    }
}