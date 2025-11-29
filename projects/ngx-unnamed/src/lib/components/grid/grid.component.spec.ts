import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { axe } from 'jasmine-axe';

import { NxGridComponent } from './grid.component';
import { NxGridColComponent } from './grid-col.component';
import { NxGridRowComponent } from './grid-row.component';
import { ResponsiveUtility } from '../../utils/responsive.utility';

// Mock ResponsiveUtility
class MockResponsiveUtility {
    breakpoint$ = {
        subscribe: jasmine.createSpy('subscribe').and.callFake((callback: any) => {
            callback('md');
            return { unsubscribe: jasmine.createSpy('unsubscribe') };
        })
    };

    destroy = jasmine.createSpy('destroy');
}

describe('NxGridComponent', () => {
    let component: NxGridComponent;
    let fixture: ComponentFixture<NxGridComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NxGridComponent, NxGridColComponent, NxGridRowComponent],
            providers: [{ provide: ResponsiveUtility, useClass: MockResponsiveUtility }]
        }).compileComponents();

        fixture = TestBed.createComponent(NxGridComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have default grid classes', () => {
        const gridElement = fixture.debugElement.query(By.css('div'));
        expect(gridElement.nativeElement.classList).toContain('nx-grid');
    });

    it('should apply responsive class when responsive is enabled', () => {
        const gridElement = fixture.debugElement.query(By.css('div'));
        expect(gridElement.nativeElement.classList).toContain('nx-grid-md');
    });

    it('should have default grid styles', () => {
        const gridElement = fixture.debugElement.query(By.css('div'));
        const styles = gridElement.nativeElement.style;

        expect(styles.display).toBe('grid');
        expect(styles.width).toBe('100%');
        expect(styles.gap).toBe('16px');
        expect(styles.gridTemplateColumns).toBe('repeat(6, 1fr)'); // md breakpoint default
    });

    it('should update columns when columns input changes', () => {
        component.columns = 12;
        fixture.detectChanges();

        const gridElement = fixture.debugElement.query(By.css('div'));
        const styles = gridElement.nativeElement.style;
        expect(styles.gridTemplateColumns).toBe('repeat(12, 1fr)');
    });

    it('should update gap when gap input changes', () => {
        component.gap = '24px';
        fixture.detectChanges();

        const gridElement = fixture.debugElement.query(By.css('div'));
        const styles = gridElement.nativeElement.style;
        expect(styles.gap).toBe('24px');
    });

    it('should update gap when numeric gap input changes', () => {
        component.gap = 32;
        fixture.detectChanges();

        const gridElement = fixture.debugElement.query(By.css('div'));
        const styles = gridElement.nativeElement.style;
        expect(styles.gap).toBe('32px');
    });

    it('should apply full config when config input is provided', () => {
        const config = {
            columns: 16,
            gap: '20px',
            responsive: false,
            breakpoints: {
                xs: 480,
                sm: 768,
                md: 1024,
                lg: 1280,
                xl: 1600,
                xxl: 1920
            }
        };

        component.config = config;
        fixture.detectChanges();

        const gridElement = fixture.debugElement.query(By.css('div'));
        const styles = gridElement.nativeElement.style;
        expect(styles.gridTemplateColumns).toBe('repeat(16, 1fr)');
        expect(styles.gap).toBe('20px');
    });

    it('should provide grid context', () => {
        const context = component.gridContext();
        expect(context).toBeDefined();
        expect(context.grid).toBeDefined();
        expect(context.col).toBeDefined();
        expect(context.row).toBeDefined();
        expect(context.breakpoint).toBe('md');
        expect(context.responsive).toBe(true);
    });

    it('should be accessible', async () => {
        const results = await axe(fixture.nativeElement);
        expect(results).toHaveNoViolations();
    });
});

describe('NxGridColComponent', () => {
    let component: NxGridColComponent;
    let fixture: ComponentFixture<NxGridColComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NxGridColComponent],
            providers: [{ provide: ResponsiveUtility, useClass: MockResponsiveUtility }]
        }).compileComponents();

        fixture = TestBed.createComponent(NxGridColComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have default column classes', () => {
        const element = fixture.debugElement.query(By.css('div'));
        expect(element.nativeElement.classList).toContain('nx-grid-col');
    });

    it('should apply span class when span input is set', () => {
        component.span = 6;
        fixture.detectChanges();

        const element = fixture.debugElement.query(By.css('div'));
        expect(element.nativeElement.classList).toContain('nx-col-span-6');
    });

    it('should apply offset class when offset input is set', () => {
        component.offset = 2;
        fixture.detectChanges();

        const element = fixture.debugElement.query(By.css('div'));
        expect(element.nativeElement.classList).toContain('nx-col-offset-2');
    });

    it('should apply order class when order input is set', () => {
        component.order = 3;
        fixture.detectChanges();

        const element = fixture.debugElement.query(By.css('div'));
        expect(element.nativeElement.classList).toContain('nx-col-order-3');
    });

    it('should apply responsive span classes', () => {
        component.xs = 2;
        component.sm = 4;
        component.md = 6;
        component.lg = 8;
        fixture.detectChanges();

        const element = fixture.debugElement.query(By.css('div'));
        expect(element.nativeElement.classList).toContain('nx-col-xs-2');
        expect(element.nativeElement.classList).toContain('nx-col-sm-4');
        expect(element.nativeElement.classList).toContain('nx-col-md-6');
        expect(element.nativeElement.classList).toContain('nx-col-lg-8');
    });

    it('should apply full config when config input is provided', () => {
        const config = {
            span: 8,
            offset: 2,
            push: 1,
            pull: 1,
            order: 2
        };

        component.config = config;
        fixture.detectChanges();

        const element = fixture.debugElement.query(By.css('div'));
        expect(element.nativeElement.classList).toContain('nx-col-span-8');
        expect(element.nativeElement.classList).toContain('nx-col-offset-2');
        expect(element.nativeElement.classList).toContain('nx-col-push-1');
        expect(element.nativeElement.classList).toContain('nx-col-pull-1');
        expect(element.nativeElement.classList).toContain('nx-col-order-2');
    });

    it('should have correct role attribute', () => {
        const element = fixture.debugElement.query(By.css('div'));
        expect(element.nativeElement.getAttribute('role')).toBe('gridcell');
    });

    it('should be accessible', async () => {
        const results = await axe(fixture.nativeElement);
        expect(results).toHaveNoViolations();
    });
});

describe('NxGridRowComponent', () => {
    let component: NxGridRowComponent;
    let fixture: ComponentFixture<NxGridRowComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NxGridRowComponent],
            providers: [{ provide: ResponsiveUtility, useClass: MockResponsiveUtility }]
        }).compileComponents();

        fixture = TestBed.createComponent(NxGridRowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have default row classes', () => {
        const element = fixture.debugElement.query(By.css('div'));
        expect(element.nativeElement.classList).toContain('nx-grid-row');
        expect(element.nativeElement.classList).toContain('nx-align-stretch');
        expect(element.nativeElement.classList).toContain('nx-justify-start');
        expect(element.nativeElement.classList).toContain('nx-wrap-');
    });

    it('should apply alignment class when align input is set', () => {
        component.align = 'center';
        fixture.detectChanges();

        const element = fixture.debugElement.query(By.css('div'));
        expect(element.nativeElement.classList).toContain('nx-align-center');
    });

    it('should apply justification class when justify input is set', () => {
        component.justify = 'space-between';
        fixture.detectChanges();

        const element = fixture.debugElement.query(By.css('div'));
        expect(element.nativeElement.classList).toContain('nx-justify-space-between');
    });

    it('should apply wrap class when wrap input is set', () => {
        component.wrap = 'nowrap';
        fixture.detectChanges();

        const element = fixture.debugElement.query(By.css('div'));
        expect(element.nativeElement.classList).toContain('nx-wrap-nowrap');
    });

    it('should update gap when gap input changes', () => {
        component.gap = '24px';
        fixture.detectChanges();

        const element = fixture.debugElement.query(By.css('div'));
        const styles = element.nativeElement.style;
        expect(styles.gap).toBe('24px');
    });

    it('should apply full config when config input is provided', () => {
        const config = {
            gap: '20px',
            align: 'center' as const,
            justify: 'space-around' as const,
            wrap: 'wrap-reverse' as const
        };

        component.config = config;
        fixture.detectChanges();

        const element = fixture.debugElement.query(By.css('div'));
        expect(element.nativeElement.classList).toContain('nx-align-center');
        expect(element.nativeElement.classList).toContain('nx-justify-space-around');
        expect(element.nativeElement.classList).toContain('nx-wrap-reverse');
    });

    it('should have correct flexbox styles', () => {
        const element = fixture.debugElement.query(By.css('div'));
        const styles = element.nativeElement.style;

        expect(styles.display).toBe('flex');
        expect(styles.alignItems).toBe('stretch');
        expect(styles.justifyContent).toBe('flex-start');
        expect(styles.flexWrap).toBe('wrap');
    });

    it('should have correct role attribute', () => {
        const element = fixture.debugElement.query(By.css('div'));
        expect(element.nativeElement.getAttribute('role')).toBe('row');
    });

    it('should be accessible', async () => {
        const results = await axe(fixture.nativeElement);
        expect(results).toHaveNoViolations();
    });
});

// Integration test for grid system
@Component({
    selector: 'test-grid-integration',
    standalone: true,
    imports: [NxGridComponent, NxGridColComponent, NxGridRowComponent],
    template: `
        <nx-grid [columns]="12" [gap]="20">
            <nx-col [span]="6">
                <div class="test-content">Column 1</div>
            </nx-col>
            <nx-col [span]="4">
                <div class="test-content">Column 2</div>
            </nx-col>
            <nx-col [span]="2">
                <div class="test-content">Column 3</div>
            </nx-col>
        </nx-grid>

        <nx-row [justify]="'center'" [align]="'center'" [gap]="16">
            <nx-col [span]="3">
                <div class="test-content">Row Item 1</div>
            </nx-col>
            <nx-col [span]="3">
                <div class="test-content">Row Item 2</div>
            </nx-col>
        </nx-row>
    `,
    styles: [`
        .test-content {
            background: #f0f0f0;
            padding: 16px;
            text-align: center;
            border: 1px solid #ddd;
        }
    `]
})
class TestGridIntegrationComponent {}

describe('Grid System Integration', () => {
    let component: TestGridIntegrationComponent;
    let fixture: ComponentFixture<TestGridIntegrationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestGridIntegrationComponent],
            providers: [{ provide: ResponsiveUtility, useClass: MockResponsiveUtility }]
        }).compileComponents();

        fixture = TestBed.createComponent(TestGridIntegrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create integrated grid components', () => {
        expect(component).toBeTruthy();
    });

    it('should render grid with correct columns', () => {
        const grid = fixture.debugElement.query(By.css('nx-grid > div'));
        const styles = grid.nativeElement.style;
        expect(styles.gridTemplateColumns).toBe('repeat(12, 1fr)');
        expect(styles.gap).toBe('20px');
    });

    it('should render columns with correct spans', () => {
        const columns = fixture.debugElement.queryAll(By.css('nx-col > div'));
        expect(columns.length).toBe(3);

        expect(columns[0].nativeElement.classList).toContain('nx-col-span-6');
        expect(columns[1].nativeElement.classList).toContain('nx-col-span-4');
        expect(columns[2].nativeElement.classList).toContain('nx-col-span-2');
    });

    it('should render row with correct alignment', () => {
        const row = fixture.debugElement.query(By.css('nx-row > div'));
        const styles = row.nativeElement.style;
        expect(styles.justifyContent).toBe('center');
        expect(styles.alignItems).toBe('center');
        expect(styles.gap).toBe('16px');
    });

    it('should be accessible', async () => {
        const results = await axe(fixture.nativeElement);
        expect(results).toHaveNoViolations();
    });
});