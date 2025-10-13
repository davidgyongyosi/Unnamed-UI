import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { OverlayService, OverlayPosition } from './overlay.service';

describe('OverlayService', () => {
    let service: OverlayService;
    let triggerElement: HTMLElement;
    let overlayElement: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [OverlayService],
        });
        service = TestBed.inject(OverlayService);

        // Create test elements
        triggerElement = document.createElement('button');
        triggerElement.style.position = 'fixed';
        triggerElement.style.top = '100px';
        triggerElement.style.left = '100px';
        triggerElement.style.width = '100px';
        triggerElement.style.height = '40px';
        document.body.appendChild(triggerElement);

        overlayElement = document.createElement('div');
        overlayElement.style.position = 'fixed';
        overlayElement.style.width = '200px';
        overlayElement.style.height = '100px';
        document.body.appendChild(overlayElement);
    });

    afterEach(() => {
        document.body.removeChild(triggerElement);
        document.body.removeChild(overlayElement);
        service.ngOnDestroy();
    });

    describe('initialization', () => {
        it('should create service', () => {
            expect(service).toBeTruthy();
        });
    });

    describe('calculatePosition', () => {
        it('should calculate position for bottom placement', () => {
            const position = service.calculatePosition(triggerElement, overlayElement, {
                placement: 'bottom',
            });

            expect(position.placement).toBe('bottom');
            expect(position.top).toBeGreaterThan(140); // Below trigger (100 + 40)
        });

        it('should calculate position for top placement', () => {
            const position = service.calculatePosition(triggerElement, overlayElement, {
                placement: 'top',
            });

            expect(position.placement).toBe('top');
            expect(position.top).toBeLessThan(100); // Above trigger
        });

        it('should calculate position for left placement', () => {
            const position = service.calculatePosition(triggerElement, overlayElement, {
                placement: 'left',
            });

            expect(position.placement).toBe('left');
            expect(position.left).toBeLessThan(100); // Left of trigger
        });

        it('should calculate position for right placement', () => {
            const position = service.calculatePosition(triggerElement, overlayElement, {
                placement: 'right',
            });

            expect(position.placement).toBe('right');
            expect(position.left).toBeGreaterThan(200); // Right of trigger (100 + 100)
        });

        it('should calculate position for topStart placement', () => {
            const position = service.calculatePosition(triggerElement, overlayElement, {
                placement: 'topStart',
            });

            expect(position.placement).toBe('topStart');
            expect(position.top).toBeLessThan(100);
            expect(position.left).toBe(100); // Aligned with trigger left
        });

        it('should calculate position for topEnd placement', () => {
            const position = service.calculatePosition(triggerElement, overlayElement, {
                placement: 'topEnd',
            });

            expect(position.placement).toBe('topEnd');
            expect(position.top).toBeLessThan(100);
            expect(position.left).toBe(0); // Aligned with trigger right (200 - 200 overlay width)
        });

        it('should calculate position for bottomStart placement', () => {
            const position = service.calculatePosition(triggerElement, overlayElement, {
                placement: 'bottomStart',
            });

            expect(position.placement).toBe('bottomStart');
            expect(position.top).toBeGreaterThan(140);
            expect(position.left).toBe(100);
        });

        it('should calculate position for bottomEnd placement', () => {
            const position = service.calculatePosition(triggerElement, overlayElement, {
                placement: 'bottomEnd',
            });

            expect(position.placement).toBe('bottomEnd');
            expect(position.top).toBeGreaterThan(140);
            expect(position.left).toBe(0);
        });

        it('should calculate position for leftStart placement', () => {
            const position = service.calculatePosition(triggerElement, overlayElement, {
                placement: 'leftStart',
            });

            expect(position.placement).toBe('leftStart');
            expect(position.left).toBeLessThan(100);
            expect(position.top).toBe(100); // Aligned with trigger top
        });

        it('should calculate position for leftEnd placement', () => {
            const position = service.calculatePosition(triggerElement, overlayElement, {
                placement: 'leftEnd',
            });

            expect(position.placement).toBe('leftEnd');
            expect(position.left).toBeLessThan(100);
            expect(position.top).toBe(40); // Aligned with trigger bottom (140 - 100 overlay height)
        });

        it('should calculate position for rightStart placement', () => {
            const position = service.calculatePosition(triggerElement, overlayElement, {
                placement: 'rightStart',
            });

            expect(position.placement).toBe('rightStart');
            expect(position.left).toBeGreaterThan(200);
            expect(position.top).toBe(100);
        });

        it('should calculate position for rightEnd placement', () => {
            const position = service.calculatePosition(triggerElement, overlayElement, {
                placement: 'rightEnd',
            });

            expect(position.placement).toBe('rightEnd');
            expect(position.left).toBeGreaterThan(200);
            expect(position.top).toBe(40);
        });

        it('should apply custom offset', () => {
            const positionDefault = service.calculatePosition(triggerElement, overlayElement, {
                placement: 'bottom',
            });

            const positionCustom = service.calculatePosition(triggerElement, overlayElement, {
                placement: 'bottom',
                offset: 20,
            });

            expect(positionCustom.top).toBeGreaterThan(positionDefault.top);
        });

        it('should handle zero offset', () => {
            const position = service.calculatePosition(triggerElement, overlayElement, {
                placement: 'bottom',
                offset: 0,
            });

            expect(position.top).toBe(140); // Exactly at trigger bottom (100 + 40)
        });
    });

    describe('applyPosition', () => {
        it('should apply position to overlay element', () => {
            const position: OverlayPosition = {
                top: 150,
                left: 100,
                placement: 'bottom',
            };

            service.applyPosition(overlayElement, position);

            expect(overlayElement.style.position).toBe('fixed');
            expect(overlayElement.style.top).toBe('150px');
            expect(overlayElement.style.left).toBe('100px');
        });

        it('should handle negative positions', () => {
            const position: OverlayPosition = {
                top: -10,
                left: -20,
                placement: 'top',
            };

            service.applyPosition(overlayElement, position);

            expect(overlayElement.style.top).toBe('-10px');
            expect(overlayElement.style.left).toBe('-20px');
        });

        it('should handle decimal positions', () => {
            const position: OverlayPosition = {
                top: 123.456,
                left: 78.9,
                placement: 'bottom',
            };

            service.applyPosition(overlayElement, position);

            expect(overlayElement.style.top).toBe('123.456px');
            expect(overlayElement.style.left).toBe('78.9px');
        });
    });

    describe('register and unregister', () => {
        it('should register overlay for automatic updates', () => {
            service.register(triggerElement, overlayElement, {
                placement: 'bottom',
            });

            expect(overlayElement.style.position).toBe('fixed');
            expect(overlayElement.style.top).not.toBe('');
            expect(overlayElement.style.left).not.toBe('');
        });

        it('should apply z-index when registering', () => {
            service.register(triggerElement, overlayElement, {
                placement: 'bottom',
                zIndex: 5000,
            });

            expect(overlayElement.style.zIndex).toBe('5000');
        });

        it('should auto-increment z-index if not provided', () => {
            const overlay2 = document.createElement('div');
            overlay2.style.width = '100px';
            overlay2.style.height = '50px';
            document.body.appendChild(overlay2);

            service.register(triggerElement, overlayElement, { placement: 'bottom' });
            service.register(triggerElement, overlay2, { placement: 'top' });

            const zIndex1 = parseInt(overlayElement.style.zIndex);
            const zIndex2 = parseInt(overlay2.style.zIndex);

            expect(zIndex2).toBeGreaterThan(zIndex1);

            document.body.removeChild(overlay2);
        });

        it('should unregister overlay', () => {
            service.register(triggerElement, overlayElement, {
                placement: 'bottom',
            });

            service.unregister(overlayElement);

            // After unregister, manual position updates should not affect styles
            expect(() => service.unregister(overlayElement)).not.toThrow();
        });

        it('should handle unregistering non-registered overlay', () => {
            expect(() => service.unregister(overlayElement)).not.toThrow();
        });
    });

    describe('getNextZIndex', () => {
        it('should return incrementing z-index values', () => {
            const z1 = service.getNextZIndex();
            const z2 = service.getNextZIndex();
            const z3 = service.getNextZIndex();

            expect(z2).toBeGreaterThan(z1);
            expect(z3).toBeGreaterThan(z2);
        });

        it('should return unique values', () => {
            const zIndices = new Set<number>();
            for (let i = 0; i < 10; i++) {
                zIndices.add(service.getNextZIndex());
            }

            expect(zIndices.size).toBe(10);
        });
    });

    describe('autoReposition', () => {
        it('should respect autoReposition: false', () => {
            // Position trigger at very top where overlay would overflow
            triggerElement.style.top = '10px';

            const position = service.calculatePosition(triggerElement, overlayElement, {
                placement: 'top',
                autoReposition: false,
            });

            // Should keep 'top' placement even though it causes overflow
            expect(position.placement).toBe('top');
        });

        it('should reposition when autoReposition: true and collision detected', () => {
            // Position trigger at very top where overlay would overflow
            triggerElement.style.top = '10px';
            triggerElement.style.left = '10px';

            const position = service.calculatePosition(triggerElement, overlayElement, {
                placement: 'top',
                autoReposition: true,
            });

            // Should switch to bottom to avoid overflow
            expect(position.placement).not.toBe('top');
        });

        it('should default to autoReposition: true', () => {
            triggerElement.style.top = '10px';

            const position = service.calculatePosition(triggerElement, overlayElement, {
                placement: 'top',
            });

            // Should auto-reposition by default
            expect(position.placement).not.toBe('top');
        });
    });

    describe('scroll and resize handling', () => {
        it('should update registered overlay positions on scroll', fakeAsync(() => {
            service.register(triggerElement, overlayElement, {
                placement: 'bottom',
            });

            const initialTop = overlayElement.style.top;

            // Change trigger position
            triggerElement.style.top = '200px';

            // Trigger scroll event
            window.dispatchEvent(new Event('scroll'));
            tick(20); // Wait for debounce

            // Position should have updated
            expect(overlayElement.style.top).not.toBe(initialTop);
        }));

        it('should update registered overlay positions on resize', fakeAsync(() => {
            service.register(triggerElement, overlayElement, {
                placement: 'bottom',
            });

            const initialTop = overlayElement.style.top;

            // Change trigger position
            triggerElement.style.top = '300px';

            // Trigger resize event
            window.dispatchEvent(new Event('resize'));
            tick(60); // Wait for debounce

            // Position should have updated
            expect(overlayElement.style.top).not.toBe(initialTop);
        }));
    });

    describe('cleanup', () => {
        it('should clean up on destroy', () => {
            service.register(triggerElement, overlayElement, {
                placement: 'bottom',
            });

            expect(() => service.ngOnDestroy()).not.toThrow();
        });

        it('should stop updating overlays after destroy', fakeAsync(() => {
            service.register(triggerElement, overlayElement, {
                placement: 'bottom',
            });

            const initialTop = overlayElement.style.top;

            service.ngOnDestroy();

            triggerElement.style.top = '500px';
            window.dispatchEvent(new Event('scroll'));
            tick(20);

            // Position should not update after destroy
            expect(overlayElement.style.top).toBe(initialTop);
        }));
    });

    describe('edge cases', () => {
        it('should handle trigger with zero dimensions', () => {
            triggerElement.style.width = '0';
            triggerElement.style.height = '0';

            expect(() => {
                service.calculatePosition(triggerElement, overlayElement, {
                    placement: 'bottom',
                });
            }).not.toThrow();
        });

        it('should handle overlay with zero dimensions', () => {
            overlayElement.style.width = '0';
            overlayElement.style.height = '0';

            expect(() => {
                service.calculatePosition(triggerElement, overlayElement, {
                    placement: 'bottom',
                });
            }).not.toThrow();
        });

        it('should handle very large overlay', () => {
            overlayElement.style.width = '2000px';
            overlayElement.style.height = '2000px';

            const position = service.calculatePosition(triggerElement, overlayElement, {
                placement: 'bottom',
                autoReposition: true,
            });

            expect(position).toBeDefined();
            expect(position.placement).toBeDefined();
        });

        it('should handle trigger at viewport edge', () => {
            triggerElement.style.top = '0';
            triggerElement.style.left = '0';

            const position = service.calculatePosition(triggerElement, overlayElement, {
                placement: 'top',
                autoReposition: true,
            });

            expect(position).toBeDefined();
        });

        it('should handle negative offset', () => {
            const position = service.calculatePosition(triggerElement, overlayElement, {
                placement: 'bottom',
                offset: -10,
            });

            expect(position.top).toBeLessThan(140 + 8); // Less than default offset
        });
    });

    describe('multiple overlays', () => {
        let overlay2: HTMLElement;
        let trigger2: HTMLElement;

        beforeEach(() => {
            trigger2 = document.createElement('button');
            trigger2.style.position = 'fixed';
            trigger2.style.top = '300px';
            trigger2.style.left = '300px';
            trigger2.style.width = '100px';
            trigger2.style.height = '40px';
            document.body.appendChild(trigger2);

            overlay2 = document.createElement('div');
            overlay2.style.position = 'fixed';
            overlay2.style.width = '150px';
            overlay2.style.height = '80px';
            document.body.appendChild(overlay2);
        });

        afterEach(() => {
            document.body.removeChild(trigger2);
            document.body.removeChild(overlay2);
        });

        it('should manage multiple overlays independently', () => {
            service.register(triggerElement, overlayElement, { placement: 'bottom' });
            service.register(trigger2, overlay2, { placement: 'top' });

            expect(overlayElement.style.top).not.toBe('');
            expect(overlay2.style.top).not.toBe('');
            expect(overlayElement.style.top).not.toBe(overlay2.style.top);
        });

        it('should assign different z-indices to multiple overlays', () => {
            service.register(triggerElement, overlayElement, { placement: 'bottom' });
            service.register(trigger2, overlay2, { placement: 'top' });

            const z1 = parseInt(overlayElement.style.zIndex);
            const z2 = parseInt(overlay2.style.zIndex);

            expect(z2).toBeGreaterThan(z1);
        });

        it('should update all overlays on scroll', fakeAsync(() => {
            service.register(triggerElement, overlayElement, { placement: 'bottom' });
            service.register(trigger2, overlay2, { placement: 'top' });

            const initialTop1 = overlayElement.style.top;
            const initialTop2 = overlay2.style.top;

            triggerElement.style.top = '150px';
            trigger2.style.top = '350px';

            window.dispatchEvent(new Event('scroll'));
            tick(20);

            expect(overlayElement.style.top).not.toBe(initialTop1);
            expect(overlay2.style.top).not.toBe(initialTop2);
        }));
    });
});
