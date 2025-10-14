import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { InputDirective, NxInputSize, NxInputStatus, NxInputVariant } from './input.directive';
import { setupAccessibilityMatchers, expectAccessible, expectAttributes, expectClasses } from '../../../test-utils/index';

describe('InputDirective', () => {
    describe('input element', () => {
        let fixture: ComponentFixture<TestInputComponent>;
        let testComponent: TestInputComponent;
        let inputElement: DebugElement;

        beforeEach(async () => {
            // Setup accessibility matchers for all tests
            setupAccessibilityMatchers();

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

        describe('Accessibility Tests', () => {
            it('should be accessible in default state', async () => {
                await expectAccessible(inputElement.nativeElement);
            });

            it('should be accessible when disabled', async () => {
                testComponent.disabled = true;
                fixture.detectChanges();

                expect(inputElement.nativeElement.classList).toContain('nx-input-disabled');
                expectAttributes(inputElement.nativeElement, { 'disabled': 'true' });

                await expectAccessible(inputElement.nativeElement);
            });

            it('should be accessible when readonly', async () => {
                testComponent.readonly = true;
                fixture.detectChanges();

                expectAttributes(inputElement.nativeElement, { 'readonly': 'true' });

                await expectAccessible(inputElement.nativeElement);
            });

            it('should be accessible across all sizes', async () => {
                const sizes: NxInputSize[] = ['small', 'default', 'large'];

                for (const size of sizes) {
                    testComponent.size = size;
                    fixture.detectChanges();

                    const expectedClass = size === 'default' ? '' : `nx-input-${size === 'large' ? 'lg' : 'sm'}`;
                    if (expectedClass) {
                        expectClasses(inputElement.nativeElement, [expectedClass]);
                    }

                    await expectAccessible(inputElement.nativeElement);
                }
            });

            it('should be accessible across all variants', async () => {
                const variants: NxInputVariant[] = ['outlined', 'filled', 'borderless'];

                for (const variant of variants) {
                    testComponent.variant = variant;
                    fixture.detectChanges();

                    expectClasses(inputElement.nativeElement, [`nx-input-${variant}`]);

                    await expectAccessible(inputElement.nativeElement);
                }
            });

            it('should be accessible across all status states', async () => {
                const statuses: NxInputStatus[] = ['error', 'warning', 'success'];

                for (const status of statuses) {
                    testComponent.status = status;
                    fixture.detectChanges();

                    expectClasses(inputElement.nativeElement, [`nx-input-status-${status}`]);

                    await expectAccessible(inputElement.nativeElement);
                }
            });

            it('should be accessible with placeholder text', async () => {
                // Add placeholder to test input
                inputElement.nativeElement.setAttribute('placeholder', 'Enter your name');
                fixture.detectChanges();

                await expectAccessible(inputElement.nativeElement);
            });

            it('should be accessible with input value', async () => {
                inputElement.nativeElement.value = 'Test value';
                fixture.detectChanges();

                await expectAccessible(inputElement.nativeElement);
            });

            it('should be accessible when focused', async () => {
                inputElement.nativeElement.focus();
                fixture.detectChanges();

                await expectAccessible(inputElement.nativeElement);
            });

            it('should be accessible with required attribute', async () => {
                inputElement.nativeElement.setAttribute('required', 'true');
                fixture.detectChanges();

                expectAttributes(inputElement.nativeElement, { 'required': 'true' });

                await expectAccessible(inputElement.nativeElement);
            });

            it('should be accessible with aria attributes', async () => {
                inputElement.nativeElement.setAttribute('aria-label', 'Email input');
                inputElement.nativeElement.setAttribute('aria-describedby', 'email-help');
                fixture.detectChanges();

                expectAttributes(inputElement.nativeElement, {
                    'aria-label': 'Email input',
                    'aria-describedby': 'email-help'
                });

                await expectAccessible(inputElement.nativeElement);
            });

            it('should be accessible with input type changes', async () => {
                const inputTypes = ['text', 'email', 'password', 'search', 'tel', 'url'];

                for (const type of inputTypes) {
                    inputElement.nativeElement.setAttribute('type', type);
                    fixture.detectChanges();

                    expectAttributes(inputElement.nativeElement, { 'type': type });

                    await expectAccessible(inputElement.nativeElement);
                }
            });

            it('should be accessible with maxlength attribute', async () => {
                inputElement.nativeElement.setAttribute('maxlength', '50');
                fixture.detectChanges();

                expectAttributes(inputElement.nativeElement, { 'maxlength': '50' });

                await expectAccessible(inputElement.nativeElement);
            });

            it('should be accessible with autocomplete attribute', async () => {
                inputElement.nativeElement.setAttribute('autocomplete', 'email');
                fixture.detectChanges();

                expectAttributes(inputElement.nativeElement, { 'autocomplete': 'email' });

                await expectAccessible(inputElement.nativeElement);
            });
        });
    });

    describe('textarea element', () => {
        let fixture: ComponentFixture<TestTextareaComponent>;
        let textareaElement: DebugElement;

        beforeEach(async () => {
            // Setup accessibility matchers for all tests
            setupAccessibilityMatchers();

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

        describe('Accessibility Tests for Textarea', () => {
            it('should be accessible in default state', async () => {
                await expectAccessible(textareaElement.nativeElement);
            });

            it('should be accessible with content', async () => {
                textareaElement.nativeElement.value = 'Test textarea content';
                fixture.detectChanges();

                await expectAccessible(textareaElement.nativeElement);
            });

            it('should be accessible with placeholder', async () => {
                textareaElement.nativeElement.setAttribute('placeholder', 'Enter your message');
                fixture.detectChanges();

                await expectAccessible(textareaElement.nativeElement);
            });

            it('should be accessible with rows and cols attributes', async () => {
                textareaElement.nativeElement.setAttribute('rows', '4');
                textareaElement.nativeElement.setAttribute('cols', '50');
                fixture.detectChanges();

                expectAttributes(textareaElement.nativeElement, {
                    'rows': '4',
                    'cols': '50'
                });

                await expectAccessible(textareaElement.nativeElement);
            });

            it('should be accessible when disabled', async () => {
                textareaElement.nativeElement.setAttribute('disabled', 'true');
                fixture.detectChanges();

                expectAttributes(textareaElement.nativeElement, { 'disabled': 'true' });

                await expectAccessible(textareaElement.nativeElement);
            });

            it('should be accessible when readonly', async () => {
                textareaElement.nativeElement.setAttribute('readonly', 'true');
                fixture.detectChanges();

                expectAttributes(textareaElement.nativeElement, { 'readonly': 'true' });

                await expectAccessible(textareaElement.nativeElement);
            });

            it('should be accessible with maxlength attribute', async () => {
                textareaElement.nativeElement.setAttribute('maxlength', '200');
                fixture.detectChanges();

                expectAttributes(textareaElement.nativeElement, { 'maxlength': '200' });

                await expectAccessible(textareaElement.nativeElement);
            });

            it('should be accessible with aria attributes', async () => {
                textareaElement.nativeElement.setAttribute('aria-label', 'Message input');
                textareaElement.nativeElement.setAttribute('aria-describedby', 'message-help');
                fixture.detectChanges();

                expectAttributes(textareaElement.nativeElement, {
                    'aria-label': 'Message input',
                    'aria-describedby': 'message-help'
                });

                await expectAccessible(textareaElement.nativeElement);
            });
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
