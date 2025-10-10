import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { InputDirective, NxInputSize, NxInputStatus, NxInputVariant } from './input.directive';

describe('InputDirective', () => {
    describe('input element', () => {
        let fixture: ComponentFixture<TestInputComponent>;
        let testComponent: TestInputComponent;
        let inputElement: DebugElement;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [InputDirective, TestInputComponent],
            }).compileComponents();

            fixture = TestBed.createComponent(TestInputComponent);
            testComponent = fixture.componentInstance;
            fixture.detectChanges();
            inputElement = fixture.debugElement.query(By.directive(InputDirective));
        });

        it('should create', () => {
            expect(inputElement).toBeTruthy();
        });

        it('should have correct base class', () => {
            expect(inputElement.nativeElement.classList).toContain('nx-input');
        });

        it('should apply disabled class when disabled', () => {
            expect(inputElement.nativeElement.classList).not.toContain('nx-input-disabled');

            testComponent.disabled = true;
            fixture.detectChanges();

            expect(inputElement.nativeElement.classList).toContain('nx-input-disabled');
            expect(inputElement.nativeElement.getAttribute('disabled')).toBe('true');
        });

        it('should apply size classes', () => {
            testComponent.size = 'small';
            fixture.detectChanges();
            expect(inputElement.nativeElement.classList).toContain('nx-input-sm');

            testComponent.size = 'large';
            fixture.detectChanges();
            expect(inputElement.nativeElement.classList).toContain('nx-input-lg');

            testComponent.size = 'default';
            fixture.detectChanges();
            expect(inputElement.nativeElement.classList).not.toContain('nx-input-sm');
            expect(inputElement.nativeElement.classList).not.toContain('nx-input-lg');
        });

        it('should apply variant classes', () => {
            testComponent.variant = 'filled';
            fixture.detectChanges();
            expect(inputElement.nativeElement.classList).toContain('nx-input-filled');

            testComponent.variant = 'borderless';
            fixture.detectChanges();
            expect(inputElement.nativeElement.classList).toContain('nx-input-borderless');

            testComponent.variant = 'outlined';
            fixture.detectChanges();
            expect(inputElement.nativeElement.classList).toContain('nx-input-outlined');
        });

        it('should apply status classes', () => {
            testComponent.status = 'error';
            fixture.detectChanges();
            expect(inputElement.nativeElement.classList).toContain('nx-input-status-error');

            testComponent.status = 'warning';
            fixture.detectChanges();
            expect(inputElement.nativeElement.classList).toContain('nx-input-status-warning');

            testComponent.status = 'success';
            fixture.detectChanges();
            expect(inputElement.nativeElement.classList).toContain('nx-input-status-success');

            testComponent.status = '';
            fixture.detectChanges();
            expect(inputElement.nativeElement.classList).not.toContain('nx-input-status-error');
            expect(inputElement.nativeElement.classList).not.toContain('nx-input-status-warning');
            expect(inputElement.nativeElement.classList).not.toContain('nx-input-status-success');
        });

        it('should apply readonly attribute', () => {
            expect(inputElement.nativeElement.getAttribute('readonly')).toBeNull();

            testComponent.readonly = true;
            fixture.detectChanges();

            expect(inputElement.nativeElement.getAttribute('readonly')).toBe('true');
        });
    });

    describe('textarea element', () => {
        let fixture: ComponentFixture<TestTextareaComponent>;
        let textareaElement: DebugElement;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [InputDirective, TestTextareaComponent],
            }).compileComponents();

            fixture = TestBed.createComponent(TestTextareaComponent);
            fixture.detectChanges();
            textareaElement = fixture.debugElement.query(By.directive(InputDirective));
        });

        it('should work with textarea elements', () => {
            expect(textareaElement).toBeTruthy();
            expect(textareaElement.nativeElement.classList).toContain('nx-input');
        });
    });

    describe('with reactive forms', () => {
        let fixture: ComponentFixture<TestInputFormComponent>;
        let testComponent: TestInputFormComponent;
        let inputElement: DebugElement;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [InputDirective, ReactiveFormsModule, TestInputFormComponent],
            }).compileComponents();

            fixture = TestBed.createComponent(TestInputFormComponent);
            testComponent = fixture.componentInstance;
            fixture.detectChanges();
            inputElement = fixture.debugElement.query(By.directive(InputDirective));
        });

        it('should handle form control disabled state', fakeAsync(() => {
            flush();
            expect(inputElement.nativeElement.classList).not.toContain('nx-input-disabled');
            expect(inputElement.nativeElement.getAttribute('disabled')).toBeNull();

            testComponent.disable();
            flush();
            fixture.detectChanges();

            expect(inputElement.nativeElement.classList).toContain('nx-input-disabled');
            expect(inputElement.nativeElement.getAttribute('disabled')).toBe('true');
        }));

        it('should track form control value changes', fakeAsync(() => {
            const directive = inputElement.injector.get(InputDirective);
            expect(directive.value()).toBe('initial');

            testComponent.formControl.setValue('updated');
            flush();
            fixture.detectChanges();

            expect(directive.value()).toBe('updated');
        }));
    });
});

@Component({
    selector: 'test-input',
    template: `<input nx-input [nxSize]="size" [disabled]="disabled" [nxVariant]="variant" [nxStatus]="status" [readonly]="readonly" />`,
    standalone: true,
    imports: [InputDirective],
})
class TestInputComponent {
    size: NxInputSize = 'default';
    disabled = false;
    variant: NxInputVariant = 'outlined';
    status: NxInputStatus = '';
    readonly = false;
}

@Component({
    selector: 'test-textarea',
    template: `<textarea nx-input></textarea>`,
    standalone: true,
    imports: [InputDirective],
})
class TestTextareaComponent {}

@Component({
    selector: 'test-input-form',
    template: `<input nx-input [formControl]="formControl" />`,
    standalone: true,
    imports: [InputDirective, ReactiveFormsModule],
})
class TestInputFormComponent {
    formControl = new FormControl('initial');

    disable(): void {
        this.formControl.disable();
    }
}
