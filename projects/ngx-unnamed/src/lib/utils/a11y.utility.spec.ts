import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { A11yUtility } from './a11y.utility';

describe('A11yUtility', () => {
    let service: A11yUtility;
    let testElement: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [A11yUtility],
        });
        service = TestBed.inject(A11yUtility);
        testElement = document.createElement('div');
        document.body.appendChild(testElement);
    });

    afterEach(() => {
        document.body.removeChild(testElement);
        service.cleanup();
    });

    describe('initialization', () => {
        it('should create service', () => {
            expect(service).toBeTruthy();
        });
    });

    describe('generateUniqueId', () => {
        it('should generate unique IDs', () => {
            const id1 = service.generateUniqueId();
            const id2 = service.generateUniqueId();
            const id3 = service.generateUniqueId();

            expect(id1).not.toBe(id2);
            expect(id2).not.toBe(id3);
            expect(id1).not.toBe(id3);
        });

        it('should use default prefix "nx"', () => {
            const id = service.generateUniqueId();
            expect(id).toMatch(/^nx-\d+$/);
        });

        it('should use custom prefix', () => {
            const id = service.generateUniqueId('custom');
            expect(id).toMatch(/^custom-\d+$/);
        });

        it('should generate incrementing IDs', () => {
            const id1 = service.generateUniqueId('test');
            const id2 = service.generateUniqueId('test');

            const num1 = parseInt(id1.split('-')[1]);
            const num2 = parseInt(id2.split('-')[1]);

            expect(num2).toBeGreaterThan(num1);
        });
    });

    describe('setAriaDescribedBy', () => {
        it('should set aria-describedby with string', () => {
            service.setAriaDescribedBy(testElement, 'id1 id2');
            expect(testElement.getAttribute('aria-describedby')).toBe('id1 id2');
        });

        it('should set aria-describedby with array', () => {
            service.setAriaDescribedBy(testElement, ['id1', 'id2']);
            expect(testElement.getAttribute('aria-describedby')).toBe('id1 id2');
        });

        it('should trim whitespace', () => {
            service.setAriaDescribedBy(testElement, '  id1  id2  ');
            expect(testElement.getAttribute('aria-describedby')).toBe('id1  id2');
        });

        it('should remove attribute when empty string', () => {
            testElement.setAttribute('aria-describedby', 'test');
            service.setAriaDescribedBy(testElement, '');
            expect(testElement.hasAttribute('aria-describedby')).toBe(false);
        });

        it('should remove attribute when empty array', () => {
            testElement.setAttribute('aria-describedby', 'test');
            service.setAriaDescribedBy(testElement, []);
            expect(testElement.hasAttribute('aria-describedby')).toBe(false);
        });

        it('should handle single ID', () => {
            service.setAriaDescribedBy(testElement, 'single-id');
            expect(testElement.getAttribute('aria-describedby')).toBe('single-id');
        });
    });

    describe('setAriaLabelledBy', () => {
        it('should set aria-labelledby with string', () => {
            service.setAriaLabelledBy(testElement, 'label1');
            expect(testElement.getAttribute('aria-labelledby')).toBe('label1');
        });

        it('should set aria-labelledby with array', () => {
            service.setAriaLabelledBy(testElement, ['label1', 'label2']);
            expect(testElement.getAttribute('aria-labelledby')).toBe('label1 label2');
        });

        it('should remove attribute when empty', () => {
            testElement.setAttribute('aria-labelledby', 'test');
            service.setAriaLabelledBy(testElement, '');
            expect(testElement.hasAttribute('aria-labelledby')).toBe(false);
        });

        it('should trim whitespace', () => {
            service.setAriaLabelledBy(testElement, '  label1  ');
            expect(testElement.getAttribute('aria-labelledby')).toBe('label1');
        });
    });

    describe('setAriaLabel', () => {
        it('should set aria-label', () => {
            service.setAriaLabel(testElement, 'Close button');
            expect(testElement.getAttribute('aria-label')).toBe('Close button');
        });

        it('should remove attribute when null', () => {
            testElement.setAttribute('aria-label', 'test');
            service.setAriaLabel(testElement, null);
            expect(testElement.hasAttribute('aria-label')).toBe(false);
        });

        it('should handle empty string', () => {
            testElement.setAttribute('aria-label', 'test');
            service.setAriaLabel(testElement, '');
            expect(testElement.hasAttribute('aria-label')).toBe(false);
        });

        it('should update existing label', () => {
            service.setAriaLabel(testElement, 'First label');
            service.setAriaLabel(testElement, 'Second label');
            expect(testElement.getAttribute('aria-label')).toBe('Second label');
        });
    });

    describe('setAriaExpanded', () => {
        it('should set aria-expanded to true', () => {
            service.setAriaExpanded(testElement, true);
            expect(testElement.getAttribute('aria-expanded')).toBe('true');
        });

        it('should set aria-expanded to false', () => {
            service.setAriaExpanded(testElement, false);
            expect(testElement.getAttribute('aria-expanded')).toBe('false');
        });

        it('should toggle aria-expanded', () => {
            service.setAriaExpanded(testElement, true);
            expect(testElement.getAttribute('aria-expanded')).toBe('true');
            service.setAriaExpanded(testElement, false);
            expect(testElement.getAttribute('aria-expanded')).toBe('false');
        });
    });

    describe('setAriaHidden', () => {
        it('should set aria-hidden to true', () => {
            service.setAriaHidden(testElement, true);
            expect(testElement.getAttribute('aria-hidden')).toBe('true');
        });

        it('should remove aria-hidden when false', () => {
            testElement.setAttribute('aria-hidden', 'true');
            service.setAriaHidden(testElement, false);
            expect(testElement.hasAttribute('aria-hidden')).toBe(false);
        });

        it('should toggle aria-hidden', () => {
            service.setAriaHidden(testElement, true);
            expect(testElement.hasAttribute('aria-hidden')).toBe(true);
            service.setAriaHidden(testElement, false);
            expect(testElement.hasAttribute('aria-hidden')).toBe(false);
        });
    });

    describe('keyboard event helpers', () => {
        describe('isEscape', () => {
            it('should detect Escape key', () => {
                const event = new KeyboardEvent('keydown', { key: 'Escape' });
                expect(service.isEscape(event)).toBe(true);
            });

            it('should detect Esc key (legacy)', () => {
                const event = new KeyboardEvent('keydown', { key: 'Esc' });
                expect(service.isEscape(event)).toBe(true);
            });

            it('should return false for other keys', () => {
                const event = new KeyboardEvent('keydown', { key: 'Enter' });
                expect(service.isEscape(event)).toBe(false);
            });
        });

        describe('isEnter', () => {
            it('should detect Enter key', () => {
                const event = new KeyboardEvent('keydown', { key: 'Enter' });
                expect(service.isEnter(event)).toBe(true);
            });

            it('should return false for other keys', () => {
                const event = new KeyboardEvent('keydown', { key: 'Space' });
                expect(service.isEnter(event)).toBe(false);
            });
        });

        describe('isSpace', () => {
            it('should detect Space key', () => {
                const event = new KeyboardEvent('keydown', { key: ' ' });
                expect(service.isSpace(event)).toBe(true);
            });

            it('should detect Spacebar key (legacy)', () => {
                const event = new KeyboardEvent('keydown', { key: 'Spacebar' });
                expect(service.isSpace(event)).toBe(true);
            });

            it('should return false for other keys', () => {
                const event = new KeyboardEvent('keydown', { key: 'Enter' });
                expect(service.isSpace(event)).toBe(false);
            });
        });

        describe('isArrowKey', () => {
            it('should detect ArrowUp', () => {
                const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
                expect(service.isArrowKey(event)).toBe(true);
            });

            it('should detect ArrowDown', () => {
                const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
                expect(service.isArrowKey(event)).toBe(true);
            });

            it('should detect ArrowLeft', () => {
                const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
                expect(service.isArrowKey(event)).toBe(true);
            });

            it('should detect ArrowRight', () => {
                const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
                expect(service.isArrowKey(event)).toBe(true);
            });

            it('should detect legacy arrow keys', () => {
                expect(service.isArrowKey(new KeyboardEvent('keydown', { key: 'Up' }))).toBe(true);
                expect(service.isArrowKey(new KeyboardEvent('keydown', { key: 'Down' }))).toBe(true);
                expect(service.isArrowKey(new KeyboardEvent('keydown', { key: 'Left' }))).toBe(true);
                expect(service.isArrowKey(new KeyboardEvent('keydown', { key: 'Right' }))).toBe(true);
            });

            it('should return false for other keys', () => {
                const event = new KeyboardEvent('keydown', { key: 'Enter' });
                expect(service.isArrowKey(event)).toBe(false);
            });
        });

        describe('isArrowUp', () => {
            it('should detect ArrowUp', () => {
                const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
                expect(service.isArrowUp(event)).toBe(true);
            });

            it('should detect Up (legacy)', () => {
                const event = new KeyboardEvent('keydown', { key: 'Up' });
                expect(service.isArrowUp(event)).toBe(true);
            });

            it('should return false for other arrow keys', () => {
                expect(service.isArrowUp(new KeyboardEvent('keydown', { key: 'ArrowDown' }))).toBe(false);
            });
        });

        describe('isArrowDown', () => {
            it('should detect ArrowDown', () => {
                const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
                expect(service.isArrowDown(event)).toBe(true);
            });

            it('should detect Down (legacy)', () => {
                const event = new KeyboardEvent('keydown', { key: 'Down' });
                expect(service.isArrowDown(event)).toBe(true);
            });
        });

        describe('isArrowLeft', () => {
            it('should detect ArrowLeft', () => {
                const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
                expect(service.isArrowLeft(event)).toBe(true);
            });

            it('should detect Left (legacy)', () => {
                const event = new KeyboardEvent('keydown', { key: 'Left' });
                expect(service.isArrowLeft(event)).toBe(true);
            });
        });

        describe('isArrowRight', () => {
            it('should detect ArrowRight', () => {
                const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
                expect(service.isArrowRight(event)).toBe(true);
            });

            it('should detect Right (legacy)', () => {
                const event = new KeyboardEvent('keydown', { key: 'Right' });
                expect(service.isArrowRight(event)).toBe(true);
            });
        });

        describe('isTab', () => {
            it('should detect Tab key', () => {
                const event = new KeyboardEvent('keydown', { key: 'Tab' });
                expect(service.isTab(event)).toBe(true);
            });

            it('should return false for other keys', () => {
                const event = new KeyboardEvent('keydown', { key: 'Enter' });
                expect(service.isTab(event)).toBe(false);
            });
        });
    });

    describe('getFocusableElements', () => {
        it('should find focusable elements', () => {
            testElement.innerHTML = `
                <button>Button 1</button>
                <a href="#">Link</a>
                <input type="text" />
                <button>Button 2</button>
            `;

            const focusable = service.getFocusableElements(testElement);
            expect(focusable.length).toBe(4);
        });

        it('should exclude disabled elements', () => {
            testElement.innerHTML = `
                <button>Enabled</button>
                <button disabled>Disabled</button>
                <input type="text" />
                <input type="text" disabled />
            `;

            const focusable = service.getFocusableElements(testElement);
            expect(focusable.length).toBe(2);
        });

        it('should include elements with tabindex', () => {
            testElement.innerHTML = `
                <div tabindex="0">Focusable div</div>
                <span tabindex="0">Focusable span</span>
            `;

            const focusable = service.getFocusableElements(testElement);
            expect(focusable.length).toBe(2);
        });

        it('should exclude elements with tabindex="-1"', () => {
            testElement.innerHTML = `
                <div tabindex="0">Included</div>
                <div tabindex="-1">Excluded</div>
            `;

            const focusable = service.getFocusableElements(testElement);
            expect(focusable.length).toBe(1);
        });

        it('should include select and textarea', () => {
            testElement.innerHTML = `
                <select><option>Option</option></select>
                <textarea></textarea>
            `;

            const focusable = service.getFocusableElements(testElement);
            expect(focusable.length).toBe(2);
        });

        it('should include contenteditable elements', () => {
            testElement.innerHTML = `
                <div contenteditable="true">Editable</div>
            `;

            const focusable = service.getFocusableElements(testElement);
            expect(focusable.length).toBe(1);
        });

        it('should return empty array when no focusable elements', () => {
            testElement.innerHTML = `
                <div>Not focusable</div>
                <span>Also not focusable</span>
            `;

            const focusable = service.getFocusableElements(testElement);
            expect(focusable.length).toBe(0);
        });
    });

    describe('createFocusTrap', () => {
        it('should create focus trap', () => {
            testElement.innerHTML = `
                <button id="first">First</button>
                <button id="second">Second</button>
                <button id="last">Last</button>
            `;

            const cleanup = service.createFocusTrap(testElement);
            expect(cleanup).toBeInstanceOf(Function);
            cleanup();
        });

        it('should focus first element on creation', () => {
            testElement.innerHTML = `
                <button id="first">First</button>
                <button id="last">Last</button>
            `;

            service.createFocusTrap(testElement);
            expect(document.activeElement?.id).toBe('first');
        });

        it('should trap tab at end', () => {
            testElement.innerHTML = `
                <button id="first">First</button>
                <button id="last">Last</button>
            `;

            service.createFocusTrap(testElement);

            const lastButton = document.getElementById('last')!;
            lastButton.focus();

            const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
            Object.defineProperty(tabEvent, 'shiftKey', { value: false });

            testElement.dispatchEvent(tabEvent);

            // After cleanup, we can't reliably test focus change in jsdom
            // but we can verify the event was handled
            expect(tabEvent.defaultPrevented).toBe(true);
        });

        it('should trap shift+tab at beginning', () => {
            testElement.innerHTML = `
                <button id="first">First</button>
                <button id="last">Last</button>
            `;

            service.createFocusTrap(testElement);

            const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true });
            testElement.dispatchEvent(tabEvent);

            expect(tabEvent.defaultPrevented).toBe(true);
        });

        it('should not trap other keys', () => {
            testElement.innerHTML = `
                <button id="first">First</button>
                <button id="last">Last</button>
            `;

            service.createFocusTrap(testElement);

            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
            testElement.dispatchEvent(enterEvent);

            expect(enterEvent.defaultPrevented).toBe(false);
        });

        it('should cleanup properly', () => {
            testElement.innerHTML = `
                <button id="first">First</button>
                <button id="last">Last</button>
            `;

            const cleanup = service.createFocusTrap(testElement);
            cleanup();

            const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
            testElement.dispatchEvent(tabEvent);

            // After cleanup, event should not be prevented
            expect(tabEvent.defaultPrevented).toBe(false);
        });

        it('should handle no focusable elements', () => {
            testElement.innerHTML = '<div>No focusable elements</div>';

            const cleanup = service.createFocusTrap(testElement);
            expect(cleanup).toBeInstanceOf(Function);
            expect(() => cleanup()).not.toThrow();
        });
    });

    describe('announce', () => {
        it('should create live region on first announcement', fakeAsync(() => {
            service.announce('Test message');
            tick();

            const liveRegion = document.querySelector('[role="status"]');
            expect(liveRegion).toBeTruthy();
        }));

        it('should announce with polite politeness by default', fakeAsync(() => {
            service.announce('Test message');
            tick();

            const liveRegion = document.querySelector('[role="status"]') as HTMLElement;
            expect(liveRegion?.getAttribute('aria-live')).toBe('polite');
            expect(liveRegion?.textContent).toBe('Test message');
        }));

        it('should announce with assertive politeness', fakeAsync(() => {
            service.announce('Urgent message', 'assertive');
            tick();

            const liveRegion = document.querySelector('[role="status"]') as HTMLElement;
            expect(liveRegion?.getAttribute('aria-live')).toBe('assertive');
        }));

        it('should clear message after duration', fakeAsync(() => {
            service.announce('Temporary message', 'polite', 1000);
            tick();

            const liveRegion = document.querySelector('[role="status"]') as HTMLElement;
            expect(liveRegion?.textContent).toBe('Temporary message');

            tick(1000);
            expect(liveRegion?.textContent).toBe('');
        }));

        it('should not clear message when duration is 0', fakeAsync(() => {
            service.announce('Permanent message', 'polite', 0);
            tick();

            const liveRegion = document.querySelector('[role="status"]') as HTMLElement;
            expect(liveRegion?.textContent).toBe('Permanent message');

            tick(10000);
            expect(liveRegion?.textContent).toBe('Permanent message');
        }));

        it('should handle multiple announcements', fakeAsync(() => {
            service.announce('First message');
            tick();

            service.announce('Second message');
            tick();

            const liveRegion = document.querySelector('[role="status"]') as HTMLElement;
            expect(liveRegion?.textContent).toBe('Second message');
        }));

        it('should handle off politeness', fakeAsync(() => {
            service.announce('Test', 'off');
            tick();

            const liveRegion = document.querySelector('[role="status"]') as HTMLElement;
            expect(liveRegion?.getAttribute('aria-live')).toBe('off');
        }));
    });

    describe('cleanup', () => {
        it('should remove live region element', fakeAsync(() => {
            service.announce('Test message');
            tick();

            expect(document.querySelector('[role="status"]')).toBeTruthy();

            service.cleanup();
            expect(document.querySelector('[role="status"]')).toBeFalsy();
        }));

        it('should not throw when called multiple times', () => {
            service.cleanup();
            expect(() => service.cleanup()).not.toThrow();
        });

        it('should not throw when called before any announcement', () => {
            expect(() => service.cleanup()).not.toThrow();
        });
    });
});
