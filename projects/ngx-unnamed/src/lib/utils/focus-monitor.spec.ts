import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { FocusMonitor, FocusOrigin } from './focus-monitor';

describe('FocusMonitor', () => {
    let service: FocusMonitor;
    let testElement: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [FocusMonitor],
        });
        service = TestBed.inject(FocusMonitor);
        testElement = document.createElement('button');
        testElement.tabIndex = 0;
        document.body.appendChild(testElement);
    });

    afterEach(() => {
        document.body.removeChild(testElement);
        service.ngOnDestroy();
    });

    describe('initialization', () => {
        it('should create service', () => {
            expect(service).toBeTruthy();
        });
    });

    describe('monitor', () => {
        it('should monitor focus on HTMLElement', fakeAsync(() => {
            const origins: (FocusOrigin | undefined)[] = [];
            service.monitor(testElement).subscribe((origin) => origins.push(origin));

            testElement.focus();
            tick();

            expect(origins.length).toBeGreaterThan(0);
        }));

        it('should monitor focus on ElementRef', fakeAsync(() => {
            const elementRef = new ElementRef(testElement);
            const origins: (FocusOrigin | undefined)[] = [];
            service.monitor(elementRef).subscribe((origin) => origins.push(origin));

            testElement.focus();
            tick();

            expect(origins.length).toBeGreaterThan(0);
        }));

        it('should emit focus origin when element receives focus', fakeAsync(() => {
            const origins: (FocusOrigin | undefined)[] = [];
            service.monitor(testElement).subscribe((origin) => origins.push(origin));

            testElement.focus();
            tick();

            expect(origins).toContain('program');
        }));

        it('should emit null when element loses focus', fakeAsync(() => {
            const origins: (FocusOrigin | undefined)[] = [];
            service.monitor(testElement).subscribe((origin) => origins.push(origin));

            testElement.focus();
            tick();
            testElement.blur();
            tick();

            expect(origins[origins.length - 1]).toBeNull();
        }));

        it('should return same observable for same element', () => {
            const obs1 = service.monitor(testElement);
            const obs2 = service.monitor(testElement);

            // Observables should be from the same source
            expect(obs1).toBe(obs2);
        });

        it('should handle multiple subscribers', fakeAsync(() => {
            const origins1: (FocusOrigin | undefined)[] = [];
            const origins2: (FocusOrigin | undefined)[] = [];

            service.monitor(testElement).subscribe((origin) => origins1.push(origin));
            service.monitor(testElement).subscribe((origin) => origins2.push(origin));

            testElement.focus();
            tick();

            expect(origins1.length).toBeGreaterThan(0);
            expect(origins2.length).toBeGreaterThan(0);
        }));
    });

    describe('stopMonitoring', () => {
        it('should stop monitoring an element', fakeAsync(() => {
            const origins: (FocusOrigin | undefined)[] = [];
            service.monitor(testElement).subscribe((origin) => origins.push(origin));

            service.stopMonitoring(testElement);

            testElement.focus();
            tick();
            testElement.blur();
            tick();

            // No new origins should be recorded after stopMonitoring
            expect(origins.length).toBe(0);
        }));

        it('should complete the observable when stopped', fakeAsync(() => {
            let completed = false;
            service.monitor(testElement).subscribe({
                complete: () => (completed = true),
            });

            service.stopMonitoring(testElement);
            tick();

            expect(completed).toBe(true);
        }));

        it('should handle stopping non-monitored element', () => {
            const otherElement = document.createElement('div');
            expect(() => service.stopMonitoring(otherElement)).not.toThrow();
        });

        it('should work with ElementRef', fakeAsync(() => {
            const elementRef = new ElementRef(testElement);
            service.monitor(elementRef);
            service.stopMonitoring(elementRef);
            tick();

            expect(service.getFocusOrigin(elementRef)).toBeNull();
        }));
    });

    describe('focusVia', () => {
        it('should focus element with keyboard origin', fakeAsync(() => {
            const origins: (FocusOrigin | undefined)[] = [];
            service.monitor(testElement).subscribe((origin) => origins.push(origin));

            service.focusVia(testElement, 'keyboard');
            tick();

            expect(document.activeElement).toBe(testElement);
            expect(origins).toContain('keyboard');
        }));

        it('should focus element with mouse origin', fakeAsync(() => {
            const origins: (FocusOrigin | undefined)[] = [];
            service.monitor(testElement).subscribe((origin) => origins.push(origin));

            service.focusVia(testElement, 'mouse');
            tick();

            expect(document.activeElement).toBe(testElement);
            expect(origins).toContain('mouse');
        }));

        it('should focus element with touch origin', fakeAsync(() => {
            const origins: (FocusOrigin | undefined)[] = [];
            service.monitor(testElement).subscribe((origin) => origins.push(origin));

            service.focusVia(testElement, 'touch');
            tick();

            expect(document.activeElement).toBe(testElement);
            expect(origins).toContain('touch');
        }));

        it('should focus element with program origin', fakeAsync(() => {
            const origins: (FocusOrigin | undefined)[] = [];
            service.monitor(testElement).subscribe((origin) => origins.push(origin));

            service.focusVia(testElement, 'program');
            tick();

            expect(document.activeElement).toBe(testElement);
            expect(origins).toContain('program');
        }));

        it('should handle null origin', fakeAsync(() => {
            service.focusVia(testElement, null);
            tick();

            expect(document.activeElement).toBe(testElement);
        }));
    });

    describe('isFocusWithin', () => {
        it('should return true when element is focused', () => {
            testElement.focus();
            expect(service.isFocusWithin(testElement)).toBe(true);
        });

        it('should return false when element is not focused', () => {
            expect(service.isFocusWithin(testElement)).toBe(false);
        });

        it('should return true when child element is focused', () => {
            const container = document.createElement('div');
            const child = document.createElement('button');
            child.tabIndex = 0;
            container.appendChild(child);
            document.body.appendChild(container);

            child.focus();
            expect(service.isFocusWithin(container)).toBe(true);

            document.body.removeChild(container);
        });

        it('should return false when sibling element is focused', () => {
            const other = document.createElement('button');
            other.tabIndex = 0;
            document.body.appendChild(other);

            other.focus();
            expect(service.isFocusWithin(testElement)).toBe(false);

            document.body.removeChild(other);
        });
    });

    describe('getFocusOrigin', () => {
        it('should return null for non-monitored element', () => {
            expect(service.getFocusOrigin(testElement)).toBeNull();
        });

        it('should return null for monitored but unfocused element', fakeAsync(() => {
            service.monitor(testElement).subscribe();
            tick();

            expect(service.getFocusOrigin(testElement)).toBeNull();
        }));

        it('should return origin for focused monitored element', fakeAsync(() => {
            service.monitor(testElement).subscribe();
            service.focusVia(testElement, 'keyboard');
            tick();

            expect(service.getFocusOrigin(testElement)).toBe('keyboard');
        }));

        it('should return null after blur', fakeAsync(() => {
            service.monitor(testElement).subscribe();
            service.focusVia(testElement, 'mouse');
            tick();

            testElement.blur();
            tick();

            expect(service.getFocusOrigin(testElement)).toBeNull();
        }));

        it('should work with ElementRef', fakeAsync(() => {
            const elementRef = new ElementRef(testElement);
            service.monitor(elementRef).subscribe();
            service.focusVia(testElement, 'touch');
            tick();

            expect(service.getFocusOrigin(elementRef)).toBe('touch');
        }));
    });

    describe('focus origin detection', () => {
        it('should detect keyboard origin from keydown', fakeAsync(() => {
            const origins: (FocusOrigin | undefined)[] = [];
            service.monitor(testElement).subscribe((origin) => origins.push(origin));

            // Simulate keyboard interaction
            const keyEvent = new KeyboardEvent('keydown', { key: 'Tab' });
            document.dispatchEvent(keyEvent);
            tick(10);

            testElement.focus();
            tick();

            expect(origins).toContain('keyboard');
        }));

        it('should detect mouse origin from mousedown', fakeAsync(() => {
            const origins: (FocusOrigin | undefined)[] = [];
            service.monitor(testElement).subscribe((origin) => origins.push(origin));

            // Simulate mouse interaction
            const mouseEvent = new MouseEvent('mousedown');
            document.dispatchEvent(mouseEvent);
            tick(10);

            testElement.focus();
            tick();

            expect(origins).toContain('mouse');
        }));

        it('should detect touch origin from touchstart', fakeAsync(() => {
            const origins: (FocusOrigin | undefined)[] = [];
            service.monitor(testElement).subscribe((origin) => origins.push(origin));

            // Simulate touch interaction
            const touchEvent = new TouchEvent('touchstart');
            document.dispatchEvent(touchEvent);
            tick(10);

            testElement.focus();
            tick();

            expect(origins).toContain('touch');
        }));

        it('should default to program origin without interaction', fakeAsync(() => {
            const origins: (FocusOrigin | undefined)[] = [];
            service.monitor(testElement).subscribe((origin) => origins.push(origin));

            testElement.focus();
            tick();

            expect(origins).toContain('program');
        }));
    });

    describe('multiple elements', () => {
        let element2: HTMLElement;

        beforeEach(() => {
            element2 = document.createElement('button');
            element2.tabIndex = 0;
            document.body.appendChild(element2);
        });

        afterEach(() => {
            document.body.removeChild(element2);
        });

        it('should monitor multiple elements independently', fakeAsync(() => {
            const origins1: (FocusOrigin | undefined)[] = [];
            const origins2: (FocusOrigin | undefined)[] = [];

            service.monitor(testElement).subscribe((origin) => origins1.push(origin));
            service.monitor(element2).subscribe((origin) => origins2.push(origin));

            testElement.focus();
            tick();
            element2.focus();
            tick();

            expect(origins1.length).toBeGreaterThan(0);
            expect(origins2.length).toBeGreaterThan(0);
        }));

        it('should track different origins for different elements', fakeAsync(() => {
            const origins1: (FocusOrigin | undefined)[] = [];
            const origins2: (FocusOrigin | undefined)[] = [];

            service.monitor(testElement).subscribe((origin) => origins1.push(origin));
            service.monitor(element2).subscribe((origin) => origins2.push(origin));

            service.focusVia(testElement, 'keyboard');
            tick();
            service.focusVia(element2, 'mouse');
            tick();

            expect(origins1).toContain('keyboard');
            expect(origins2).toContain('mouse');
        }));
    });

    describe('cleanup', () => {
        it('should clean up all monitors on destroy', fakeAsync(() => {
            const origins: (FocusOrigin | undefined)[] = [];
            service.monitor(testElement).subscribe((origin) => origins.push(origin));

            service.ngOnDestroy();
            tick();

            testElement.focus();
            tick();

            // No new origins after destroy
            expect(origins.length).toBe(0);
        }));

        it('should complete all observables on destroy', fakeAsync(() => {
            let completed = false;
            service.monitor(testElement).subscribe({
                complete: () => (completed = true),
            });

            service.ngOnDestroy();
            tick();

            expect(completed).toBe(true);
        }));
    });

    describe('edge cases', () => {
        it('should handle rapid focus changes', fakeAsync(() => {
            const origins: (FocusOrigin | undefined)[] = [];
            service.monitor(testElement).subscribe((origin) => origins.push(origin));

            testElement.focus();
            tick();
            testElement.blur();
            tick();
            testElement.focus();
            tick();
            testElement.blur();
            tick();

            expect(origins.length).toBeGreaterThanOrEqual(4);
        }));

        it('should handle focus before monitoring', fakeAsync(() => {
            testElement.focus();
            tick();

            const origins: (FocusOrigin | undefined)[] = [];
            service.monitor(testElement).subscribe((origin) => origins.push(origin));
            tick();

            // Should not emit for already-focused element
            expect(origins.length).toBe(0);
        }));

        it('should not throw when element is removed from DOM', fakeAsync(() => {
            service.monitor(testElement).subscribe();
            document.body.removeChild(testElement);

            expect(() => {
                service.stopMonitoring(testElement);
                tick();
            }).not.toThrow();

            document.body.appendChild(testElement);
        }));
    });
});
