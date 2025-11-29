import { ComponentFixture, TestBed } from '@angular/core/testing';
import { axe } from 'jasmine-axe';

import { BadgeComponent } from './badge.component';
import { NxBadgeStatus, NxBadgePosition } from './badge.types';

describe('BadgeComponent', () => {
    let component: BadgeComponent;
    let fixture: ComponentFixture<BadgeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BadgeComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BadgeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should not show badge when no content, count, or dot is provided', () => {
        // Create new component instance with specific input values
        fixture = TestBed.createComponent(BadgeComponent);
        component = fixture.componentInstance;
        // Since inputs are signals, we need to create the component with specific input overrides
        fixture.componentRef.setInput('content', undefined);
        fixture.componentRef.setInput('dot', false);
        fixture.detectChanges();

        const badgeElement = fixture.nativeElement.querySelector('.nx-badge');
        expect(badgeElement).toBeFalsy();
    });

    describe('Basic Badge', () => {
        it('should display text content', () => {
            fixture.componentRef.setInput('content', 'New');
            fixture.detectChanges();

            const badgeElement = fixture.nativeElement.querySelector('.nx-badge');
            expect(badgeElement?.textContent?.trim()).toBe('New');
        });

        it('should display number content', () => {
            fixture.componentRef.setInput('content', 42);
            fixture.detectChanges();

            const badgeElement = fixture.nativeElement.querySelector('.nx-badge');
            expect(badgeElement?.textContent?.trim()).toBe('42');
        });

        it('should apply correct status class', () => {
            fixture.componentRef.setInput('content', 'Test');
            fixture.componentRef.setInput('status', 'success');
            fixture.detectChanges();

            const badgeElement = fixture.nativeElement.querySelector('.nx-badge');
            expect(badgeElement).toHaveClass('nx-badge-success');
        });
    });

    describe('Count Badge', () => {
        it('should display count value', () => {
            fixture.componentRef.setInput('count', 5);
            fixture.detectChanges();

            const badgeElement = fixture.nativeElement.querySelector('.nx-badge');
            expect(badgeElement?.textContent?.trim()).toBe('5');
        });

        it('should show max count with + when count exceeds maxCount', () => {
            fixture.componentRef.setInput('count', 150);
            fixture.componentRef.setInput('maxCount', 99);
            fixture.detectChanges();

            const badgeElement = fixture.nativeElement.querySelector('.nx-badge');
            expect(badgeElement?.textContent?.trim()).toBe('99+');
        });

        it('should show exact count when below maxCount', () => {
            fixture.componentRef.setInput('count', 50);
            fixture.componentRef.setInput('maxCount', 99);
            fixture.detectChanges();

            const badgeElement = fixture.nativeElement.querySelector('.nx-badge');
            expect(badgeElement?.textContent?.trim()).toBe('50');
        });
    });

    describe('Dot Badge', () => {
        it('should show dot without text content', () => {
            fixture.componentRef.setInput('dot', true);
            fixture.detectChanges();

            const badgeElement = fixture.nativeElement.querySelector('.nx-badge');
            expect(badgeElement).toHaveClass('nx-badge-dot');
            expect(badgeElement?.textContent?.trim()).toBe('');
        });

        it('should apply dot styling with correct size', () => {
            fixture.componentRef.setInput('dot', true);
            fixture.componentRef.setInput('size', 'small');
            fixture.detectChanges();

            const badgeElement = fixture.nativeElement.querySelector('.nx-badge');
            expect(badgeElement).toHaveClass('nx-badge-dot');
            expect(badgeElement).toHaveClass('nx-badge-small');
        });
    });

    describe('Size Variants', () => {
        it('should apply small size class', () => {
            fixture.componentRef.setInput('content', 'Small');
            fixture.componentRef.setInput('size', 'small');
            fixture.detectChanges();

            const badgeElement = fixture.nativeElement.querySelector('.nx-badge');
            expect(badgeElement).toHaveClass('nx-badge-small');
        });

        it('should apply default size class', () => {
            fixture.componentRef.setInput('content', 'Default');
            fixture.componentRef.setInput('size', 'default');
            fixture.detectChanges();

            const badgeElement = fixture.nativeElement.querySelector('.nx-badge');
            expect(badgeElement).toHaveClass('nx-badge-default');
        });
    });

    describe('Position Variants', () => {
        const positions: NxBadgePosition[] = ['top-right', 'top-left', 'bottom-right', 'bottom-left'];

        positions.forEach(position => {
            it(`should apply ${position} position class`, () => {
                fixture.componentRef.setInput('content', 'Test');
                fixture.componentRef.setInput('position', position as any);
                fixture.detectChanges();

                const badgeElement = fixture.nativeElement.querySelector('.nx-badge');
                expect(badgeElement).toHaveClass(`nx-badge-${position}`);
            });
        });
    });

    describe('Status Colors', () => {
        const statuses: NxBadgeStatus[] = ['default', 'success', 'error', 'warning', 'info'];

        statuses.forEach(status => {
            it(`should apply ${status} status styling`, () => {
                fixture.componentRef.setInput('content', 'Test');
                fixture.componentRef.setInput('status', status);
                fixture.detectChanges();

                const badgeElement = fixture.nativeElement.querySelector('.nx-badge');
                expect(badgeElement).toHaveClass(`nx-badge-${status}`);
            });
        });
    });

    describe('Bordered Badge', () => {
        it('should apply bordered styling when bordered is true', () => {
            fixture.componentRef.setInput('content', 'Bordered');
            fixture.componentRef.setInput('bordered', true);
            fixture.detectChanges();

            const badgeElement = fixture.nativeElement.querySelector('.nx-badge');
            expect(badgeElement).toHaveClass('nx-badge-bordered');
        });

        it('should not apply bordered styling when bordered is false', () => {
            fixture.componentRef.setInput('content', 'Not Bordered');
            fixture.componentRef.setInput('bordered', false);
            fixture.detectChanges();

            const badgeElement = fixture.nativeElement.querySelector('.nx-badge');
            expect(badgeElement).not.toHaveClass('nx-badge-bordered');
        });
    });

    describe('Custom Color', () => {
        it('should apply custom color when provided', () => {
            fixture.componentRef.setInput('content', 'Custom');
            fixture.componentRef.setInput('color', '#ff6b6b');
            fixture.detectChanges();

            const badgeElement = fixture.nativeElement.querySelector('.nx-badge');
            expect(badgeElement).toHaveClass('nx-badge-custom-color');
            expect(badgeElement.style.getPropertyValue('--nx-badge-bg')).toBe('#ff6b6b');
        });
    });

    describe('Custom Classes and Styles', () => {
        it('should apply custom CSS class', () => {
            fixture.componentRef.setInput('content', 'Test');
            fixture.componentRef.setInput('className', 'custom-class another-class');
            fixture.detectChanges();

            const badgeElement = fixture.nativeElement.querySelector('.nx-badge');
            expect(badgeElement).toHaveClass('custom-class');
            expect(badgeElement).toHaveClass('another-class');
        });

        it('should apply custom styles', () => {
            fixture.componentRef.setInput('content', 'Test');
            fixture.componentRef.setInput('style', { 'font-weight': 'bold', 'text-transform': 'uppercase' });
            fixture.detectChanges();

            const badgeElement = fixture.nativeElement.querySelector('.nx-badge');
            expect(badgeElement.style.fontWeight).toBe('bold');
            expect(badgeElement.style.textTransform).toBe('uppercase');
        });
    });

    describe('Accessibility', () => {
        it('should have proper ARIA attributes', () => {
            fixture.componentRef.setInput('content', '5 items');
            fixture.detectChanges();

            const badgeElement = fixture.nativeElement.querySelector('.nx-badge');
            expect(badgeElement?.getAttribute('role')).toBe('status');
            expect(badgeElement?.getAttribute('aria-live')).toBe('polite');
            expect(badgeElement?.getAttribute('aria-label')).toBeTruthy();
        });

        it('should provide appropriate ARIA label for count badge', () => {
            fixture.componentRef.setInput('count', 5);
            fixture.detectChanges();

            const badgeElement = fixture.nativeElement.querySelector('.nx-badge');
            expect(badgeElement?.getAttribute('aria-label')).toBe('5 items');
        });

        it('should provide appropriate ARIA label for single item', () => {
            fixture.componentRef.setInput('count', 1);
            fixture.detectChanges();

            const badgeElement = fixture.nativeElement.querySelector('.nx-badge');
            expect(badgeElement?.getAttribute('aria-label')).toBe('1 item');
        });

        it('should provide appropriate ARIA label for text badge', () => {
            fixture.componentRef.setInput('content', 'New');
            fixture.detectChanges();

            const badgeElement = fixture.nativeElement.querySelector('.nx-badge');
            expect(badgeElement?.getAttribute('aria-label')).toBe('Badge: New');
        });

        it('should provide appropriate ARIA label for dot badge', () => {
            fixture.componentRef.setInput('dot', true);
            fixture.componentRef.setInput('status', 'success');
            fixture.detectChanges();

            const badgeElement = fixture.nativeElement.querySelector('.nx-badge');
            expect(badgeElement?.getAttribute('aria-label')).toBe('Status: success');
        });

        it('should not have accessibility violations', async () => {
            fixture.componentRef.setInput('content', 'Accessible Badge');
            fixture.detectChanges();

            const axeResults = await axe(fixture.nativeElement);
            expect(axeResults).toHaveNoViolations();
        });
    });

    describe('Public API', () => {
        it('should return correct context', () => {
            fixture.componentRef.setInput('content', 'Test');
            fixture.componentRef.setInput('status', 'warning');
            fixture.componentRef.setInput('dot', false);
            fixture.componentRef.setInput('count', 10);
            fixture.detectChanges();

            const context = component.getContext();
            expect(context.displayText).toBe('10');
            expect(context.isDot).toBe(false);
            expect(context.isCount).toBe(true);
            expect(context.status).toBe('warning');
        });

        it('should get badge element', () => {
            fixture.componentRef.setInput('content', 'Test');
            fixture.detectChanges();

            const badgeElement = component.getBadgeElement();
            expect(badgeElement).toBeTruthy();
            expect(badgeElement?.className).toContain('nx-badge');
        });

        it('should return null for badge element when no content', () => {
            fixture.componentRef.setInput('content', undefined);
            fixture.componentRef.setInput('count', undefined);
            fixture.componentRef.setInput('dot', false);
            fixture.detectChanges();

            const badgeElement = component.getBadgeElement();
            expect(badgeElement).toBeNull();
        });
    });

    describe('Content Wrapping', () => {
        it('should wrap content properly', () => {
            fixture.componentRef.setInput('content', 'Badge');
            fixture.detectChanges();

            const wrapper = fixture.nativeElement.querySelector('.nx-badge-wrapper');
            const badge = fixture.nativeElement.querySelector('.nx-badge');
            const content = fixture.nativeElement.textContent.trim();

            expect(wrapper).toBeTruthy();
            expect(badge).toBeTruthy();
            expect(content).toContain('Badge');
        });
    });
});