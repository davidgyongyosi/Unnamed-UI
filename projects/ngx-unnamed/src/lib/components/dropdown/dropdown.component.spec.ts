import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, Input, TemplateRef, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { axe, toHaveNoViolations } from 'jasmine-axe';

import { DropdownComponent } from './dropdown.component';
import { DropdownMenuComponent } from './dropdown.menu.component';
import { ButtonComponent } from '../button/button.component';
import { NxIconDirective } from '../icon/icon.directive';
import { NxDropdownConfig, NxDropdownItem } from './dropdown.types';

// Mock dependencies
@Component({
    selector: 'nx-button',
    standalone: true,
    template: '<button><ng-content></ng-content></button>'
})
class MockButtonComponent {
    @Input() variant = 'default';
    @Input() disabled = false;
}

@Component({
    selector: 'span[nxIcon]',
    standalone: true,
    template: '<span class="mock-icon"></span>'
})
class MockIconDirective {
    @Input() nxIcon = '';
}

// Test host component
@Component({
    selector: 'nx-test-host',
    standalone: true,
    imports: [
        CommonModule,
        DropdownComponent,
        DropdownMenuComponent,
        MockButtonComponent,
        MockIconDirective
    ],
    template: `
        <nx-dropdown
            [config]="config"
            [items]="items"
            [disabled]="disabled"
            (visibleChange)="onVisibleChange($event)"
            (itemClick)="onItemClick($event)">
            <button nx-button nx-dropdown-trigger>Trigger</button>
            <nx-dropdown-menu [items]="items"></nx-dropdown-menu>
        </nx-dropdown>
    `
})
class TestHostComponent {
    config: NxDropdownConfig = {};
    items: NxDropdownItem[] = [
        { key: '1', label: 'Item 1' },
        { key: '2', label: 'Item 2' },
        { key: '3', label: 'Item 3', disabled: true },
        { key: '4', label: 'Item 4' }
    ];
    disabled = false;

    onVisibleChange = jasmine.createSpy('onVisibleChange');
    onItemClick = jasmine.createSpy('onItemClick');
}

describe('DropdownComponent', () => {
    let component: TestHostComponent;
    let fixture: ComponentFixture<TestHostComponent>;
    let dropdownEl: HTMLElement;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [TestHostComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        dropdownEl = fixture.debugElement.query(By.css('nx-dropdown')).nativeElement;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have correct accessibility attributes', () => {
        const triggerEl = dropdownEl.querySelector('[nx-dropdown-trigger]') as HTMLElement;
        expect(triggerEl.getAttribute('aria-haspopup')).toBe('menu');
        expect(triggerEl.getAttribute('aria-expanded')).toBe('false');
    });

    it('should open dropdown on trigger click', () => {
        const triggerEl = dropdownEl.querySelector('[nx-dropdown-trigger]') as HTMLElement;
        triggerEl.click();
        fixture.detectChanges();

        expect(component.onVisibleChange).toHaveBeenCalledWith({ visible: true, dropdown: jasmine.any(HTMLElement) });
    });

    it('should not open when disabled', () => {
        component.disabled = true;
        fixture.detectChanges();

        const triggerEl = dropdownEl.querySelector('[nx-dropdown-trigger]') as HTMLElement;
        triggerEl.click();
        fixture.detectChanges();

        expect(component.onVisibleChange).not.toHaveBeenCalled();
    });

    it('should respect trigger configuration', () => {
        component.config = { trigger: 'hover' };
        fixture.detectChanges();

        // Should work with hover
        const triggerEl = dropdownEl.querySelector('[nx-dropdown-trigger]') as HTMLElement;
        triggerEl.dispatchEvent(new MouseEvent('mouseenter'));
        fixture.detectChanges();

        // Due to hover delay, we need to wait
        setTimeout(() => {
            expect(component.onVisibleChange).toHaveBeenCalled();
        }, 200);
    });

    it('should close on escape key', () => {
        const triggerEl = dropdownEl.querySelector('[nx-dropdown-trigger]') as HTMLElement;

        // Open dropdown first
        triggerEl.click();
        fixture.detectChanges();
        (component.onVisibleChange as jasmine.Spy).calls.reset();

        // Press escape
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        fixture.detectChanges();

        expect(component.onVisibleChange).toHaveBeenCalledWith({ visible: false, dropdown: jasmine.any(HTMLElement) });
    });

    it('should handle item click events', () => {
        component.config = { trigger: 'manual' };
        fixture.detectChanges();

        // Open dropdown manually
        const dropdownComp = fixture.debugElement.query(By.css('nx-dropdown')).componentInstance as DropdownComponent;
        dropdownComp.open();
        fixture.detectChanges();

        // Simulate item click
        const itemClick = { item: component.items[0], index: 0, event: new MouseEvent('click') };
        dropdownComp.onItemClick(itemClick.item, itemClick.index, itemClick.event);

        expect(component.onItemClick).toHaveBeenCalledWith(itemClick);
    });

    it('should respect placement configuration', () => {
        component.config = { placement: 'topLeft' };
        fixture.detectChanges();

        const dropdownComp = fixture.debugElement.query(By.css('nx-dropdown')).componentInstance as DropdownComponent;
        expect(dropdownComp.fullConfig().placement).toBe('topLeft');
    });

    it('should have no accessibility violations', async () => {
        const results = await axe(dropdownEl);
        expect(results).toHaveNoViolations();
    });
});

describe('DropdownComponent with different configurations', () => {
    let component: TestHostComponent;
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [TestHostComponent]
        }).compileComponents();
    }));

    it('should show arrow when configured', () => {
        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
        component.config = { showArrow: true };
        fixture.detectChanges();

        const dropdownComp = fixture.debugElement.query(By.css('nx-dropdown')).componentInstance as DropdownComponent;
        expect(dropdownComp.showArrow()).toBe(true);
    });

    it('should use custom width when configured', () => {
        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
        component.config = { width: 300 };
        fixture.detectChanges();

        const dropdownComp = fixture.debugElement.query(By.css('nx-dropdown')).componentInstance as DropdownComponent;
        expect(dropdownComp.dropdownWidth()).toBe('300px');
    });

    it('should use string width when configured', () => {
        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
        component.config = { width: '50%' };
        fixture.detectChanges();

        const dropdownComp = fixture.debugElement.query(By.css('nx-dropdown')).componentInstance as DropdownComponent;
        expect(dropdownComp.dropdownWidth()).toBe('50%');
    });
});

describe('DropdownComponent edge cases', () => {
    let component: TestHostComponent;
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [TestHostComponent]
        }).compileComponents();
    }));

    it('should handle empty items array', () => {
        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
        component.items = [];
        fixture.detectChanges();

        const dropdownComp = fixture.debugElement.query(By.css('nx-dropdown')).componentInstance as DropdownComponent;
        dropdownComp.open();
        fixture.detectChanges();

        // Should not throw error with empty items
        expect(dropdownComp.visible()).toBe(true);
    });

    it('should handle missing configuration gracefully', () => {
        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
        component.config = undefined as any;
        fixture.detectChanges();

        const dropdownComp = fixture.debugElement.query(By.css('nx-dropdown')).componentInstance as DropdownComponent;
        expect(dropdownComp.fullConfig()).toBeDefined();
        expect(dropdownComp.fullConfig().trigger).toBe('click'); // default value
    });

    it('should handle rapid open/close operations', () => {
        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        const dropdownEl = fixture.debugElement.query(By.css('nx-dropdown')).nativeElement;
        const triggerEl = dropdownEl.querySelector('[nx-dropdown-trigger]') as HTMLElement;
        const dropdownComp = fixture.debugElement.query(By.css('nx-dropdown')).componentInstance as DropdownComponent;

        // Rapidly toggle
        triggerEl.click();
        triggerEl.click();
        triggerEl.click();
        fixture.detectChanges();

        // Should not cause errors
        expect(dropdownComp.visible()).toBeDefined();
    });
});