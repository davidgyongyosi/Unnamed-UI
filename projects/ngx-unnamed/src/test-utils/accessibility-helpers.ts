import { Component, ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { axe, toHaveNoViolations } from 'jasmine-axe';

/**
 * Accessibility testing utilities for component testing.
 * Provides helper functions to test WCAG 2.1 AA compliance using axe-core.
 */

/**
 * Configuration for axe-core accessibility testing
 */
export const DEFAULT_AXE_CONFIG = {
  rules: {
    // Enable WCAG 2.1 AA compliance
    'color-contrast': { enabled: true },
    'keyboard-navigation': { enabled: true },
    'focus-order-semantics': { enabled: true },
    'heading-order': { enabled: true },
    'label-title-only': { enabled: true },
  },
  tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
};

/**
 * Setup accessibility matchers for testing
 */
export function setupAccessibilityMatchers(): void {
  // Add jasmine-axe matchers
  jasmine.addMatchers(toHaveNoViolations);
}

/**
 * Tests a component for accessibility violations
 * @param component The component instance to test
 * @param config Optional custom axe configuration
 * @returns Promise that resolves when accessibility check is complete
 */
export async function expectAccessible(
  component: Component | { elementRef: ElementRef },
  config?: any
): Promise<void> {
  const element = 'elementRef' in component ? component.elementRef.nativeElement : component;

  if (!element) {
    throw new Error('Component element reference is null or undefined');
  }

  const results = await axe(element, config || DEFAULT_AXE_CONFIG) as any;

  if (results.violations.length > 0) {
    const violationSummary = results.violations.map((violation: any) => ({
      id: violation.id,
      description: violation.description,
      impact: violation.impact,
      help: violation.help,
      nodes: violation.nodes.length,
    }));

    fail(`Accessibility violations found: ${JSON.stringify(violationSummary, null, 2)}`);
  }
}

/**
 * Tests a specific element for accessibility violations
 * @param element The DOM element to test
 * @param config Optional custom axe configuration
 * @returns Promise that resolves when accessibility check is complete
 */
export async function expectElementAccessible(
  element: HTMLElement,
  config?: any
): Promise<void> {
  if (!element) {
    throw new Error('Element is null or undefined');
  }

  const results = await axe(element, config || DEFAULT_AXE_CONFIG) as any;

  if (results.violations.length > 0) {
    const violationSummary = results.violations.map((violation: any) => ({
      id: violation.id,
      description: violation.description,
      impact: violation.impact,
      help: violation.help,
      nodes: violation.nodes.length,
    }));

    fail(`Accessibility violations found: ${JSON.stringify(violationSummary, null, 2)}`);
  }
}

/**
 * Helper function to test keyboard navigation
 * @param element The element to test keyboard navigation on
 * @param keys Array of keys to simulate (e.g., ['Tab', 'Enter', 'Space'])
 */
export function testKeyboardNavigation(
  element: HTMLElement,
  keys: string[]
): void {
  for (const key of keys) {
    const event = new KeyboardEvent('keydown', { key, code: key, bubbles: true });
    element.dispatchEvent(event);
  }
}

/**
 * Helper function to test focus management
 * @param element The element that should receive focus
 */
export function expectFocusable(element: HTMLElement): void {
  // Test if element can receive focus
  element.focus();
  expect(document.activeElement).toBe(element);
}

/**
 * Helper function to test ARIA attributes
 * @param element The element to test
 * @param requiredAttributes Array of required ARIA attributes
 */
export function expectAriaAttributes(
  element: HTMLElement,
  requiredAttributes: string[]
): void {
  for (const attr of requiredAttributes) {
    expect(element.hasAttribute(attr)).toBe(true, `Missing required ARIA attribute: ${attr}`);
  }
}

/**
 * Configuration for testing different accessibility levels
 */
export const ACCESSIBILITY_LEVELS = {
  WCAG_A: ['wcag2a'],
  WCAG_AA: ['wcag2a', 'wcag2aa'],
  WCAG_AAA: ['wcag2a', 'wcag2aa', 'wcag2aaa'],
  WCAG_21_AA: ['wcag2a', 'wcag2aa', 'wcag21aa'],
} as const;

/**
 * Creates an axe configuration for a specific accessibility level
 * @param level The accessibility level to test against
 * @returns Axe configuration object
 */
export function createAxeConfig(level: keyof typeof ACCESSIBILITY_LEVELS): any {
  return {
    rules: DEFAULT_AXE_CONFIG.rules,
    tags: ACCESSIBILITY_LEVELS[level],
  };
}