import { CommonModule } from '@angular/common';
import {
    booleanAttribute,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    DestroyRef,
    ElementRef,
    EventEmitter,
    forwardRef,
    inject,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent, merge } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ControlValueAccessorBase } from '../../utils/control-value-accessor-base';
import { OverlayPlacement, OverlayService } from '../../utils/overlay.service';
import { VirtualScrollConfig, VirtualScroller } from '../../utils/virtual-scroll.utility';
import { NxIconDirective } from '../icon/icon.directive';
import {
    SelectBlurEvent,
    SelectChangeEvent,
    SelectFocusEvent,
    SelectMode,
    SelectOption,
    SelectOptionTemplateContext,
    SelectPlacement,
    SelectSearchEvent,
    SelectSelectionTemplateContext,
    SelectSize,
} from './select.types';

@Component({
    selector: 'nx-select',
    standalone: true,
    imports: [CommonModule, FormsModule, NxIconDirective],
    template: `
        <div
            class="nx-select"
            [class.nx-select-open]="isOpen"
            [class.nx-select-disabled]="isDisabled"
            [class.nx-select-focused]="isFocused"
            [class.nx-select-loading]="nxLoading"
            [class.nx-select-{{nxSize}}]="true"
            [class.nx-select-{{nxMode}}]="true"
            [class.nx-select-has-value]="hasValue"
        >
            <!-- Select trigger -->
            <div
                class="nx-select-selector"
                #trigger
                (click)="toggleDropdown()"
                (keydown)="handleKeyDown($event)"
                tabindex="0"
                role="combobox"
                [attr.aria-expanded]="isOpen"
                [attr.aria-controls]="dropdownId"
                [attr.aria-activedescendant]="activeOptionId"
                [attr.aria-disabled]="isDisabled"
                [attr.aria-label]="nxAriaLabel || nxPlaceholder"
            >
                <!-- Custom selected value template -->
                @if (selectedValueTemplate && !isEmptyValue()) {
                    <div class="nx-select-selection">
                        <ng-container *ngTemplateOutlet="selectedValueTemplate; context: getSelectionTemplateContext()"></ng-container>
                    </div>
                }

                <!-- Default selected value display -->
                @if (!selectedValueTemplate) {
                    <!-- Text content area -->
                    <div class="nx-select-selection">
                        <!-- Single select display -->
                        @if (nxMode === 'default' && selectedOption) {
                            <span class="nx-select-selection-item">{{ selectedOption.label }}</span>
                        }

                        <!-- Multi-select display -->
                        @if (nxMode !== 'default' && selectedOptions.length > 0) {
                            <div class="nx-select-selection-overflow nx-select-tags">
                                @for (option of selectedOptions.slice(0, nxMaxTagCount); track option.value) {
                                    <span class="nx-select-selection-item">
                                        {{ option.label }}
                                        @if (nxMode === 'multiple' || nxMode === 'tags') {
                                            <span class="nx-select-selection-item-remove" (click)="removeOption($event, option)">
                                                <span nxIcon type="x-circle" theme="fill"></span>
                                            </span>
                                        }
                                    </span>
                                }
                                @if (selectedOptions.length > nxMaxTagCount) {
                                    <span class="nx-select-selection-item nx-select-selection-item-more">
                                        +{{ selectedOptions.length - nxMaxTagCount }}...
                                    </span>
                                }
                            </div>
                        }

                        <!-- Placeholder -->
                        @if (isEmptyValue()) {
                            <span class="nx-select-selection-placeholder">{{ nxPlaceholder }}</span>
                        }
                    </div>
                }

                <!-- Arrow area -->
                <div class="nx-select-arrow" [class.nx-select-arrow-loading]="nxLoading">
                    <!-- Loading indicator -->
                    @if (nxLoading) {
                        <span class="nx-select-spinner"></span>
                    }

                    <!-- Dropdown arrow -->
                    @if (!nxLoading) {
                        <span [class.nx-select-arrow-up]="isOpen">
                            <span nxIcon type="caret-down" theme="outline"></span>
                        </span>
                    }
                </div>
            </div>

            <!-- Dropdown overlay -->
            @if (isOpen) {
                <div
                    class="nx-select-dropdown"
                    #dropdown
                    [id]="dropdownId"
                    role="listbox"
                    [attr.aria-multiselectable]="isMultiple"
                    [attr.aria-label]="'Available options'"
                >
                    <!-- Search input -->
                    @if (nxShowSearch) {
                        <div class="nx-select-dropdown-search">
                            <input
                                type="text"
                                class="nx-select-dropdown-search-input"
                                [(ngModel)]="searchValue"
                                (ngModelChange)="onSearch()"
                                placeholder="Search..."
                                [attr.aria-label]="'Search options'"
                                autocomplete="off"
                            />
                        </div>
                    }

                    <!-- Options list -->
                    <div
                        class="nx-select-dropdown-list"
                        #dropdownList
                        [style.height.px]="shouldUseVirtualScroll ? nxVirtualScrollHeight : 'auto'"
                        [style.overflow-y]="shouldUseVirtualScroll ? 'auto' : 'auto'"
                    >
                        @if (filteredOptions.length === 0) {
                            <div class="nx-select-dropdown-empty">
                                @if (searchValue) {
                                    No results found
                                } @else {
                                    No data
                                }
                            </div>
                        } @else {
                            @if (shouldUseVirtualScroll) {
                                <!-- Virtual scrolling container -->
                                <div class="nx-select-virtual-scroll-container" [style.height.px]="virtualScrollData.totalHeight">
                                    @for (item of virtualScrollData.visibleItems; track item.item.value) {
                                        <div
                                            class="nx-select-dropdown-item"
                                            [class.nx-select-dropdown-item-selected]="isSelected(item.item)"
                                            [class.nx-select-dropdown-item-disabled]="item.item.disabled"
                                            [class.nx-select-dropdown-item-active]="item.item === activeOption"
                                            [style.position]="'absolute'"
                                            [style.top.px]="item.offset"
                                            [style.width]="'100%'"
                                            [attr.role]="'option'"
                                            [attr.id]="getOptionId(item.item, item.index)"
                                            [attr.aria-selected]="isSelected(item.item)"
                                            [attr.aria-disabled]="item.item.disabled"
                                            (click)="selectOption(item.item)"
                                            (mouseenter)="setActiveOption(item.item)"
                                        >
                                            <!-- Custom option template -->
                                            @if (optionTemplate) {
                                                <ng-container
                                                    *ngTemplateOutlet="optionTemplate; context: getOptionTemplateContext(item.item, item.index)"
                                                ></ng-container>
                                            }

                                            <!-- Default option display -->
                                            @if (!optionTemplate) {
                                                <div class="nx-select-dropdown-item-content">
                                                    @if (isMultiple) {
                                                        <span class="nx-select-dropdown-item-checkbox">
                                                            @if (isSelected(item.item)) {
                                                                <span nxIcon type="check-fat" theme="outline"></span>
                                                            }
                                                        </span>
                                                    }
                                                    <span
                                                        class="nx-select-dropdown-item-label"
                                                        [innerHTML]="highlightMatch(item.item.label, searchValue)"
                                                    ></span>
                                                </div>
                                            }
                                        </div>
                                    }
                                </div>
                            } @else {
                                <!-- Regular scrolling (default) -->
                                @for (option of filteredOptions; track option.value; let i = $index) {
                                    <div
                                        class="nx-select-dropdown-item"
                                        [class.nx-select-dropdown-item-selected]="isSelected(option)"
                                        [class.nx-select-dropdown-item-disabled]="option.disabled"
                                        [class.nx-select-dropdown-item-active]="option === activeOption"
                                        [attr.role]="'option'"
                                        [attr.id]="getOptionId(option, i)"
                                        [attr.aria-selected]="isSelected(option)"
                                        [attr.aria-disabled]="option.disabled"
                                        (click)="selectOption(option)"
                                        (mouseenter)="setActiveOption(option)"
                                    >
                                        <!-- Custom option template -->
                                        @if (optionTemplate) {
                                            <ng-container
                                                *ngTemplateOutlet="optionTemplate; context: getOptionTemplateContext(option, i)"
                                            ></ng-container>
                                        }

                                        <!-- Default option display -->
                                        @if (!optionTemplate) {
                                            <div class="nx-select-dropdown-item-content">
                                                @if (isMultiple) {
                                                    <span class="nx-select-dropdown-item-checkbox">
                                                        @if (isSelected(option)) {
                                                            <span nxIcon type="check-fat" theme="outline"></span>
                                                        }
                                                    </span>
                                                }
                                                <span
                                                    class="nx-select-dropdown-item-label"
                                                    [innerHTML]="highlightMatch(option.label, searchValue)"
                                                ></span>
                                            </div>
                                        }
                                    </div>
                                }
                            }
                        }
                    </div>
                </div>
            }
        </div>
    `,
    styleUrls: ['./style/select.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectComponent),
            multi: true,
        },
    ],
    host: {
        '[class.nx-select-focused]': 'isFocused',
        '[class.nx-select-disabled]': 'isDisabled',
    },
})
export class SelectComponent<T = any> extends ControlValueAccessorBase<T | T[]> implements OnInit, OnChanges, OnDestroy {
    // Template references
    @ViewChild('trigger', { static: true }) triggerElement!: ElementRef<HTMLElement>;
    @ViewChild('dropdown', { static: false }) dropdownElement!: ElementRef<HTMLElement>;
    @ViewChild('dropdownList', { static: false }) dropdownListElement!: ElementRef<HTMLElement>;

    // Content children for custom templates
    @ContentChild('option', { read: TemplateRef }) optionTemplate?: TemplateRef<SelectOptionTemplateContext<T>>;
    @ContentChild('selectedValue', { read: TemplateRef }) selectedValueTemplate?: TemplateRef<SelectSelectionTemplateContext<T>>;

    // Component inputs
    @Input() nxOptions: SelectOption<T>[] = [];
    @Input() nxMode: SelectMode = 'default';
    @Input() nxSize: SelectSize = 'default';
    @Input() nxPlaceholder = 'Please select';
    @Input({ transform: booleanAttribute }) nxShowSearch = false;
    @Input({ transform: booleanAttribute }) nxLoading = false;
    @Input({ transform: booleanAttribute }) nxDisabled = false;
    @Input({ transform: booleanAttribute }) nxAllowClear = false;
    @Input() nxMaxTagCount = 3;
    @Input() nxPlacement: SelectPlacement = 'bottomLeft';
    @Input() nxDropdownMatchSelectWidth = true;
    @Input() nxFilterOption?: (input: string, option: SelectOption<T>) => boolean;
    @Input() nxCompareWith?: (o1: T, o2: T) => boolean;
    @Input() nxAriaLabel?: string;
    @Input({ transform: booleanAttribute }) nxVirtualScroll = false;
    @Input() nxVirtualScrollHeight = 256;

    // Component outputs
    @Output() readonly nxOpenChange = new EventEmitter<boolean>();
    @Output() readonly nxSearch = new EventEmitter<SelectSearchEvent>();
    @Output() readonly nxChange = new EventEmitter<SelectChangeEvent<T>>();
    @Output() readonly nxFocus = new EventEmitter<SelectFocusEvent<T>>();
    @Output() readonly nxBlur = new EventEmitter<SelectBlurEvent<T>>();
    @Output() readonly nzClear = new EventEmitter<void>();

    // Private properties
    private overlayService = inject(OverlayService);
    private cdr = inject(ChangeDetectorRef);
    private ngZone = inject(NgZone);
    private destroyRef = inject(DestroyRef);
    private virtualScroller = new VirtualScroller<SelectOption<T>>();

    // Component state
    isOpen = false;
    searchValue = '';
    filteredOptions: SelectOption<T>[] = [];
    selectedOption: SelectOption<T> | null = null;
    selectedOptions: SelectOption<T>[] = [];
    activeOption: SelectOption<T> | null = null;
    isFocused = false;
    isDisabled = false;

    // Generated IDs for accessibility
    dropdownId = `nx-select-dropdown-${Math.random().toString(36).substr(2, 9)}`;

    // Computed properties
    get isMultiple(): boolean {
        return this.nxMode === 'multiple' || this.nxMode === 'tags';
    }

    get hasValue(): boolean {
        return this.isMultiple ? this.selectedOptions.length > 0 : this.selectedOption !== null;
    }

    get activeOptionId(): string {
        return this.activeOption ? this.getOptionId(this.activeOption, this.filteredOptions.indexOf(this.activeOption)) : '';
    }

    get shouldUseVirtualScroll(): boolean {
        return this.nxVirtualScroll && this.filteredOptions.length > 100;
    }

    get virtualScrollData() {
        return this.virtualScroller.scrollData();
    }

    ngOnInit(): void {
        this.filteredOptions = [...this.nxOptions];
        this.setupEventListeners();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.nxOptions) {
            this.filteredOptions = this.filterOptions(this.searchValue);
            this.validateSelectedValues();
            this.updateVirtualScroll();
        }

        if (changes.nxDisabled) {
            this.isDisabled = this.nxDisabled || this.disabled;
            if (this.isDisabled && this.isOpen) {
                this.closeDropdown();
            }
        }

        if (changes.nxLoading) {
            this.cdr.markForCheck();
        }
    }

    // ControlValueAccessor implementation
    override writeValue(value: T | T[] | null): void {
        super.writeValue(value);
        this.setSelectedValues();
        this.cdr.markForCheck();
    }

    // Public methods
    toggleDropdown(): void {
        if (this.isDisabled || this.nxLoading) return;
        this.isOpen ? this.closeDropdown() : this.openDropdown();
    }

    openDropdown(): void {
        if (this.isDisabled || this.nxLoading || this.isOpen) return;

        this.isOpen = true;
        this.filteredOptions = this.filterOptions(this.searchValue);
        this.setActiveOptionToFirst();
        this.setupOverlay();
        this.updateVirtualScroll();
        this.nxOpenChange.emit(true);
        this.cdr.markForCheck();
    }

    closeDropdown(): void {
        if (!this.isOpen) return;

        this.isOpen = false;
        this.searchValue = '';
        this.filteredOptions = [...this.nxOptions];
        this.cleanupOverlay();
        this.nxOpenChange.emit(false);
        this.cdr.markForCheck();
    }

    selectOption(option: SelectOption<T>): void {
        if (option.disabled || this.isDisabled) return;

        const previousSelected = this.isMultiple ? [...this.selectedOptions] : this.selectedOption;

        if (this.isMultiple) {
            const index = this.selectedOptions.findIndex((o) => this.compareValues(o.value, option.value));
            if (index > -1) {
                this.selectedOptions.splice(index, 1);
            } else {
                this.selectedOptions.push(option);
            }
            const values = this.selectedOptions.map((o) => o.value);
            this.emitChange(values as any);
            this.nxChange.emit({
                value: values as any,
                option: this.selectedOptions,
                isUserInput: true,
            });
        } else {
            this.selectedOption = option;
            this.emitChange(option.value as any);
            this.nxChange.emit({
                value: option.value as any,
                option,
                isUserInput: true,
            });
            this.closeDropdown();
        }

        this.markAsTouched();
        this.cdr.markForCheck();
    }

    removeOption(event: Event, option: SelectOption<T>): void {
        event.stopPropagation();
        if (this.isMultiple) {
            const index = this.selectedOptions.findIndex((o) => this.compareValues(o.value, option.value));
            if (index > -1) {
                this.selectedOptions.splice(index, 1);
                const values = this.selectedOptions.map((o) => o.value);
                this.emitChange(values as any);
                this.nxChange.emit({
                    value: values as any,
                    option: this.selectedOptions,
                    isUserInput: true,
                });
            }
        }
        this.cdr.markForCheck();
    }

    onSearch(): void {
        this.filteredOptions = this.filterOptions(this.searchValue);
        this.setActiveOptionToFirst();
        this.updateVirtualScroll();

        const searchEvent: SelectSearchEvent = {
            query: this.searchValue,
            resultCount: this.filteredOptions.length,
            serverSide: false,
        };
        this.nxSearch.emit(searchEvent);
        this.cdr.markForCheck();
    }

    handleKeyDown(event: KeyboardEvent): void {
        if (this.isDisabled) return;

        switch (event.key) {
            case 'Enter':
            case ' ':
                event.preventDefault();
                if (!this.isOpen) {
                    this.openDropdown();
                } else if (this.activeOption) {
                    this.selectOption(this.activeOption);
                }
                break;

            case 'Escape':
                event.preventDefault();
                this.closeDropdown();
                break;

            case 'ArrowDown':
                event.preventDefault();
                if (!this.isOpen) {
                    this.openDropdown();
                } else {
                    this.navigateOptions(1);
                }
                break;

            case 'ArrowUp':
                event.preventDefault();
                if (this.isOpen) {
                    this.navigateOptions(-1);
                }
                break;

            case 'Home':
                event.preventDefault();
                if (this.isOpen) {
                    this.setActiveOptionToFirst();
                }
                break;

            case 'End':
                event.preventDefault();
                if (this.isOpen) {
                    this.setActiveOptionToLast();
                }
                break;

            case 'Backspace':
                if (this.isMultiple && this.selectedOptions.length > 0 && !this.searchValue) {
                    this.removeOption(event, this.selectedOptions[this.selectedOptions.length - 1]);
                }
                break;

            case 'Tab':
                if (this.isOpen) {
                    this.closeDropdown();
                }
                break;
        }
    }

    // Private methods
    private setupEventListeners(): void {
        this.ngZone.runOutsideAngular(() => {
            const focusin$ = fromEvent<FocusEvent>(this.triggerElement.nativeElement, 'focusin');
            const focusout$ = fromEvent<FocusEvent>(this.triggerElement.nativeElement, 'focusout');

            merge(focusin$, focusout$)
                .pipe(
                    filter(() => !this.isDisabled),
                    takeUntilDestroyed(this.destroyRef)
                )
                .subscribe((event) => {
                    this.ngZone.run(() => {
                        if (event.type === 'focusin') {
                            this.isFocused = true;
                            this.nxFocus.emit({
                                option: this.selectedOption || this.selectedOptions[0] || null,
                                source: 'keyboard',
                            });
                        } else {
                            this.isFocused = false;
                            this.nxBlur.emit({
                                option: this.activeOption,
                                selected: false,
                            });
                        }
                        this.cdr.markForCheck();
                    });
                });

            // Click outside listener to close dropdown and remove focus
            const clickOutside$ = fromEvent<MouseEvent>(document, 'click');
            clickOutside$
                .pipe(
                    filter(() => this.isOpen || this.isFocused),
                    filter((event) => {
                        const target = event.target as HTMLElement;
                        const clickedInside =
                            this.triggerElement.nativeElement.contains(target) || (this.dropdownElement?.nativeElement?.contains(target) ?? false);
                        return !clickedInside;
                    }),
                    takeUntilDestroyed(this.destroyRef)
                )
                .subscribe(() => {
                    this.ngZone.run(() => {
                        this.closeDropdown();
                        this.isFocused = false;
                        this.triggerElement.nativeElement.blur();
                        this.cdr.markForCheck();
                    });
                });
        });
    }

    private setupOverlay(): void {
        if (!this.dropdownElement) return;

        this.overlayService.register(this.triggerElement.nativeElement, this.dropdownElement.nativeElement, {
            placement: this.getOverlayPlacement(),
            autoReposition: true,
            offset: 4,
        });
    }

    private cleanupOverlay(): void {
        if (this.dropdownElement) {
            this.overlayService.unregister(this.dropdownElement.nativeElement);
        }
    }

    private getOverlayPlacement(): OverlayPlacement {
        const placementMap: Record<SelectPlacement, OverlayPlacement> = {
            bottomLeft: 'bottomStart',
            bottomRight: 'bottomEnd',
            topLeft: 'topStart',
            topRight: 'topEnd',
        };
        return placementMap[this.nxPlacement];
    }

    private filterOptions(searchValue: string): SelectOption<T>[] {
        if (!searchValue || !this.nxShowSearch) {
            return [...this.nxOptions];
        }

        const filterFn = this.nxFilterOption || this.defaultFilterOption;
        return this.nxOptions.filter((option) => filterFn(searchValue.toLowerCase(), option));
    }

    private defaultFilterOption(searchValue: string, option: SelectOption<T>): boolean {
        return option.label.toLowerCase().includes(searchValue);
    }

    private navigateOptions(direction: 1 | -1): void {
        if (!this.filteredOptions.length) return;

        const currentIndex = this.activeOption ? this.filteredOptions.indexOf(this.activeOption) : -1;

        let nextIndex = currentIndex + direction;

        // Skip disabled options
        while (nextIndex >= 0 && nextIndex < this.filteredOptions.length) {
            if (!this.filteredOptions[nextIndex].disabled) {
                this.activeOption = this.filteredOptions[nextIndex];
                this.cdr.markForCheck();
                return;
            }
            nextIndex += direction;
        }
    }

    setActiveOption(option: SelectOption<T>): void {
        if (!option.disabled) {
            this.activeOption = option;
            this.cdr.markForCheck();
        }
    }

    private setActiveOptionToFirst(): void {
        const firstEnabled = this.filteredOptions.find((option) => !option.disabled);
        if (firstEnabled) {
            this.activeOption = firstEnabled;
        }
    }

    private setActiveOptionToLast(): void {
        const lastEnabled = [...this.filteredOptions].reverse().find((option) => !option.disabled);
        if (lastEnabled) {
            this.activeOption = lastEnabled;
        }
    }

    private setSelectedValues(): void {
        if (this.isMultiple && Array.isArray(this.value)) {
            this.selectedOptions = this.nxOptions.filter((option) => (this.value as T[]).some((v) => this.compareValues(v, option.value)));
        } else if (this.value !== null && !Array.isArray(this.value)) {
            this.selectedOption = this.nxOptions.find((option) => this.compareValues(this.value as T, option.value)) || null;
        } else {
            this.selectedOption = null;
            this.selectedOptions = [];
        }
    }

    private validateSelectedValues(): void {
        // Clean up selected values that no longer exist in options
        if (this.isMultiple) {
            this.selectedOptions = this.selectedOptions.filter((selected) =>
                this.nxOptions.some((option) => this.compareValues(option.value, selected.value))
            );
        } else if (this.selectedOption) {
            const exists = this.nxOptions.some((option) => this.compareValues(option.value, this.selectedOption!.value));
            if (!exists) {
                this.selectedOption = null;
            }
        }
    }

    private compareValues(value1: T, value2: T): boolean {
        if (this.nxCompareWith) {
            return this.nxCompareWith(value1, value2);
        }
        return value1 === value2;
    }

    protected isSelected(option: SelectOption<T>): boolean {
        return this.isMultiple
            ? this.selectedOptions.some((o) => this.compareValues(o.value, option.value))
            : this.selectedOption?.value === option.value;
    }

    protected isEmptyValue(): boolean {
        return this.isMultiple ? this.selectedOptions.length === 0 : this.selectedOption === null;
    }

    protected trackByValue(index: number, option: SelectOption<T>): any {
        // Use the option's value directly for tracking, or fallback to index if value is complex
        return option.value !== null && (typeof option.value === 'string' || typeof option.value === 'number')
            ? option.value
            : `${option.label}-${index}`;
    }

    protected getOptionId(option: SelectOption<T>, index: number): string {
        return `${this.dropdownId}-option-${index}`;
    }

    protected getOptionTemplateContext(option: SelectOption<T>, index: number): SelectOptionTemplateContext<T> {
        return {
            $implicit: option,
            selected: this.isSelected(option),
            disabled: option.disabled || false,
            index,
        };
    }

    protected getSelectionTemplateContext(): SelectSelectionTemplateContext<T> {
        return {
            $implicit: this.isMultiple ? this.selectedOptions : this.selectedOption || [],
            multiple: this.isMultiple,
            count: this.isMultiple ? this.selectedOptions.length : this.selectedOption ? 1 : 0,
        };
    }

    protected highlightMatch(text: string, searchValue: string): string {
        if (!searchValue) return text;

        const regex = new RegExp(`(${searchValue})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // Private methods for virtual scrolling
    private updateVirtualScroll(): void {
        if (!this.shouldUseVirtualScroll) {
            return;
        }

        const config: VirtualScrollConfig = {
            itemHeight: 32, // Standard option height
            viewportHeight: this.nxVirtualScrollHeight,
            buffer: 5,
        };

        this.virtualScroller.configure(this.filteredOptions, config);

        // Setup scroll listener after dropdown is rendered
        setTimeout(() => {
            if (this.dropdownListElement) {
                this.virtualScroller.setupScrollListener(this.dropdownListElement.nativeElement);
            }
        });
    }

    private scrollToActiveOption(): void {
        if (!this.shouldUseVirtualScroll || !this.activeOption) {
            return;
        }

        const index = this.filteredOptions.indexOf(this.activeOption);
        if (index >= 0) {
            this.virtualScroller.scrollToIndex(index, 'center');
        }
    }

    ngOnDestroy(): void {
        this.closeDropdown();
    }
}
