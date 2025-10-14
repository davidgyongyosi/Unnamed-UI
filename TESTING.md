# Testing Documentation

This document outlines the testing standards, tools, and workflows for the Unnamed UI component library.

## Table of Contents

- [Overview](#overview)
- [Testing Stack](#testing-stack)
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Coverage Requirements](#coverage-requirements)
- [Accessibility Testing](#accessibility-testing)
- [Performance Testing](#performance-testing)
- [Visual Regression Testing](#visual-regression-testing)
- [Test Utilities](#test-utilities)
- [Component Testing Examples](#component-testing-examples)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

## Overview

The Unnamed UI library uses a comprehensive testing approach that includes:

- **Unit Tests**: Component logic and behavior testing
- **Accessibility Tests**: WCAG 2.1 AA compliance verification
- **Performance Tests**: Lighthouse-based performance benchmarking
- **Visual Regression Tests**: Component appearance testing
- **Integration Tests**: Component interaction testing

## Testing Stack

### Core Testing Framework
- **Jasmine**: Behavior-driven development framework for JavaScript testing
- **Karma**: Test runner for executing unit tests in browsers
- **Angular Testing Utilities**: Built-in Angular testing helpers

### Accessibility Testing
- **axe-core**: Accessibility testing engine
- **jasmine-axe**: Jasmine matcher for accessibility testing

### Performance Testing
- **Lighthouse CI**: Automated performance, accessibility, and SEO testing
- **Lighthouse**: Open-source automated tool for improving web quality

### Visual Testing
- **Chromatic**: Visual regression testing platform (selected tool)
- **Storybook**: Component development and testing environment

### Coverage & Reporting
- **Istanbul**: Code coverage tool
- **Coverage thresholds**: 80% minimum coverage required

## Test Structure

### File Organization

```
projects/ngx-unnamed/src/lib/
├── components/
│   ├── button/
│   │   ├── button.component.ts
│   │   ├── button.component.spec.ts    # Component tests
│   │   └── style/
│   │       └── button.component.scss
│   └── input/
│       ├── input.directive.ts
│       ├── input.directive.spec.ts     # Directive tests
│       └── style/
│           └── input.directive.scss
├── test-utils/
│   ├── accessibility-helpers.ts        # Accessibility test utilities
│   └── component-test-helpers.ts       # Component test utilities
└── style/
    └── global.scss
```

### Test Structure Guidelines

All tests should follow the **Arrange-Act-Assert** pattern:

```typescript
describe('ComponentName', () => {
  let component: ComponentType;
  let fixture: ComponentFixture<ComponentType>;

  // Arrange - Setup test environment
  beforeEach(async () => {
    setupAccessibilityMatchers(); // Setup accessibility testing

    await TestBed.configureTestingModule({
      imports: [ComponentType],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Act & Assert - Test specific behavior
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Accessibility Tests', () => {
    it('should be accessible in default state', async () => {
      await expectAccessible(fixture.nativeElement);
    });
  });
});
```

## Running Tests

### Local Development

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci

# Run tests for specific library
ng test ngx-unnamed
ng test ngx-unnamed-icons

# Run tests with specific browser
ng test --browsers=ChromeHeadless
```

### Continuous Integration

Tests run automatically on:
- Pull requests
- Push to main/develop branches
- Scheduled weekly runs

## Coverage Requirements

### Thresholds
- **Global Coverage**: 80% minimum for all metrics
  - Statements: 80%
  - Branches: 80%
  - Functions: 80%
  - Lines: 80%

### Coverage Configuration

Coverage is configured in `karma.conf.js`:

```javascript
coverageReporter: {
  check: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
}
```

### Coverage Reports

Coverage reports are generated in:
- `./coverage/` directory
- HTML format for detailed viewing
- LCOV format for CI integration
- JSON format for programmatic access

### Exclusions

The following files are excluded from coverage:
- `*.spec.ts` - Test files
- `*.mock.ts` - Mock files
- `*.stories.ts` - Storybook stories
- `*.interface.ts` - TypeScript interfaces
- `test-utils/**` - Test utility files
- `public-api.ts` - Library entry points

## Accessibility Testing

### Overview

All components must pass WCAG 2.1 AA accessibility standards. We use axe-core for automated accessibility testing.

### Testing Approach

1. **Automated Testing**: All components include accessibility tests in their spec files
2. **Manual Testing**: Regular manual accessibility audits
3. **Continuous Integration**: Accessibility tests run on every PR

### Accessibility Test Helpers

```typescript
import { expectAccessible, setupAccessibilityMatchers } from '../../../test-utils';

describe('Accessibility Tests', () => {
  beforeEach(() => {
    setupAccessibilityMatchers();
  });

  it('should be accessible in default state', async () => {
    await expectAccessible(component.elementRef.nativeElement);
  });

  it('should be accessible when disabled', async () => {
    component.disabled = true;
    fixture.detectChanges();
    await expectAccessible(component.elementRef.nativeElement);
  });
});
```

### Required Accessibility Tests

Each component must include accessibility tests for:
- Default state
- Disabled state
- Different sizes/variants
- Keyboard navigation
- ARIA attributes
- Focus management

### WCAG 2.1 AA Standards

Components must comply with:
- **Perceivable**: Information must be presentable in ways users can perceive
- **Operable**: Interface components must be operable
- **Understandable**: Information and UI operation must be understandable
- **Robust**: Content must be robust enough for various assistive technologies

## Performance Testing

### Lighthouse CI

We use Lighthouse CI to ensure performance standards:

```bash
# Run Lighthouse CI locally
npm run lhci

# Upload results to server
npm run lhci:upload
```

### Performance Thresholds

- **Performance Score**: 90/100 minimum
- **Accessibility Score**: 95/100 minimum
- **Best Practices**: 90/100 minimum
- **SEO**: 90/100 minimum

### Performance Metrics

- **First Contentful Paint**: < 2000ms
- **Largest Contentful Paint**: < 2500ms
- **Time to Interactive**: < 5000ms
- **Total Blocking Time**: < 200ms

### Performance Budgets

- **JavaScript Size**: < 250KB total
- **Script Count**: < 10 scripts
- **Performance Budget**: Monitored in CI

## Visual Regression Testing

### Tool Selection

We selected **Chromatic** for visual regression testing because:
- Free for open-source projects
- Excellent Storybook integration
- Comprehensive visual testing platform
- Automatic baseline management
- PR integration with visual diffs

### Setup (Coming Soon)

Visual regression testing setup is in progress. Components will be tested against visual baselines to catch unintended UI changes.

### Visual Test Coverage

All components will include:
- Basic states visual tests
- Variant comparison tests
- Responsive design tests
- Cross-browser visual tests

## Test Utilities

### Accessibility Helpers

Located in `projects/ngx-unnamed/src/test-utils/accessibility-helpers.ts`:

```typescript
import { expectAccessible, setupAccessibilityMatchers } from '../../../test-utils';

// Setup accessibility matchers
setupAccessibilityMatchers();

// Test component accessibility
await expectAccessible(component);
```

### Component Test Helpers

Located in `projects/ngx-unnamed/src/test-utils/component-test-helpers.ts`:

```typescript
import {
  createComponentFixture,
  triggerKeyboardEvent,
  triggerMouseEvent
} from '../../../test-utils';

// Create component fixture
const { fixture, component } = createComponentFixture(MyComponent);

// Trigger keyboard events
triggerKeyboardEvent(element, 'keydown', 'Enter');

// Trigger mouse events
triggerMouseEvent(element, 'click');
```

## Component Testing Examples

### Button Component Test Example

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';
import { setupAccessibilityMatchers, expectAccessible } from '../../../test-utils';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    setupAccessibilityMatchers();

    await TestBed.configureTestingModule({
      imports: [ButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Accessibility Tests', () => {
    it('should be accessible when disabled', async () => {
      component.disabled = true;
      fixture.detectChanges();

      await expectAccessible(fixture.nativeElement);
    });

    it('should be accessible across all variants', async () => {
      const variants = ['primary', 'secondary', 'danger', 'outline'];

      for (const variant of variants) {
        component.nxVariant = variant;
        fixture.detectChanges();

        await expectAccessible(fixture.nativeElement);
      }
    });
  });

  describe('Functional Tests', () => {
    it('should prevent clicks when disabled', () => {
      component.disabled = true;
      fixture.detectChanges();

      const buttonElement = fixture.nativeElement.querySelector('button');
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      const preventDefaultSpy = spyOn(clickEvent, 'preventDefault');

      buttonElement.dispatchEvent(clickEvent);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });
});
```

### Input Directive Test Example

```typescript
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { InputDirective } from './input.directive';
import { setupAccessibilityMatchers, expectAccessible } from '../../../test-utils';

describe('InputDirective', () => {
  let fixture: ComponentFixture<TestInputComponent>;
  let inputElement: DebugElement;

  beforeEach(async () => {
    setupAccessibilityMatchers();

    await TestBed.configureTestingModule({
      imports: [InputDirective, TestInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestInputComponent);
    fixture.detectChanges();
    inputElement = fixture.debugElement.query(By.directive(InputDirective));
  });

  it('should be accessible with placeholder', async () => {
    inputElement.nativeElement.setAttribute('placeholder', 'Enter text');
    fixture.detectChanges();

    await expectAccessible(inputElement.nativeElement);
  });
});
```

## CI/CD Integration

### GitHub Actions Workflows

#### Main Test Workflow
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test:ci
      - run: npm run lhci
```

#### Lighthouse CI Workflow
- Runs on every PR and push to main
- Enforces performance thresholds
- Posts results as PR comments
- Weekly scheduled runs

### Coverage Reporting

- Coverage reports uploaded to CI
- Coverage badges in README
- Trend tracking over time
- Fails PR if coverage drops below threshold

### Quality Gates

PRs must pass:
- ✅ All unit tests
- ✅ Coverage ≥ 80%
- ✅ Accessibility tests (95%+)
- ✅ Performance tests (90%+)
- ✅ Lint checks

## Troubleshooting

### Common Issues

#### Accessibility Test Failures
```bash
# Run specific accessibility test
ng test --include="**/button.component.spec.ts"

# Check specific axe violations
# Review browser console for detailed error messages
```

#### Coverage Threshold Failures
```bash
# Generate detailed coverage report
npm run test:coverage

# View coverage report
open coverage/index.html
```

#### Performance Test Failures
```bash
# Run Lighthouse locally
npm run lhci

# Check performance budget
# Review lighthouse-results/ directory
```

#### Karma Test Issues
```bash
# Clear Karma cache
rm -rf coverage/
npm test

# Check karma configuration
# Verify karma.conf.js settings
```

### Debugging Tips

1. **Use Chrome DevTools**: Debug tests in browser
2. **Check Console Logs**: Look for JavaScript errors
3. **Verify Test Setup**: Ensure proper TestBed configuration
4. **Isolate Issues**: Run single test files to identify problems
5. **Check Dependencies**: Ensure all test dependencies are installed

### Getting Help

- Check existing test files for examples
- Review Angular testing documentation
- Consult accessibility guidelines (WCAG 2.1 AA)
- Reach out to the team for complex issues

## Best Practices

### Writing Tests
1. **Test Behavior, Not Implementation**: Focus on what the component does, not how
2. **Use Descriptive Test Names**: Tests should clearly describe what they verify
3. **Follow AAA Pattern**: Arrange, Act, Assert
4. **Test Edge Cases**: Include disabled, empty, and error states
5. **Keep Tests Independent**: Tests should not depend on each other

### Accessibility Testing
1. **Test All States**: Include disabled, focused, and error states
2. **Keyboard Navigation**: Test all keyboard interactions
3. **Screen Reader Support**: Ensure proper ARIA attributes
4. **Color Contrast**: Verify sufficient color contrast ratios
5. **Focus Management**: Test focus order and indicators

### Performance Testing
1. **Monitor Bundle Size**: Keep JavaScript bundles small
2. **Optimize Images**: Use appropriate image formats and sizes
3. **Lazy Loading**: Implement code splitting where appropriate
4. **Cache Strategies**: Use efficient caching headers
5. **Minimize Render Blocking**: Optimize CSS and JavaScript delivery

---

## Testing Checklist

Before submitting code, ensure:

- [ ] All new components have test files
- [ ] Accessibility tests pass (WCAG 2.1 AA)
- [ ] Coverage is ≥ 80%
- [ ] Performance budgets are met
- [ ] Tests follow AAA pattern
- [ ] Test names are descriptive
- [ ] Edge cases are covered
- [ ] Keyboard navigation works
- [ ] ARIA attributes are correct
- [ ] No console errors in tests

---

**Last Updated**: 2025-10-14
**Maintainer**: Development Team
**Review Schedule**: Quarterly