import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ResponsiveUtility, Breakpoint, DEFAULT_BREAKPOINTS } from './responsive.utility';

describe('ResponsiveUtility', () => {
    let service: ResponsiveUtility;
    let originalInnerWidth: number;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ResponsiveUtility],
        });
        service = TestBed.inject(ResponsiveUtility);
        originalInnerWidth = window.innerWidth;
    });

    afterEach(() => {
        service.ngOnDestroy();
        // Restore original width
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: originalInnerWidth,
        });
    });

    describe('initialization', () => {
        it('should create service', () => {
            expect(service).toBeTruthy();
        });

        it('should initialize with current window breakpoint', () => {
            const breakpoint = service.getCurrentBreakpoint();
            expect(breakpoint).toBeTruthy();
            expect(['xs', 'sm', 'md', 'lg', 'xl', 'xxl']).toContain(breakpoint);
        });

        it('should provide currentBreakpoint$ observable', (done) => {
            service.currentBreakpoint$.subscribe((breakpoint) => {
                expect(breakpoint).toBeTruthy();
                done();
            });
        });
    });

    describe('getCurrentBreakpoint', () => {
        it('should return xs for width < 576', () => {
            setWindowWidth(500);
            expect(service.getCurrentBreakpoint()).toBe('xs');
        });

        it('should return sm for width >= 576 and < 768', () => {
            setWindowWidth(600);
            expect(service.getCurrentBreakpoint()).toBe('sm');
        });

        it('should return md for width >= 768 and < 992', () => {
            setWindowWidth(800);
            expect(service.getCurrentBreakpoint()).toBe('md');
        });

        it('should return lg for width >= 992 and < 1200', () => {
            setWindowWidth(1000);
            expect(service.getCurrentBreakpoint()).toBe('lg');
        });

        it('should return xl for width >= 1200 and < 1400', () => {
            setWindowWidth(1300);
            expect(service.getCurrentBreakpoint()).toBe('xl');
        });

        it('should return xxl for width >= 1400', () => {
            setWindowWidth(1500);
            expect(service.getCurrentBreakpoint()).toBe('xxl');
        });

        it('should handle boundary values correctly', () => {
            setWindowWidth(576);
            expect(service.getCurrentBreakpoint()).toBe('sm');

            setWindowWidth(768);
            expect(service.getCurrentBreakpoint()).toBe('md');

            setWindowWidth(992);
            expect(service.getCurrentBreakpoint()).toBe('lg');

            setWindowWidth(1200);
            expect(service.getCurrentBreakpoint()).toBe('xl');

            setWindowWidth(1400);
            expect(service.getCurrentBreakpoint()).toBe('xxl');
        });
    });

    describe('isBreakpoint', () => {
        it('should return true for current breakpoint', () => {
            setWindowWidth(800);
            expect(service.isBreakpoint('md')).toBe(true);
        });

        it('should return false for different breakpoint', () => {
            setWindowWidth(800);
            expect(service.isBreakpoint('lg')).toBe(false);
        });

        it('should update when window is resized', fakeAsync(() => {
            setWindowWidth(600);
            expect(service.isBreakpoint('sm')).toBe(true);

            setWindowWidth(1000);
            window.dispatchEvent(new Event('resize'));
            tick(200);

            expect(service.isBreakpoint('lg')).toBe(true);
            expect(service.isBreakpoint('sm')).toBe(false);
        }));
    });

    describe('isBreakpointOrLarger', () => {
        it('should return true for exact breakpoint', () => {
            setWindowWidth(768);
            expect(service.isBreakpointOrLarger('md')).toBe(true);
        });

        it('should return true for larger breakpoint', () => {
            setWindowWidth(1000);
            expect(service.isBreakpointOrLarger('md')).toBe(true);
            expect(service.isBreakpointOrLarger('sm')).toBe(true);
        });

        it('should return false for smaller breakpoint', () => {
            setWindowWidth(600);
            expect(service.isBreakpointOrLarger('md')).toBe(false);
            expect(service.isBreakpointOrLarger('lg')).toBe(false);
        });

        it('should work with xs breakpoint', () => {
            setWindowWidth(400);
            expect(service.isBreakpointOrLarger('xs')).toBe(true);
        });

        it('should work with xxl breakpoint', () => {
            setWindowWidth(1500);
            expect(service.isBreakpointOrLarger('xxl')).toBe(true);

            setWindowWidth(1000);
            expect(service.isBreakpointOrLarger('xxl')).toBe(false);
        });
    });

    describe('isBreakpointOrSmaller', () => {
        it('should return true for exact breakpoint', () => {
            setWindowWidth(768);
            expect(service.isBreakpointOrSmaller('md')).toBe(true);
        });

        it('should return true for smaller breakpoint', () => {
            setWindowWidth(600);
            expect(service.isBreakpointOrSmaller('md')).toBe(true);
            expect(service.isBreakpointOrSmaller('lg')).toBe(true);
        });

        it('should return false for larger breakpoint', () => {
            setWindowWidth(1000);
            expect(service.isBreakpointOrSmaller('md')).toBe(false);
            expect(service.isBreakpointOrSmaller('sm')).toBe(false);
        });

        it('should work with xs breakpoint', () => {
            setWindowWidth(400);
            expect(service.isBreakpointOrSmaller('xs')).toBe(true);

            setWindowWidth(800);
            expect(service.isBreakpointOrSmaller('xs')).toBe(false);
        });

        it('should work with xxl breakpoint', () => {
            setWindowWidth(1500);
            expect(service.isBreakpointOrSmaller('xxl')).toBe(true);

            setWindowWidth(1000);
            expect(service.isBreakpointOrSmaller('xxl')).toBe(true);
        });
    });

    describe('isBetweenBreakpoints', () => {
        it('should return true when between breakpoints', () => {
            setWindowWidth(800);
            expect(service.isBetweenBreakpoints('sm', 'lg')).toBe(true);
        });

        it('should return true at minimum breakpoint', () => {
            setWindowWidth(768);
            expect(service.isBetweenBreakpoints('md', 'xl')).toBe(true);
        });

        it('should return true at maximum breakpoint', () => {
            setWindowWidth(991);
            expect(service.isBetweenBreakpoints('sm', 'lg')).toBe(true);
        });

        it('should return false when below range', () => {
            setWindowWidth(500);
            expect(service.isBetweenBreakpoints('md', 'xl')).toBe(false);
        });

        it('should return false when above range', () => {
            setWindowWidth(1500);
            expect(service.isBetweenBreakpoints('sm', 'lg')).toBe(false);
        });

        it('should work with same min and max', () => {
            setWindowWidth(800);
            expect(service.isBetweenBreakpoints('md', 'md')).toBe(true);

            setWindowWidth(600);
            expect(service.isBetweenBreakpoints('md', 'md')).toBe(false);
        });
    });

    describe('getWindowWidth and getWindowHeight', () => {
        it('should return current window width', () => {
            expect(service.getWindowWidth()).toBe(window.innerWidth);
        });

        it('should return current window height', () => {
            expect(service.getWindowHeight()).toBe(window.innerHeight);
        });

        it('should update when window is resized', () => {
            const initialWidth = service.getWindowWidth();
            setWindowWidth(initialWidth + 100);
            expect(service.getWindowWidth()).toBe(initialWidth + 100);
        });
    });

    describe('getBreakpointConfig', () => {
        it('should return default breakpoint configuration', () => {
            const config = service.getBreakpointConfig();
            expect(config).toEqual(DEFAULT_BREAKPOINTS);
        });

        it('should return copy of config (not internal reference)', () => {
            const config = service.getBreakpointConfig();
            // Modify the returned config
            (config as any).md = 999;
            // Get fresh config
            const config2 = service.getBreakpointConfig();
            // Should still have original value
            expect(config2.md).toBe(DEFAULT_BREAKPOINTS.md);
        });
    });

    describe('setBreakpointConfig', () => {
        it('should update breakpoint configuration', () => {
            service.setBreakpointConfig({ md: 800 });
            const config = service.getBreakpointConfig();
            expect(config.md).toBe(800);
        });

        it('should merge with existing configuration', () => {
            service.setBreakpointConfig({ md: 800 });
            const config = service.getBreakpointConfig();
            expect(config.sm).toBe(DEFAULT_BREAKPOINTS.sm);
            expect(config.lg).toBe(DEFAULT_BREAKPOINTS.lg);
        });

        it('should update current breakpoint if needed', fakeAsync(() => {
            setWindowWidth(770);
            expect(service.getCurrentBreakpoint()).toBe('md');

            service.setBreakpointConfig({ md: 800 });
            tick();

            expect(service.getCurrentBreakpoint()).toBe('sm');
        }));

        it('should allow updating multiple breakpoints', () => {
            service.setBreakpointConfig({ sm: 600, md: 800, lg: 1000 });
            const config = service.getBreakpointConfig();
            expect(config.sm).toBe(600);
            expect(config.md).toBe(800);
            expect(config.lg).toBe(1000);
        });
    });

    describe('observeBreakpoint', () => {
        it('should emit true when breakpoint matches', fakeAsync(() => {
            setWindowWidth(800);
            let isMd = false;

            service.observeBreakpoint('md').subscribe((value) => {
                isMd = value;
            });

            tick();
            expect(isMd).toBe(true);
        }));

        it('should emit false when breakpoint does not match', fakeAsync(() => {
            setWindowWidth(800);
            let isLg = true;

            service.observeBreakpoint('lg').subscribe((value) => {
                isLg = value;
            });

            tick();
            expect(isLg).toBe(false);
        }));

        it('should emit changes when breakpoint changes', fakeAsync(() => {
            setWindowWidth(600);
            const values: boolean[] = [];

            service.observeBreakpoint('md').subscribe((value) => {
                values.push(value);
            });

            tick();

            setWindowWidth(800);
            window.dispatchEvent(new Event('resize'));
            tick(200);

            expect(values).toContain(false);
            expect(values).toContain(true);
        }));

        it('should not emit duplicate values', fakeAsync(() => {
            setWindowWidth(800);
            const values: boolean[] = [];

            service.observeBreakpoint('md').subscribe((value) => {
                values.push(value);
            });

            tick();

            // Resize but stay in same breakpoint
            setWindowWidth(850);
            window.dispatchEvent(new Event('resize'));
            tick(200);

            setWindowWidth(900);
            window.dispatchEvent(new Event('resize'));
            tick(200);

            // Should only emit once for 'true'
            expect(values.filter((v) => v === true).length).toBe(1);
        }));
    });

    describe('observeBreakpointOrLarger', () => {
        it('should emit true for current or larger breakpoint', fakeAsync(() => {
            setWindowWidth(1000);
            let result = false;

            service.observeBreakpointOrLarger('md').subscribe((value) => {
                result = value;
            });

            tick();
            expect(result).toBe(true);
        }));

        it('should emit false for smaller breakpoint', fakeAsync(() => {
            setWindowWidth(600);
            let result = true;

            service.observeBreakpointOrLarger('md').subscribe((value) => {
                result = value;
            });

            tick();
            expect(result).toBe(false);
        }));

        it('should react to breakpoint changes', fakeAsync(() => {
            setWindowWidth(600);
            const values: boolean[] = [];

            service.observeBreakpointOrLarger('md').subscribe((value) => {
                values.push(value);
            });

            tick();

            setWindowWidth(1000);
            window.dispatchEvent(new Event('resize'));
            tick(200);

            expect(values).toContain(false);
            expect(values).toContain(true);
        }));
    });

    describe('observeBreakpointOrSmaller', () => {
        it('should emit true for current or smaller breakpoint', fakeAsync(() => {
            setWindowWidth(600);
            let result = false;

            service.observeBreakpointOrSmaller('md').subscribe((value) => {
                result = value;
            });

            tick();
            expect(result).toBe(true);
        }));

        it('should emit false for larger breakpoint', fakeAsync(() => {
            setWindowWidth(1000);
            let result = true;

            service.observeBreakpointOrSmaller('md').subscribe((value) => {
                result = value;
            });

            tick();
            expect(result).toBe(false);
        }));

        it('should react to breakpoint changes', fakeAsync(() => {
            setWindowWidth(1000);
            const values: boolean[] = [];

            service.observeBreakpointOrSmaller('md').subscribe((value) => {
                values.push(value);
            });

            tick();

            setWindowWidth(600);
            window.dispatchEvent(new Event('resize'));
            tick(200);

            expect(values).toContain(false);
            expect(values).toContain(true);
        }));
    });

    describe('resize handling', () => {
        it('should debounce resize events', fakeAsync(() => {
            const values: Breakpoint[] = [];
            service.currentBreakpoint$.subscribe((bp) => values.push(bp));

            setWindowWidth(600);
            window.dispatchEvent(new Event('resize'));
            tick(50);

            setWindowWidth(800);
            window.dispatchEvent(new Event('resize'));
            tick(50);

            setWindowWidth(1000);
            window.dispatchEvent(new Event('resize'));
            tick(200);

            // Should only emit final value after debounce
            expect(values[values.length - 1]).toBe('lg');
        }));

        it('should handle rapid resize events', fakeAsync(() => {
            for (let i = 0; i < 10; i++) {
                setWindowWidth(600 + i * 10);
                window.dispatchEvent(new Event('resize'));
                tick(10);
            }

            tick(200);
            expect(service.getCurrentBreakpoint()).toBe('sm');
        }));
    });

    describe('cleanup', () => {
        it('should clean up on destroy', () => {
            expect(() => service.ngOnDestroy()).not.toThrow();
        });

        it('should complete observables on destroy', fakeAsync(() => {
            let completed = false;
            service.currentBreakpoint$.subscribe({
                complete: () => (completed = true),
            });

            service.ngOnDestroy();
            tick();

            expect(completed).toBe(true);
        }));

        it('should stop reacting to resize after destroy', fakeAsync(() => {
            const values: Breakpoint[] = [];
            service.currentBreakpoint$.subscribe((bp) => values.push(bp));

            const initialCount = values.length;

            service.ngOnDestroy();
            tick();

            setWindowWidth(1500);
            window.dispatchEvent(new Event('resize'));
            tick(200);

            expect(values.length).toBe(initialCount);
        }));
    });

    describe('edge cases', () => {
        it('should handle width of 0', () => {
            setWindowWidth(0);
            expect(service.getCurrentBreakpoint()).toBe('xs');
        });

        it('should handle very large width', () => {
            setWindowWidth(10000);
            expect(service.getCurrentBreakpoint()).toBe('xxl');
        });

        it('should handle exact breakpoint boundaries', () => {
            const breakpoints = [0, 576, 768, 992, 1200, 1400];
            const expected: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

            breakpoints.forEach((width, index) => {
                setWindowWidth(width);
                expect(service.getCurrentBreakpoint()).toBe(expected[index]);
            });
        });
    });

    // Helper function to set window width
    function setWindowWidth(width: number): void {
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: width,
        });
    }
});
