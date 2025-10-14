import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Component, DebugElement, Type, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SelectComponent } from './select.component';
import { SelectOption, SelectMode } from './select.types';
import { NxIconDirective } from '../icon/icon.directive';

// Mock NxIconDirective
class MockNxIconDirective {
    @Input() type?: string;
    @Input() theme?: string;
}

// Mock OverlayService
class MockOverlayService {
    register(): void {
        // Mock implementation
    }
}

// Test component to integrate SelectComponent
@Component({
    standalone: true,
    imports: [SelectComponent, FormsModule, ReactiveFormsModule],
    template: `
        <form [formGroup]="testForm">
            <nx-select
                formControlName="selectControl"
                [nxOptions]="options"
                [nxMode]="mode"
                [nxSize]="size"
                [nxDisabled]="disabled"
                [nxPlaceholder]="placeholder"
                [nxShowSearch]="showSearch"
                [nxLoading]="loading"
                [nxMaxTagCount]="maxTagCount">
            </nx-select>
        </form>
        <nx-select
            [(ngModel)]="modelValue"
            [nxOptions]="options"
            [nxMode]="mode">
        </nx-select>
    `,
})
class TestHostComponent {
    options: SelectOption[] = [
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' },
        { label: 'Option 3', value: '3', disabled: true },
        { label: 'Option 4', value: '4' },
    ];

    mode: SelectMode = 'default';
    size = 'default';
    disabled = false;
    placeholder = 'Select an option';
    showSearch = false;
    loading = false;
    maxTagCount = 3;

    testForm = new FormGroup({
        selectControl: new FormControl(),
    });

    modelValue: any = null;
}

describe('SelectComponent', () => {
    let component: SelectComponent;
    let fixture: ComponentFixture<SelectComponent>;
    let hostFixture: ComponentFixture<TestHostComponent>;
    let hostComponent: TestHostComponent;
    let hostDebugElement: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                SelectComponent,
                FormsModule,
                ReactiveFormsModule,
                NxIconDirective,
            ],
            providers: [
                { provide: NxIconDirective, useClass: MockNxIconDirective },
                { provide: 'OverlayService', useClass: MockOverlayService },
            ],
        }).compileComponents();

        // Standalone component tests
        fixture = TestBed.createComponent(SelectComponent);
        component = fixture.componentInstance;
        component.nxOptions = [
            { label: 'Option 1', value: '1' },
            { label: 'Option 2', value: '2' },
            { label: 'Option 3', value: '3' },
        ];
        fixture.detectChanges();

        // Integration tests
        hostFixture = TestBed.createComponent(TestHostComponent);
        hostComponent = hostFixture.componentInstance;
        hostDebugElement = hostFixture.debugElement;
        hostFixture.detectChanges();
    });

    describe('Component Creation', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should render with default classes', () => {
            const selectElement = fixture.nativeElement.querySelector('.nx-select');
            expect(selectElement).toBeTruthy();
            expect(selectElement.classList).toContain('nx-select');
            expect(selectElement.classList).toContain('nx-select-default');
        });
    });

    describe('Basic Functionality', () => {
        it('should display placeholder when no value is selected', () => {
            component.nxPlaceholder = 'Choose option';
            fixture.detectChanges();

            const placeholder = fixture.nativeElement.querySelector('.nx-select-selection-placeholder');
            expect(placeholder.textContent.trim()).toBe('Choose option');
        });

        it('should display selected value', fakeAsync(() => {
            component.writeValue('2');
            fixture.detectChanges();
            tick();

            const selectedItem = fixture.nativeElement.querySelector('.nx-select-selection-item');
            expect(selectedItem.textContent.trim()).toBe('Option 2');
        }));

        it('should open dropdown on click', fakeAsync(() => {
            spyOn(component, 'openDropdown');
            const trigger = fixture.nativeElement.querySelector('.nx-select-selector');

            trigger.click();
            tick();

            expect(component.openDropdown).toHaveBeenCalled();
        }));

        it('should not open dropdown when disabled', fakeAsync(() => {
            component.nxDisabled = true;
            component.isOpen = true;
            fixture.detectChanges();

            expect(component.isOpen).toBeFalse();
        }));
    });

    describe('Multiple Selection Mode', () => {
        beforeEach(() => {
            component.nxMode = 'multiple';
            fixture.detectChanges();
        });

        it('should allow multiple selections', fakeAsync(() => {
            component.openDropdown();
            fixture.detectChanges();

            const firstOption = fixture.nativeElement.querySelector('.nx-select-dropdown-item');
            firstOption.click();
            tick();

            expect(component.selectedOptions.length).toBe(1);

            const secondOption = fixture.nativeElement.querySelectorAll('.nx-select-dropdown-item')[1];
            secondOption.click();
            tick();

            expect(component.selectedOptions.length).toBe(2);
        }));

        it('should display selected items as tags', fakeAsync(() => {
            component.writeValue(['1', '2']);
            fixture.detectChanges();
            tick();

            const tags = fixture.nativeElement.querySelectorAll('.nx-select-selection-item');
            expect(tags.length).toBe(2);
        }));

        it('should limit tag display with maxTagCount', fakeAsync(() => {
            component.nxMaxTagCount = 2;
            component.writeValue(['1', '2', '3']);
            fixture.detectChanges();
            tick();

            const tags = fixture.nativeElement.querySelectorAll('.nx-select-selection-item');
            const moreTag = fixture.nativeElement.querySelector('.nx-select-selection-item-more');

            expect(tags.length).toBe(3); // 2 regular tags + 1 more tag
            expect(moreTag).toBeTruthy();
            expect(moreTag.textContent.trim()).toBe('+1...');
        }));
    });

    describe('Search Functionality', () => {
        beforeEach(() => {
            component.nxShowSearch = true;
            component.nxOptions = [
                { label: 'Apple', value: 'apple' },
                { label: 'Banana', value: 'banana' },
                { label: 'Cherry', value: 'cherry' },
            ];
            fixture.detectChanges();
        });

        it('should filter options based on search input', fakeAsync(() => {
            component.openDropdown();
            fixture.detectChanges();

            const searchInput = fixture.nativeElement.querySelector('.nx-select-dropdown-search-input');
            searchInput.value = 'ap';
            searchInput.dispatchEvent(new Event('input'));
            tick();

            expect(component.filteredOptions.length).toBe(1);
            expect(component.filteredOptions[0].label).toBe('Apple');
        }));

        it('should emit search event', fakeAsync(() => {
            spyOn(component.nxSearch, 'emit');
            component.openDropdown();
            fixture.detectChanges();

            const searchInput = fixture.nativeElement.querySelector('.nx-select-dropdown-search-input');
            searchInput.value = 'test';
            searchInput.dispatchEvent(new Event('input'));
            tick();

            expect(component.nxSearch.emit).toHaveBeenCalledWith({
                query: 'test',
                resultCount: 0,
                serverSide: false,
            });
        }));
    });

    describe('Keyboard Navigation', () => {
        beforeEach(() => {
            component.nxOptions = [
                { label: 'Option 1', value: '1' },
                { label: 'Option 2', value: '2' },
                { label: 'Option 3', value: '3' },
            ];
            fixture.detectChanges();
        });

        it('should open dropdown on Enter key', fakeAsync(() => {
            const trigger = fixture.nativeElement.querySelector('.nx-select-selector');
            const event = new KeyboardEvent('keydown', { key: 'Enter' });

            trigger.dispatchEvent(event);
            tick();

            expect(component.isOpen).toBeTrue();
        }));

        it('should navigate options with arrow keys', fakeAsync(() => {
            component.openDropdown();
            fixture.detectChanges();

            const trigger = fixture.nativeElement.querySelector('.nx-select-selector');
            const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });

            trigger.dispatchEvent(downEvent);
            tick();

            expect(component.activeOption).toBeTruthy();
            expect(component.activeOption?.value).toBe('1' as any);
        }));

        it('should select active option on Enter', fakeAsync(() => {
            component.openDropdown();
            fixture.detectChanges();

            // Navigate to first option
            const trigger = fixture.nativeElement.querySelector('.nx-select-selector');
            trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
            tick();

            // Select option
            trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
            tick();

            expect(component.selectedOption?.value).toBe('1');
        }));

        it('should close dropdown on Escape', fakeAsync(() => {
            component.openDropdown();
            fixture.detectChanges();

            const trigger = fixture.nativeElement.querySelector('.nx-select-selector');
            const event = new KeyboardEvent('keydown', { key: 'Escape' });

            trigger.dispatchEvent(event);
            tick();

            expect(component.isOpen).toBeFalse();
        }));
    });

    describe('Disabled State', () => {
        it('should apply disabled styles when disabled', () => {
            component.nxDisabled = true;
            fixture.detectChanges();

            const selectElement = fixture.nativeElement.querySelector('.nx-select');
            expect(selectElement.classList).toContain('nx-select-disabled');
        });

        it('should prevent interaction when disabled', fakeAsync(() => {
            component.nxDisabled = true;
            fixture.detectChanges();

            const trigger = fixture.nativeElement.querySelector('.nx-select-selector');
            trigger.click();
            tick();

            expect(component.isOpen).toBeFalse();
        }));
    });

    describe('Loading State', () => {
        it('should show loading indicator', () => {
            component.nxLoading = true;
            fixture.detectChanges();

            const loadingIcon = fixture.nativeElement.querySelector('.nx-select-arrow-loading');
            expect(loadingIcon).toBeTruthy();
        });

        it('should not open dropdown when loading', fakeAsync(() => {
            component.nxLoading = true;
            fixture.detectChanges();

            const trigger = fixture.nativeElement.querySelector('.nx-select-selector');
            trigger.click();
            tick();

            expect(component.isOpen).toBeFalse();
        }));
    });

    describe('Custom Filter', () => {
        it('should use custom filter function', fakeAsync(() => {
            component.nxShowSearch = true;
            component.nxFilterOption = (input: string, option: SelectOption) => {
                return option.label.startsWith(input);
            };
            component.nxOptions = [
                { label: 'Apple', value: 'apple' },
                { label: 'Pineapple', value: 'pineapple' },
            ];
            fixture.detectChanges();

            component.openDropdown();
            const searchInput = fixture.nativeElement.querySelector('.nx-select-dropdown-search-input');
            searchInput.value = 'ap';
            searchInput.dispatchEvent(new Event('input'));
            tick();

            expect(component.filteredOptions.length).toBe(1);
            expect(component.filteredOptions[0].label).toBe('Apple');
        }));
    });

    describe('Custom Compare Function', () => {
        it('should use custom compare function', () => {
            component.nxCompareWith = (a: any, b: any) => a.id === b.id;
            component.nxOptions = [
                { label: 'Option 1', value: { id: 1, name: 'First' } },
                { label: 'Option 2', value: { id: 2, name: 'Second' } },
            ];
            component.writeValue({ id: 1, name: 'First' });
            fixture.detectChanges();

            expect(component.selectedOption?.value.id).toBe(1);
        });
    });

    describe('Form Integration', () => {
        let selectElement: DebugElement;

        beforeEach(() => {
            selectElement = hostDebugElement.query(By.directive(SelectComponent));
        });

        it('should integrate with Reactive Forms', fakeAsync(() => {
            hostComponent.testForm.controls['selectControl'].setValue('2');
            tick();

            expect(hostComponent.testForm.controls['selectControl'].value).toBe('2');
        }));

        it('should integrate with ngModel', fakeAsync(() => {
            hostComponent.modelValue = '1';
            hostFixture.detectChanges();
            tick();

            const selectInstance = selectElement.componentInstance as SelectComponent;
            expect((selectInstance as any).value).toBe('1');
        }));

        it('should update form control on selection', fakeAsync(() => {
            const selectInstance = selectElement.componentInstance as SelectComponent;
            selectInstance.openDropdown();
            hostFixture.detectChanges();

            const firstOption = hostFixture.nativeElement.querySelector('.nx-select-dropdown-item');
            firstOption.click();
            tick();

            expect(hostComponent.testForm.controls['selectControl'].value).toBe('1');
        }));

        it('should respect form control disabled state', fakeAsync(() => {
            hostComponent.testForm.controls['selectControl'].disable();
            hostFixture.detectChanges();
            tick();

            const selectInstance = selectElement.componentInstance as SelectComponent;
            expect(selectInstance.isDisabled).toBeTrue();
        }));
    });

    describe('Accessibility', () => {
        it('should have proper ARIA attributes', () => {
            const trigger = fixture.nativeElement.querySelector('.nx-select-selector');

            expect(trigger.getAttribute('role')).toBe('combobox');
            expect(trigger.getAttribute('aria-expanded')).toBe('false');
            expect(trigger.getAttribute('aria-controls')).toBeTruthy();
        });

        it('should update ARIA attributes when dropdown opens', fakeAsync(() => {
            component.openDropdown();
            fixture.detectChanges();

            const trigger = fixture.nativeElement.querySelector('.nx-select-selector');
            expect(trigger.getAttribute('aria-expanded')).toBe('true');
        }));

        it('should have proper ARIA attributes for multi-select', () => {
            component.nxMode = 'multiple';
            fixture.detectChanges();

            const trigger = fixture.nativeElement.querySelector('.nx-select-selector');
            expect(trigger.getAttribute('aria-multiselectable')).toBe('true');
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty options array', () => {
            component.nxOptions = [];
            fixture.detectChanges();

            expect(component.filteredOptions.length).toBe(0);
        });

        it('should handle options with disabled items', fakeAsync(() => {
            component.nxOptions = [
                { label: 'Option 1', value: '1' },
                { label: 'Option 2', value: '2', disabled: true },
            ];
            component.openDropdown();
            fixture.detectChanges();

            const disabledOption = fixture.nativeElement.querySelector('.nx-select-dropdown-item-disabled');
            expect(disabledOption).toBeTruthy();

            // Clicking disabled option should not select it
            disabledOption.click();
            tick();

            expect(component.selectedOption).toBeNull();
        }));

        it('should clear value when writeValue is called with null', fakeAsync(() => {
            component.writeValue('1');
            fixture.detectChanges();
            tick();

            expect(component.selectedOption).toBeTruthy();

            component.writeValue(null);
            fixture.detectChanges();
            tick();

            expect(component.selectedOption).toBeNull();
        }));

        it('should handle missing selected option in options list', fakeAsync(() => {
            component.writeValue('nonexistent');
            fixture.detectChanges();
            tick();

            expect(component.selectedOption).toBeNull();
        }));
    });

    describe('Change Detection', () => {
        it('should use OnPush change detection', () => {
            const componentDef = (SelectComponent as any).ɵcmp;
            expect(componentDef.changeDetection).toBe(0); // 0 = ChangeDetectionStrategy.OnPush
        });
    });

    describe('Component Destruction', () => {
        it('should cleanup resources on destroy', fakeAsync(() => {
            component.openDropdown();
            fixture.detectChanges();

            spyOn(component, 'closeDropdown');

            component.ngOnDestroy();
            tick();

            expect(component.closeDropdown).toHaveBeenCalled();
        }));
    });
});