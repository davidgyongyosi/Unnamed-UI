# Contributing to Unnamed UI

Thank you for your interest in contributing to Unnamed UI! This document provides guidelines for contributing to the project.

## Documentation Standards

This section specifically covers documentation requirements and standards for components.

### When to Create Stories vs MDX

**Component Stories (.stories.ts):**
- Required for all new components
- Use when: Component has interactive props, multiple states, or variations
- Focus on: Interactive examples and prop controls
- Auto-generated from component interface

**MDX Documentation (.mdx):**
- Required for complex components with extensive usage patterns
- Use when: Component needs detailed explanations, examples, or complex documentation
- Focus on: Comprehensive documentation, use cases, accessibility, best practices
- Manual creation for rich documentation content

### Required Documentation Sections

All component documentation must include the following sections:

#### 1. Overview
- Brief description of the component's purpose
- Primary use cases and functionality
- Key features and capabilities

#### 2. When to Use
- Specific scenarios where the component is appropriate
- Common use cases and patterns
- Integration examples

#### 3. When Not to Use
- Scenarios where alternative components would be better
- Anti-patterns and common mistakes
- Alternatives to consider

#### 4. Accessibility
- ARIA attributes and roles
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Focus management

#### 5. Best Practices
- Usage guidelines and patterns
- Performance considerations
- Styling recommendations
- Common pitfalls to avoid

#### 6. Examples
- Basic usage examples
- Advanced use cases
- Integration patterns
- Real-world scenarios

#### 7. API Reference
- Complete props documentation
- Event handlers
- Public methods
- TypeScript interfaces

#### 8. Related Components
- Links to related components
- Usage in component combinations
- Alternative components

### Code Example Format and Style

#### TypeScript Stories Format

```typescript
import type { Meta, StoryObj } from '@storybook/angular';
import { YourComponent } from './your.component';

const meta: Meta<YourComponent> = {
  title: 'Components/YourComponent',
  component: YourComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Brief component description here...',
      },
    },
  },
  argTypes: {
    // Define interactive props here
    exampleProp: {
      control: 'text',
      description: 'Description of this prop',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<YourComponent>;

/**
 * Default state of the component
 */
export const Default: Story = {
  args: {},
};
```

#### MDX Documentation Format

```markdown
import { Meta, Story, Canvas, ArgsTable } from '@storybook/blocks';
import { YOUR_COMPONENT } from './your-component.stories';

<Meta title="Components/YourComponent Documentation" of={YOUR_COMPONENT} />

# Component Name

## Overview

Description here...

## Examples

<Canvas>
  <Story of={YOUR_COMPONENT} name="Default" />
</Canvas>

## API Reference

<ArgsTable of={YOUR_COMPONENT} />
```

### Documentation Review Process

1. **Self-Review**: Before submitting, ensure your documentation follows all standards
2. **Peer Review**: Another team member reviews the documentation for clarity and completeness
3. **Accessibility Review**: Verify all accessibility requirements are documented
4. **Testing**: Verify all examples work correctly and are accessible
5. **Final Approval**: Documentation is approved and merged

### Quality Standards

#### Content Quality
- ✅ Clear, concise, and accurate descriptions
- ✅ Real-world examples and use cases
- ✅ Complete API documentation
- ✅ Accessibility guidelines
- ✅ Best practices and recommendations

#### Technical Quality
- ✅ All examples compile and run without errors
- ✅ Interactive controls are functional
- ✅ Code follows project style guidelines
- ✅ TypeScript interfaces are properly documented
- ✅ Component props are fully documented

#### Accessibility Quality
- ✅ Keyboard navigation documented
- ✅ Screen reader support explained
- ✅ ARIA attributes specified
- ✅ Color contrast compliance noted
- ✅ Focus management described

### Documentation Templates

Use the provided templates in `.storybook/templates/`:

- `component.stories.ts` - Basic component story template
- `component.mdx` - MDX documentation template
- `argtypes-pattern.ts` - Standard argTypes configuration

### File Organization

```
projects/ngx-unnamed/src/lib/components/
├── your-component/
│   ├── your.component.ts
│   ├── your.component.html
│   ├── your.component.scss
│   ├── your.component.spec.ts
│   ├── your.component.stories.ts
│   └── your.component.mdx
```

### Required Properties for Stories

All component stories must include:

1. **Title**: Following the pattern `Components/ComponentName`
2. **Component**: Reference to the component class
3. **Parameters**: Including layout and description
4. **ArgTypes**: For all interactive props
5. **Tags**: Including `['autodocs']`
6. **Default Story**: Showing the basic usage

### Required Properties for MDX

All MDX documentation must include:

1. **Meta Block**: With title and component reference
2. **Overview Section**: Component description and purpose
3. **Examples Section**: With Canvas and Story blocks
4. **API Reference**: Using ArgsTable block
5. **Accessibility Section**: Accessibility information
6. **Best Practices**: Usage guidelines

### Interactive Controls

All interactive props should have:

- ✅ Control type (select, text, boolean, number)
- ✅ Description of the prop
- ✅ Default value specified
- ✅ Options for select controls
- ✅ Proper type definitions

### Testing Documentation

- Verify all stories render correctly
- Test interactive controls functionality
- Check accessibility compliance
- Validate code examples
- Ensure links work correctly

### Common Documentation Mistakes to Avoid

❌ Missing descriptions for props
❌ Incomplete accessibility information
❌ Non-functional examples
❌ Missing best practices
❌ Inconsistent formatting
❌ Broken links or references
❌ Missing use cases
❌ Unclear component purpose

### Resources for Documentation

- [Storybook Documentation](https://storybook.js.org/)
- [Compodoc Documentation](https://compodoc.app/)
- [Angular Style Guide](https://angular.io/guide/styleguide)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Getting Help with Documentation

If you need help with documentation:

1. Check existing component examples in the codebase
2. Review the templates in `.storybook/templates/`
3. Consult this style guide
4. Ask questions in GitHub discussions
5. Request a documentation review

---

Thank you for following these documentation standards! High-quality documentation helps make Unnamed UI accessible and easy to use for everyone.