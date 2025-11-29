import {
    Component,
    computed,
    contentChild,
    ContentChild,
    effect,
    ElementRef,
    HostListener,
    inject,
    input,
    OnDestroy,
    OnInit,
    output,
    signal,
    TemplateRef,
    DestroyRef,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { NxIconComponent } from '../icon/icon.component';
import {
    NxDropdownItemClick,
    NxDropdownItem,
    NxDropdownItemContext,
} from './dropdown.types';

@Component({
    selector: 'nx-dropdown-menu',
    standalone: true,
    imports: [NxIconComponent],
    template: `
        <div class="nx-dropdown-menu" role="menu">
            @for (item of items(); track item.key) {
                @switch (item.type) {
                    @case ('divider') {
                        <div class="nx-dropdown-divider" role="separator"></div>
                    }
                    @case ('header') {
                        <div class="nx-dropdown-header">{{ item.label }}</div>
                    }
                    @default {
                        <div
                            class="nx-dropdown-item"
                            [class.nx-dropdown-item-disabled]="item.disabled"
                            [class.nx-dropdown-item-selected]="item.selected"
                            [class.nx-dropdown-item-danger]="item.danger"
                            role="menuitem"
                            [attr.aria-disabled]="item.disabled"
                            [attr.aria-selected]="item.selected"
                            (click)="onItemClick(item, $index, $event)">

                            @if (item.icon) {
                                <nx-icon [type]="item.icon" class="nx-dropdown-item-icon"></nx-icon>
                            }

                            @if (customItemTemplate) {
                                <ng-template
                                    [ngTemplateOutlet]="customItemTemplate"
                                    [ngTemplateOutletContext]="getItemContext(item, $index())"></ng-template>
                            } @else {
                                <span class="nx-dropdown-item-label">{{ item.label }}</span>
                            }

                            @if (item.selected) {
                                <nx-icon type="check-fat" class="nx-dropdown-item-check"></nx-icon>
                            }
                        </div>
                    }
                }
            }
        </div>
    `,
    styleUrl: './style/dropdown.menu.component.scss',
    host: {
        class: 'nx-dropdown-menu-container',
    }
})
export class DropdownMenuComponent implements OnInit, OnDestroy {
    private elementRef = inject(ElementRef<HTMLElement>);
    private destroyRef = inject(DestroyRef);

    // Inputs
    items = input<NxDropdownItem[]>([]);

    // Outputs
    itemClick = output<NxDropdownItemClick>();

    // Content children for templates
    @ContentChild('itemTemplate') customItemTemplate?: TemplateRef<NxDropdownItemContext>;

    // Internal state
    private activeItemIndex = signal<number>(-1);
    private keyboardSubscription?: any;

    // Computed properties
    activeItems = computed(() =>
        this.items().filter((item: NxDropdownItem) =>
            item.type !== 'divider' && item.type !== 'header' && !item.disabled
        )
    );

    private activeItemElements = computed(() => {
        const menuElement = this.elementRef.nativeElement;
        return Array.from(menuElement.querySelectorAll('.nx-dropdown-item:not(.nx-dropdown-item-disabled)')) as HTMLElement[];
    });

    constructor() {
        // Set up keyboard navigation
        effect(() => {
            const activeElements = this.activeItemElements();
            const activeIndex = this.activeItemIndex();

            if (activeElements[activeIndex]) {
                // Remove active class from all items
                activeElements.forEach(el => el.classList.remove('nx-dropdown-item-active'));

                // Add active class to current item
                activeElements[activeIndex].classList.add('nx-dropdown-item-active');
                activeElements[activeIndex].focus();
            }
        });
    }

    ngOnInit(): void {
        this.setupKeyboardNavigation();
    }

    ngOnDestroy(): void {
        if (this.keyboardSubscription) {
            this.keyboardSubscription.unsubscribe();
        }
    }

    private setupKeyboardNavigation(): void {
        this.keyboardSubscription = fromEvent<KeyboardEvent>(this.elementRef.nativeElement, 'keydown').pipe(
            filter(event => this.isNavigationKey(event.key))
        ).subscribe(event => {
            event.preventDefault();
            this.handleKeyboardNavigation(event.key);
        });
    }

    private isNavigationKey(key: string): boolean {
        return ['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' '].includes(key);
    }

    private handleKeyboardNavigation(key: string): void {
        const activeElements = this.activeItemElements();
        const currentIndex = this.activeItemIndex();

        switch (key) {
            case 'ArrowDown':
                this.activeItemIndex.set((currentIndex + 1) % activeElements.length);
                break;
            case 'ArrowUp':
                this.activeItemIndex.set(currentIndex <= 0 ? activeElements.length - 1 : currentIndex - 1);
                break;
            case 'Home':
                this.activeItemIndex.set(0);
                break;
            case 'End':
                this.activeItemIndex.set(activeElements.length - 1);
                break;
            case 'Enter':
            case ' ':
                if (currentIndex >= 0 && activeElements[currentIndex]) {
                    activeElements[currentIndex].click();
                }
                break;
        }
    }

    onItemClick(item: NxDropdownItem, index: number, event: MouseEvent): void {
        if (item.disabled) {
            event.preventDefault();
            return;
        }

        // Emit the item click event
        this.itemClick.emit({ item, index, event });
    }

    getItemContext(item: NxDropdownItem, index: number): NxDropdownItemContext {
        return {
            item,
            index,
            selected: !!item.selected,
        };
    }

    @HostListener('mouseenter')
    onMouseEnter(): void {
        // Reset active item when mouse enters the menu
        this.activeItemIndex.set(-1);
    }

    // Reset active state when focus leaves the menu
    @HostListener('focusout', ['$event'])
    onFocusOut(event: FocusEvent): void {
        if (!this.elementRef.nativeElement.contains(event.relatedTarget as Node)) {
            this.activeItemIndex.set(-1);
        }
    }
}