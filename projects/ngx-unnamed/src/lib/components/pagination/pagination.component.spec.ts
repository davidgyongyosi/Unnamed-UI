import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { NxPaginationComponent } from './pagination.component';
import { NxIconComponent } from '../icon/icon.component';
import { axe } from 'jasmine-axe';

describe('NxPaginationComponent', () => {
    let component: TestPaginationComponent;
    let fixture: ComponentFixture<TestPaginationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestPaginationComponent, NxPaginationComponent, NxIconComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(TestPaginationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
        expect(fixture.nativeElement.querySelector('nx-pagination')).toBeTruthy();
    });

    it('should have no accessibility violations', async () => {
        const results = await axe(fixture.nativeElement);
        expect(results).toHaveNoViolations();
    });

    it('should display correct total items text', () => {
        component.totalItems = 100;
        component.pageSize = 10;
        component.current = 2;
        fixture.detectChanges();

        const totalText = fixture.nativeElement.querySelector('.nx-pagination-total-text');
        expect(totalText?.textContent?.trim()).toBe('11-20 of 100 items');
    });

    it('should display no items text when no items', () => {
        component.totalItems = 0;
        fixture.detectChanges();

        const totalText = fixture.nativeElement.querySelector('.nx-pagination-total-text');
        expect(totalText?.textContent?.trim()).toBe('No items');
    });

    it('should show correct number of page buttons', () => {
        component.total = 5;
        fixture.detectChanges();

        const pageButtons = fixture.nativeElement.querySelectorAll('.nx-pagination-link:not(.disabled)');
        expect(pageButtons.length).toBeGreaterThan(0);
    });

    it('should disable previous and first buttons on first page', () => {
        component.current = 1;
        component.total = 10;
        fixture.detectChanges();

        const prevButton = fixture.nativeElement.querySelector('.nx-pagination-link[aria-label="Previous page"]');
        const firstButton = fixture.nativeElement.querySelector('.nx-pagination-link[aria-label="First page"]');

        expect(prevButton?.classList.contains('disabled')).toBe(true);
        expect(firstButton?.classList.contains('disabled')).toBe(true);
    });

    it('should disable next and last buttons on last page', () => {
        component.current = 10;
        component.total = 10;
        fixture.detectChanges();

        const nextButton = fixture.nativeElement.querySelector('.nx-pagination-link[aria-label="Next page"]');
        const lastButton = fixture.nativeElement.querySelector('.nx-pagination-link[aria-label="Last page"]');

        expect(nextButton?.classList.contains('disabled')).toBe(true);
        expect(lastButton?.classList.contains('disabled')).toBe(true);
    });

    it('should emit page change event when page button clicked', () => {
        spyOn(component, 'onPageChange');
        component.total = 5;
        fixture.detectChanges();

        const pageButton = fixture.nativeElement.querySelector('.nx-pagination-link:not(.disabled)');
        pageButton?.click();

        expect(component.onPageChange).toHaveBeenCalled();
    });

    it('should show size changer when enabled', () => {
        component.showSizeChanger = true;
        component.pageSizeOptions = [10, 20, 50];
        fixture.detectChanges();

        const sizeChanger = fixture.nativeElement.querySelector('.nx-pagination-sizer');
        const select = sizeChanger?.querySelector('select');

        expect(sizeChanger).toBeTruthy();
        expect(select?.options.length).toBe(3);
    });

    it('should show quick jumper when enabled', () => {
        component.showQuickJumper = true;
        fixture.detectChanges();

        const jumper = fixture.nativeElement.querySelector('.nx-pagination-jumper');
        const input = jumper?.querySelector('input');

        expect(jumper).toBeTruthy();
        expect(input).toBeTruthy();
    });

    it('should show simple pagination when simple mode enabled', () => {
        component.simple = true;
        fixture.detectChanges();

        const simpleInput = fixture.nativeElement.querySelector('.nx-pagination-simple-input');
        const simpleTotal = fixture.nativeElement.querySelector('.nx-pagination-simple-total');

        expect(simpleInput).toBeTruthy();
        expect(simpleTotal).toBeTruthy();
    });

    it('should hide total when variant is mini', () => {
        component.variant = 'mini';
        fixture.detectChanges();

        const totalText = fixture.nativeElement.querySelector('.nx-pagination-total');
        expect(totalText).toBeFalsy();
    });

    it('should apply size classes correctly', () => {
        component.size = 'large';
        fixture.detectChanges();

        const pagination = fixture.nativeElement.querySelector('nx-pagination');
        expect(pagination?.classList.contains('nx-pagination-large')).toBe(true);
    });

    it('should handle total items calculation', () => {
        component.totalItems = 95;
        component.pageSize = 10;
        fixture.detectChanges();

        const totalPages = component.totalPages;
        expect(totalPages).toBe(10);
    });

    it('should emit change event when page size changes', () => {
        spyOn(component, 'onChange');
        component.showSizeChanger = true;
        component.pageSizeOptions = [10, 20];
        fixture.detectChanges();

        const select = fixture.nativeElement.querySelector('.nx-pagination-select') as HTMLSelectElement;
        select.value = '20';
        select.dispatchEvent(new Event('change'));

        expect(component.onChange).toHaveBeenCalledWith({
            page: jasmine.any(Number),
            pageSize: 20,
            type: 'size'
        });
    });

    it('should validate page input in simple mode', () => {
        component.simple = true;
        component.total = 10;
        fixture.detectChanges();

        const input = fixture.nativeElement.querySelector('.nx-pagination-simple-input') as HTMLInputElement;
        input.value = '15';
        input.dispatchEvent(new Event('change'));

        // Should not emit invalid page change
        expect(component.current).toBeLessThanOrEqual(10);
    });

    it('should show ellipsis for large page counts', () => {
        component.total = 20;
        component.current = 10;
        fixture.detectChanges();

        const ellipsis = fixture.nativeElement.querySelectorAll('.nx-pagination-ellipsis');
        expect(ellipsis.length).toBeGreaterThan(0);
    });

    it('should handle keyboard navigation', () => {
        component.total = 5;
        fixture.detectChanges();

        const pageButton = fixture.nativeElement.querySelector('.nx-pagination-link:not(.disabled)');
        pageButton?.focus();
        pageButton?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        expect(component.current).toBeGreaterThan(0);
    });
});

@Component({
    selector: 'test-pagination',
    standalone: true,
    imports: [NxPaginationComponent, NxIconComponent],
    template: `
        <nx-pagination
            [current]="current"
            [total]="total"
            [totalItems]="totalItems"
            [pageSize]="pageSize"
            [variant]="variant"
            [size]="size"
            [showSizeChanger]="showSizeChanger"
            [showQuickJumper]="showQuickJumper"
            [showTotal]="showTotal"
            [pageSizeOptions]="pageSizeOptions"
            [disabled]="disabled"
            [simple]="simple"
            (pageChange)="onPageChange($event)"
            (change)="onChange($event)"></nx-pagination>
    `
})
class TestPaginationComponent {
    current = 1;
    total = 0;
    totalItems = 0;
    pageSize = 10;
    variant: 'default' | 'simple' | 'mini' = 'default';
    size: 'small' | 'default' | 'large' = 'default';
    showSizeChanger = false;
    showQuickJumper = false;
    showTotal = true;
    pageSizeOptions = [10, 20, 50, 100];
    disabled = false;
    simple = false;

    onPageChange(event: any) {
        this.current = event.page;
    }

    onChange(event: any) {
        if (event.type === 'page') {
            this.current = event.page;
        } else if (event.type === 'size') {
            this.pageSize = event.pageSize;
        }
    }

    get totalPages(): number {
        return this.total || Math.ceil(this.totalItems / this.pageSize);
    }
}