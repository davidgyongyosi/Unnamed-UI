import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';

/**
 * Component testing utilities for standard test setup and common operations.
 * Provides helper functions for component creation, event simulation, and assertions.
 */

/**
 * Standard test configuration options
 */
export interface TestConfig {
  autoDetectChanges?: boolean;
  declarations?: any[];
  imports?: any[];
  providers?: any[];
  schemas?: any[];
}

/**
 * Creates a component fixture with standard configuration
 * @param componentType The component class to create fixture for
 * @param config Optional configuration for TestBed setup
 * @returns Configured component fixture
 */
export function createComponentFixture<T>(
  componentType: new (...args: any[]) => T,
  config: TestConfig = {}
): ComponentFixture<T> {
  const {
    autoDetectChanges = false,
    declarations = [],
    imports = [],
    providers = [],
    schemas = [],
  } = config;

  TestBed.configureTestingModule({
    declarations: [componentType, ...declarations],
    imports: [...imports],
    providers: [...providers],
    schemas: [...schemas],
  });

  if (autoDetectChanges) {
    TestBed.configureTestingModule({
      providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
    });
  }

  return TestBed.createComponent(componentType);
}

/**
 * Triggers a keyboard event on an element
 * @param element The target element
 * @param type The event type ('keydown', 'keyup', 'keypress')
 * @param key The key value
 * @param code The key code
 * @param modifiers Optional modifier keys
 */
export function triggerKeyboardEvent(
  element: HTMLElement,
  type: 'keydown' | 'keyup' | 'keypress',
  key: string,
  code?: string,
  modifiers: {
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
  } = {}
): void {
  const event = new KeyboardEvent(type, {
    key,
    code: code || key,
    bubbles: true,
    cancelable: true,
    ...modifiers,
  });

  element.dispatchEvent(event);
}

/**
 * Triggers a mouse event on an element
 * @param element The target element
 * @param type The event type ('click', 'mousedown', 'mouseup', etc.)
 * @param coordinates Optional x, y coordinates
 */
export function triggerMouseEvent(
  element: HTMLElement,
  type: string,
  coordinates?: { x: number; y: number }
): void {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX: coordinates?.x,
    clientY: coordinates?.y,
  });

  element.dispatchEvent(event);
}

/**
 * Triggers a form event on an input element
 * @param element The input element
 * @param value The value to set
 * @param eventType The event type to trigger
 */
export function triggerInputEvent(
  element: HTMLInputElement,
  value: string,
  eventType: 'input' | 'change' = 'input'
): void {
  element.value = value;
  const event = new Event(eventType, { bubbles: true, cancelable: true });
  element.dispatchEvent(event);
}

/**
 * Waits for Angular's change detection and async operations to complete
 * @param tickCount Optional number of change detection cycles to wait for
 */
export function waitForAsync(tickCount: number = 1): void {
  for (let i = 0; i < tickCount; i++) {
    tick();
  }
}

/**
 * Mock dependency injection provider
 * @param token The injection token to mock
 * @param implementation The mock implementation
 * @returns Provider configuration for TestBed
 */
export function mockInject<T>(token: any, implementation: Partial<T>): { provide: any; useValue: T } {
  return {
    provide: token,
    useValue: implementation as T,
  };
}

/**
 * Sets up a mock service with method spies
 * @param service The service instance to spy on
 * @param methods Array of method names to spy on
 * @returns The spied service instance
 */
export function spyOnServiceMethods<T extends object>(
  service: T,
  methods: (keyof T)[]
): jasmine.SpyObj<T> {
  const spyObj = jasmine.createSpyObj(service.constructor.name, methods as string[]);
  Object.assign(spyObj, service);

  methods.forEach(method => {
    if (typeof service[method] === 'function') {
      (spyObj[method] as jasmine.Spy).and.callFake((service[method] as Function).bind(service));
    }
  });

  return spyObj as jasmine.SpyObj<T>;
}

/**
 * Gets a debug element by CSS selector
 * @param fixture The component fixture
 * @param selector CSS selector to find element
 * @returns DebugElement or null if not found
 */
export function getElementBySelector<T>(
  fixture: ComponentFixture<T>,
  selector: string
): DebugElement | null {
  return fixture.debugElement.query(By.css(selector));
}

/**
 * Gets multiple debug elements by CSS selector
 * @param fixture The component fixture
 * @param selector CSS selector to find elements
 * @returns Array of DebugElements
 */
export function getElementsBySelector<T>(
  fixture: ComponentFixture<T>,
  selector: string
): DebugElement[] {
  return fixture.debugElement.queryAll(By.css(selector));
}

/**
 * Asserts that an element has specific CSS classes
 * @param element The element to check
 * @param expectedClasses Array of expected class names
 */
export function expectClasses(element: HTMLElement, expectedClasses: string[]): void {
  expectedClasses.forEach(className => {
    expect(element.classList.contains(className)).toBe(true,
      `Expected element to have class '${className}', but found classes: ${Array.from(element.classList).join(', ')}`
    );
  });
}

/**
 * Asserts that an element does not have specific CSS classes
 * @param element The element to check
 * @param unwantedClasses Array of unwanted class names
 */
export function expectNoClasses(element: HTMLElement, unwantedClasses: string[]): void {
  unwantedClasses.forEach(className => {
    expect(element.classList.contains(className)).toBe(false,
      `Expected element NOT to have class '${className}', but it does.`
    );
  });
}

/**
 * Asserts that an element has specific attributes with expected values
 * @param element The element to check
 * @param expectedAttributes Object mapping attribute names to expected values
 */
export function expectAttributes(element: HTMLElement, expectedAttributes: Record<string, string>): void {
  Object.entries(expectedAttributes).forEach(([attrName, expectedValue]) => {
    const actualValue = element.getAttribute(attrName);
    expect(actualValue).toBe(expectedValue,
      `Expected attribute '${attrName}' to be '${expectedValue}', but got '${actualValue}'`
    );
  });
}

/**
 * Asserts that an element is visible (not hidden and has dimensions)
 * @param element The element to check
 */
export function expectVisible(element: HTMLElement): void {
  const styles = window.getComputedStyle(element);
  expect(styles.display).not.toBe('none');
  expect(styles.visibility).not.toBe('hidden');
  expect(element.offsetWidth).toBeGreaterThan(0);
  expect(element.offsetHeight).toBeGreaterThan(0);
}

/**
 * Asserts that an element is hidden
 * @param element The element to check
 */
export function expectHidden(element: HTMLElement): void {
  const styles = window.getComputedStyle(element);
  const isHidden = styles.display === 'none' ||
                  styles.visibility === 'hidden' ||
                  element.offsetWidth === 0 ||
                  element.offsetHeight === 0;
  expect(isHidden).toBe(true, 'Expected element to be hidden, but it appears to be visible');
}

/**
 * Tests component property changes and their effects
 * @param fixture The component fixture
 * @param property The property name to change
 * @param value The new value to set
 * @param testCallback Optional callback to test the effect of the change
 */
export function testPropertyChange<T, K extends keyof T>(
  fixture: ComponentFixture<T>,
  property: K,
  value: T[K],
  testCallback?: () => void
): void {
  const component = fixture.componentInstance;

  // Set the property value
  (component as any)[property] = value;

  // Trigger change detection
  fixture.detectChanges();

  // Run test callback if provided
  if (testCallback) {
    testCallback();
  }
}

/**
 * Creates a fake async test environment
 * @param testFn The test function to run in fakeAsync context
 */
export function runInFakeAsync(testFn: () => void | Promise<void>): void {
  fakeAsync(() => {
    testFn();
  })();
}

/**
 * Helper for testing component lifecycle hooks
 * @param fixture The component fixture
 * @param lifecycleHook The lifecycle hook to test
 * @param testCallback Test callback to run after lifecycle hook
 */
export function testLifecycleHook<T>(
  fixture: ComponentFixture<T>,
  lifecycleHook: 'ngOnInit' | 'ngOnChanges' | 'ngAfterContentInit' | 'ngAfterViewInit',
  testCallback: () => void
): void {
  switch (lifecycleHook) {
    case 'ngOnInit':
      fixture.detectChanges(); // Triggers ngOnInit
      break;
    case 'ngOnChanges':
      fixture.detectChanges(); // Triggers ngOnChanges if inputs changed
      break;
    case 'ngAfterContentInit':
      fixture.detectChanges(); // Triggers ngAfterContentInit
      break;
    case 'ngAfterViewInit':
      fixture.detectChanges(); // Triggers ngAfterViewInit
      break;
  }

  testCallback();
}