import { ComponentFixture, TestBed } from '@angular/core/testing';
import { axe, toHaveNoViolations } from 'jasmine-axe';

import { TagComponent } from './tag.component';
import { NxTagMode, NxTagColor, NxTagSize } from './tag.types';

describe('TagComponent', () => {
    let component: TagComponent;
    let fixture: ComponentFixture<TagComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TagComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TagComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('content', 'Test Tag');
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Basic Tag', () => {
        it('should display content', () => {
            fixture.componentRef.setInput('content', 'Sample Tag');
            fixture.detectChanges();

            const contentElement = fixture.nativeElement.querySelector('.nx-tag-content');
            expect(contentElement?.textContent?.trim()).toBe('Sample Tag');
        });

        it('should apply default color class', () => {
            fixture.componentRef.setInput('color', 'default');
            fixture.detectChanges();

            const tagElement = fixture.nativeElement.querySelector('.nx-tag');
            expect(tagElement).toHaveClass('nx-tag-default');
        });

        it('should apply default size class', () => {
            fixture.componentRef.setInput('size', 'default');
            fixture.detectChanges();

            const tagElement = fixture.nativeElement.querySelector('.nx-tag');
            expect(tagElement).toHaveClass('nx-tag-default');
        });
    });

    describe('Color Variants', () => {
        const colors: NxTagColor[] = ['default', 'success', 'error', 'warning', 'info', 'processing'];

        colors.forEach(color => {
            it(`should apply ${color} color class`, () => {
                fixture.componentRef.setInput('color', color);
                fixture.detectChanges();

                const tagElement = fixture.nativeElement.querySelector('.nx-tag');
                expect(tagElement).toHaveClass(`nx-tag-${color}`);
            });
        });
    });

    describe('Size Variants', () => {
        it('should apply small size class', () => {
            fixture.componentRef.setInput('size', 'small');
            fixture.detectChanges();

            const tagElement = fixture.nativeElement.querySelector('.nx-tag');
            expect(tagElement).toHaveClass('nx-tag-small');
        });

        it('should apply default size class', () => {
            fixture.componentRef.setInput('size', 'default');
            fixture.detectChanges();

            const tagElement = fixture.nativeElement.querySelector('.nx-tag');
            expect(tagElement).toHaveClass('nx-tag-default');
        });
    });

    describe('Mode Variants', () => {
        it('should apply checkable mode class', () => {
            fixture.componentRef.setInput('mode', 'checkable');
            fixture.detectChanges();

            const tagElement = fixture.nativeElement.querySelector('.nx-tag');
            expect(tagElement).toHaveClass('nx-tag-checkable');

            const checkmark = fixture.nativeElement.querySelector('.nx-tag-checkmark');
            expect(checkmark).toBeTruthy();
        });

        it('should apply closeable mode class', () => {
            fixture.componentRef.setInput('mode', 'closeable');
            fixture.detectChanges();

            const tagElement = fixture.nativeElement.querySelector('.nx-tag');
            expect(tagElement).toHaveClass('nx-tag-closeable');

            const closeIcon = fixture.nativeElement.querySelector('.nx-tag-close-icon');
            expect(closeIcon).toBeTruthy();
        });

        it('should apply closable class when closable is true', () => {
            fixture.componentRef.setInput('closable', true);
            fixture.detectChanges();

            const tagElement = fixture.nativeElement.querySelector('.nx-tag');
            expect(tagElement).toHaveClass('nx-tag-closeable');

            const closeIcon = fixture.nativeElement.querySelector('.nx-tag-close-icon');
            expect(closeIcon).toBeTruthy();
        });
    });

    describe('Selection States', () => {
        it('should show as selected when selected is true', () => {
            fixture.componentRef.setInput('mode', 'checkable');
            fixture.componentRef.setInput('selected', true);
            fixture.detectChanges();

            const tagElement = fixture.nativeElement.querySelector('.nx-tag');
            expect(tagElement).toHaveClass('nx-tag-checked');
        });

        it('should show as checked when checked is true', () => {
            fixture.componentRef.setInput('mode', 'checkable');
            fixture.componentRef.setInput('checked', true);
            fixture.detectChanges();

            const tagElement = fixture.nativeElement.querySelector('.nx-tag');
            expect(tagElement).toHaveClass('nx-tag-checked');
        });

        it('should toggle selection on click in checkable mode', () => {
            fixture.componentRef.setInput('mode', 'checkable');
            fixture.componentRef.setInput('checked', false);
            fixture.detectChanges();

            let changeEmitted = false;
            component.change.subscribe(() => {
                changeEmitted = true;
            });

            const tagElement = fixture.nativeElement.querySelector('.nx-tag');
            tagElement?.click();

            expect(changeEmitted).toBe(true);
            expect(component.isChecked()).toBe(true);
        });

        it('should not toggle selection on click when disabled', () => {
            fixture.componentRef.setInput('mode', 'checkable');
            fixture.componentRef.setInput('disabled', true);
            fixture.componentRef.setInput('checked', false);
            fixture.detectChanges();

            let changeEmitted = false;
            component.change.subscribe(() => {
                changeEmitted = true;
            });

            const tagElement = fixture.nativeElement.querySelector('.nx-tag');
            tagElement?.click();

            expect(changeEmitted).toBe(false);
            expect(component.isChecked()).toBe(false);
        });
    });

    describe('Disabled State', () => {
        it('should apply disabled class when disabled is true', () => {
            fixture.componentRef.setInput('disabled', true);
            fixture.detectChanges();

            const tagElement = fixture.nativeElement.querySelector('.nx-tag');
            expect(tagElement).toHaveClass('nx-tag-disabled');
        });

        it('should have correct ARIA attributes when disabled', () => {
            fixture.componentRef.setInput('disabled', true);
            fixture.detectChanges();

            const tagElement = fixture.nativeElement.querySelector('.nx-tag');
            expect(tagElement?.getAttribute('aria-disabled')).toBe('true');
            expect(tagElement?.getAttribute('tabindex')).toBe('-1');
        });

        it('should not emit click events when disabled', () => {
            fixture.componentRef.setInput('disabled', true);
            fixture.detectChanges();

            let clickEmitted = false;
            component.click.subscribe(() => {
                clickEmitted = true;
            });

            const tagElement = fixture.nativeElement.querySelector('.nx-tag');
            tagElement?.click();

            expect(clickEmitted).toBe(false);
        });
    });

    describe('Custom Icons', () => {
        it('should use custom close icon', () => {
            fixture.componentRef.setInput('mode', 'closeable');
            fixture.componentRef.setInput('closeIcon', 'close-circle');
            fixture.detectChanges();

            const closeIcon = fixture.nativeElement.querySelector('.nx-tag-close-icon nx-icon');
            expect(closeIcon?.getAttribute('type')).toBe('close-circle');
        });

        it('should use custom check icon', () => {
            fixture.componentRef.setInput('mode', 'checkable');
            fixture.componentRef.setInput('checkIcon', 'tick');
            fixture.detectChanges();

            const checkIcon = fixture.nativeElement.querySelector('.nx-tag-checkmark nx-icon');
            expect(checkIcon?.getAttribute('type')).toBe('tick');
        });
    });

    describe('Custom Classes and Styles', () => {
        it('should apply custom CSS class', () => {
            fixture.componentRef.setInput('className', 'custom-tag another-class');
            fixture.detectChanges();

            const tagElement = fixture.nativeElement.querySelector('.nx-tag');
            expect(tagElement).toHaveClass('custom-tag');
            expect(tagElement).toHaveClass('another-class');
        });

        it('should apply custom styles', () => {
            fixture.componentRef.setInput('style', { 'font-weight': 'bold', 'text-transform': 'uppercase' });
            fixture.detectChanges();

            const tagElement = fixture.nativeElement.querySelector('.nx-tag');
            expect(tagElement.style.fontWeight).toBe('bold');
            expect(tagElement.style.textTransform).toBe('uppercase');
        });
    });

    describe('Event Emission', () => {
        it('should emit click event', () => {
            let clickEvent: any;
            component.click.subscribe((event) => {
                clickEvent = event;
            });

            const tagElement = fixture.nativeElement.querySelector('.nx-tag');
            tagElement?.click();

            expect(clickEvent).toBeDefined();
            expect(clickEvent.content).toBe('Test Tag');
            expect(clickEvent.selected).toBe(false);
        });

        it('should emit close event', () => {
            fixture.componentRef.setInput('mode', 'closeable');
            fixture.detectChanges();

            let closeEvent: any;
            component.close.subscribe((event) => {
                closeEvent = event;
            });

            const closeIcon = fixture.nativeElement.querySelector('.nx-tag-close-icon');
            closeIcon?.click();

            expect(closeEvent).toBeDefined();
            expect(closeEvent.content).toBe('Test Tag');
        });

        it('should emit change event in checkable mode', () => {
            fixture.componentRef.setInput('mode', 'checkable');
            fixture.detectChanges();

            let changeEvent: any;
            component.change.subscribe((event) => {
                changeEvent = event;
            });

            const tagElement = fixture.nativeElement.querySelector('.nx-tag');
            tagElement?.click();

            expect(changeEvent).toBeDefined();
            expect(changeEvent.content).toBe('Test Tag');
            expect(changeEvent.checked).toBe(true);
        });
    });

    describe('Keyboard Navigation', () => {
        it('should toggle selection on Enter key', () => {
            fixture.componentRef.setInput('mode', 'checkable');
            fixture.componentRef.setInput('checked', false);
            fixture.detectChanges();

            const tagElement = fixture.nativeElement.querySelector('.nx-tag');
            const keyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
            tagElement?.dispatchEvent(keyboardEvent);

            expect(component.isChecked()).toBe(true);
        });

        it('should toggle selection on Space key', () => {
            fixture.componentRef.setInput('mode', 'checkable');
            fixture.componentRef.setInput('checked', false);
            fixture.detectChanges();

            const tagElement = fixture.nativeElement.querySelector('.nx-tag');
            const keyboardEvent = new KeyboardEvent('keydown', { key: ' ' });
            tagElement?.dispatchEvent(keyboardEvent);

            expect(component.isChecked()).toBe(true);
        });

        it('should close on Delete key for closeable tags', () => {
            fixture.componentRef.setInput('mode', 'closeable');
            fixture.detectChanges();

            let closeEvent: any;
            component.close.subscribe((event) => {
                closeEvent = event;
            });

            const tagElement = fixture.nativeElement.querySelector('.nx-tag');
            const keyboardEvent = new KeyboardEvent('keydown', { key: 'Delete' });
            tagElement?.dispatchEvent(keyboardEvent);

            expect(closeEvent).toBeDefined();
        });

        it('should close on Backspace key for closeable tags', () => {
            fixture.componentRef.setInput('mode', 'closeable');
            fixture.detectChanges();

            let closeEvent: any;
            component.close.subscribe((event) => {
                closeEvent = event;
            });

            const tagElement = fixture.nativeElement.querySelector('.nx-tag');
            const keyboardEvent = new KeyboardEvent('keydown', { key: 'Backspace' });
            tagElement?.dispatchEvent(keyboardEvent);

            expect(closeEvent).toBeDefined();
        });
    });

    describe('Accessibility', () => {
        it('should have proper ARIA attributes', () => {
            fixture.componentRef.setInput('mode', 'checkable');
            fixture.componentRef.setInput('checked', false);
            fixture.detectChanges();

            const tagElement = fixture.nativeElement.querySelector('.nx-tag');
            expect(tagElement?.getAttribute('role')).toBe('option');
            expect(tagElement?.getAttribute('aria-selected')).toBe('false');
            expect(tagElement?.getAttribute('tabindex')).toBe('0');
        });

        it('should have correct ARIA selected state', () => {
            fixture.componentRef.setInput('mode', 'checkable');
            fixture.componentRef.setInput('checked', true);
            fixture.detectChanges();

            const tagElement = fixture.nativeElement.querySelector('.nx-tag');
            expect(tagElement?.getAttribute('aria-selected')).toBe('true');
        });

        it('should provide appropriate ARIA label for close icon', () => {
            fixture.componentRef.setInput('mode', 'closeable');
            fixture.componentRef.setInput('content', 'Sample');
            fixture.detectChanges();

            const closeIcon = fixture.nativeElement.querySelector('.nx-tag-close-icon');
            expect(closeIcon?.getAttribute('aria-label')).toBe('Remove Sample tag');
        });

        it('should not have accessibility violations', async () => {
            fixture.componentRef.setInput('content', 'Accessible Tag');
            fixture.detectChanges();

            const axeResults = await axe(fixture.nativeElement);
            expect(axeResults).toHaveNoViolations();
        });
    });

    describe('Public API', () => {
        it('should return correct context', () => {
            fixture.componentRef.setInput('content', 'Test Tag');
            fixture.componentRef.setInput('mode', 'checkable');
            fixture.componentRef.setInput('selected', true);
            fixture.componentRef.setInput('color', 'success');
            fixture.componentRef.setInput('value', 'tag-value');
            fixture.detectChanges();

            const context = component.getContext();
            expect(context.content).toBe('Test Tag');
            expect(context.mode).toBe('checkable');
            expect(context.isSelected).toBe(true);
            expect(context.isDisabled).toBe(false);
            expect(context.color).toBe('success');
            expect(context.value).toBe('tag-value');
        });

        it('should select tag', () => {
            fixture.componentRef.setInput('mode', 'checkable');
            fixture.componentRef.setInput('checked', false);
            fixture.detectChanges();

            component.select();
            expect(component.isChecked()).toBe(true);
        });

        it('should deselect tag', () => {
            fixture.componentRef.setInput('mode', 'checkable');
            fixture.componentRef.setInput('checked', true);
            fixture.detectChanges();

            component.deselect();
            expect(component.isChecked()).toBe(false);
        });

        it('should toggle tag', () => {
            fixture.componentRef.setInput('mode', 'checkable');
            fixture.componentRef.setInput('checked', false);
            fixture.detectChanges();

            component.toggle();
            expect(component.isChecked()).toBe(true);

            component.toggle();
            expect(component.isChecked()).toBe(false);
        });

        it('should not toggle when disabled', () => {
            fixture.componentRef.setInput('mode', 'checkable');
            fixture.componentRef.setInput('disabled', true);
            fixture.componentRef.setInput('checked', false);
            fixture.detectChanges();

            component.toggle();
            expect(component.isChecked()).toBe(false);
        });

        it('should return checked status', () => {
            fixture.componentRef.setInput('mode', 'checkable');
            fixture.componentRef.setInput('checked', true);
            fixture.detectChanges();

            expect(component.isChecked()).toBe(true);
        });
    });

    describe('Value Support', () => {
        it('should handle custom value', () => {
            fixture.componentRef.setInput('value', { id: 1, name: 'test' });
            fixture.detectChanges();

            const context = component.getContext();
            expect(context.value).toEqual({ id: 1, name: 'test' });
        });
    });
});