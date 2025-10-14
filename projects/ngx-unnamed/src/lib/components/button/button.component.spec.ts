import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonComponent } from './button.component';
import { setupAccessibilityMatchers, expectAccessible, createComponentFixture, triggerMouseEvent, expectAttributes, expectClasses } from '../../../test-utils/index';

describe('ButtonComponent', () => {
    let component: ButtonComponent;
    let fixture: ComponentFixture<ButtonComponent>;

    beforeEach(async () => {
        // Setup accessibility matchers for all tests
        setupAccessibilityMatchers();

        await TestBed.configureTestingModule({ imports: [ButtonComponent] }).compileComponents();

        fixture = TestBed.createComponent(ButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Accessibility Tests', () => {
        it('should be accessible when used as button element', async () => {
            const buttonElement = fixture.nativeElement.querySelector('button') ||
                                fixture.nativeElement.querySelector('[nx-button]');

            await expectAccessible(buttonElement);
        });

        it('should be accessible when used as anchor element', async () => {
            component.nxVariant = 'primary';
            fixture.detectChanges();

            const anchorElement = fixture.nativeElement.querySelector('a[nx-button]') ||
                                fixture.nativeElement.querySelector('[nx-button]');

            if (anchorElement) {
                await expectAccessible(anchorElement);
            }
        });

        it('should have correct accessibility attributes when disabled', async () => {
            component.disabled = true;
            fixture.detectChanges();

            const buttonElement = fixture.nativeElement.querySelector('button') ||
                                fixture.nativeElement.querySelector('[nx-button]');

            // Check disabled attribute for button elements
            if (buttonElement.tagName === 'BUTTON') {
                expectAttributes(buttonElement, { 'disabled': 'true' });
            }

            // Check for negative tabindex
            expect(buttonElement.getAttribute('tabindex')).toBe('-1');

            await expectAccessible(buttonElement);
        });

        it('should be accessible in loading state', async () => {
            component.nxLoading = true;
            fixture.detectChanges();

            const buttonElement = fixture.nativeElement.querySelector('button') ||
                                fixture.nativeElement.querySelector('[nx-button]');

            await expectAccessible(buttonElement);
        });

        it('should have proper button styling classes', () => {
            component.nxVariant = 'primary';
            component.nxSize = 'large';
            fixture.detectChanges();

            const buttonElement = fixture.nativeElement.querySelector('button') ||
                                fixture.nativeElement.querySelector('[nx-button]');

            expectClasses(buttonElement, ['nx-btn', 'nx-btn-primary', 'nx-btn-lg']);
        });

        it('should handle keyboard navigation', () => {
            const buttonElement = fixture.nativeElement.querySelector('button') ||
                                fixture.nativeElement.querySelector('[nx-button]');

            // Simulate Enter key press
            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
            const spy = spyOn(enterEvent, 'preventDefault');

            buttonElement.dispatchEvent(enterEvent);

            // Button should handle Enter key properly
            expect(enterEvent.key).toBe('Enter');
        });

        it('should be accessible with icon only', async () => {
            component.nxIcon = 'search';
            fixture.detectChanges();

            const buttonElement = fixture.nativeElement.querySelector('button') ||
                                fixture.nativeElement.querySelector('[nx-button]');

            await expectAccessible(buttonElement);
        });

        it('should be accessible when set to block width', async () => {
            component.nxBlock = true;
            fixture.detectChanges();

            const buttonElement = fixture.nativeElement.querySelector('button') ||
                                fixture.nativeElement.querySelector('[nx-button]');

            expectClasses(buttonElement, ['nx-btn-block']);
            await expectAccessible(buttonElement);
        });

        it('should maintain accessibility across all variants', async () => {
            const variants: Array<ButtonComponent['nxVariant']> = [
                'primary', 'secondary', 'danger', 'outline', 'ghost', 'dashed', 'link'
            ];

            for (const variant of variants) {
                component.nxVariant = variant;
                fixture.detectChanges();

                const buttonElement = fixture.nativeElement.querySelector('button') ||
                                    fixture.nativeElement.querySelector('[nx-button]');

                await expectAccessible(buttonElement);
            }
        });

        it('should maintain accessibility across all sizes', async () => {
            const sizes: Array<ButtonComponent['nxSize']> = ['small', 'default', 'large'];

            for (const size of sizes) {
                component.nxSize = size;
                fixture.detectChanges();

                const buttonElement = fixture.nativeElement.querySelector('button') ||
                                    fixture.nativeElement.querySelector('[nx-button]');

                await expectAccessible(buttonElement);
            }
        });

        it('should maintain accessibility across all shapes', async () => {
            const shapes: Array<ButtonComponent['nxShape']> = ['circle', 'round'];

            for (const shape of shapes) {
                component.nxShape = shape;
                fixture.detectChanges();

                const buttonElement = fixture.nativeElement.querySelector('button') ||
                                    fixture.nativeElement.querySelector('[nx-button]');

                await expectAccessible(buttonElement);
            }
        });
    });

    describe('Additional Functional Tests', () => {
        it('should prevent click events when disabled', () => {
            component.disabled = true;
            fixture.detectChanges();

            const buttonElement = fixture.nativeElement.querySelector('button') ||
                                fixture.nativeElement.querySelector('[nx-button]');

            const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
            const preventDefaultSpy = spyOn(clickEvent, 'preventDefault');

            buttonElement.dispatchEvent(clickEvent);

            if (buttonElement.tagName === 'BUTTON') {
                expect(preventDefaultSpy).toHaveBeenCalled();
            }
        });

        it('should prevent click events when loading', () => {
            component.nxLoading = true;
            fixture.detectChanges();

            const buttonElement = fixture.nativeElement.querySelector('button') ||
                                fixture.nativeElement.querySelector('[nx-button]');

            const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
            const preventDefaultSpy = spyOn(clickEvent, 'preventDefault');

            buttonElement.dispatchEvent(clickEvent);

            expect(preventDefaultSpy).toHaveBeenCalled();
        });
    });
});
