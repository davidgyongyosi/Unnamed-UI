# Input Component

A flexible input directive for `ngx-unnamed` library.

## Features

- ✅ Supports both `<input>` and `<textarea>` elements
- ✅ Multiple size options (small, default, large)
- ✅ Multiple visual variants (outlined, filled, borderless)
- ✅ Status indicators (error, warning, success)
- ✅ Disabled and readonly states
- ✅ Full reactive forms support
- ✅ Standalone directive (modern Angular)
- ✅ Signal-based state management
- ✅ TypeScript strict mode compatible

## Installation

The input directive is part of the `ngx-unnamed` library:

```bash
npm install ngx-unnamed
```

## Usage

### Basic Input

```typescript
import { Component } from '@angular/core';
import { InputDirective } from 'ngx-unnamed';

@Component({
    selector: 'app-example',
    standalone: true,
    imports: [InputDirective],
    template: `
        <input nx-input placeholder="Enter text..." />
    `
})
export class ExampleComponent {}
```

### With Reactive Forms

```typescript
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { InputDirective } from 'ngx-unnamed';

@Component({
    selector: 'app-form-example',
    standalone: true,
    imports: [ReactiveFormsModule, InputDirective],
    template: `
        <input nx-input [formControl]="nameControl" placeholder="Name" />
    `
})
export class FormExampleComponent {
    nameControl = new FormControl('');
}
```

### Size Variants

```html
<!-- Small -->
<input nx-input [nxSize]="'small'" placeholder="Small input" />

<!-- Default -->
<input nx-input placeholder="Default input" />

<!-- Large -->
<input nx-input [nxSize]="'large'" placeholder="Large input" />
```

### Visual Variants

```html
<!-- Outlined (default) -->
<input nx-input [nxVariant]="'outlined'" placeholder="Outlined" />

<!-- Filled -->
<input nx-input [nxVariant]="'filled'" placeholder="Filled" />

<!-- Borderless -->
<input nx-input [nxVariant]="'borderless'" placeholder="Borderless" />
```

### Status Indicators

```html
<!-- Error state -->
<input nx-input [nxStatus]="'error'" placeholder="Error state" />

<!-- Warning state -->
<input nx-input [nxStatus]="'warning'" placeholder="Warning state" />

<!-- Success state -->
<input nx-input [nxStatus]="'success'" placeholder="Success state" />
```

### Textarea

```html
<textarea nx-input placeholder="Enter multiple lines..." rows="4"></textarea>
```

### Disabled and Readonly

```html
<!-- Disabled -->
<input nx-input [disabled]="true" placeholder="Disabled input" />

<!-- Readonly -->
<input nx-input [readonly]="true" value="Readonly value" />
```

## API

### InputDirective

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `nxSize` | `'small' \| 'default' \| 'large'` | `'default'` | Size of the input |
| `nxVariant` | `'outlined' \| 'filled' \| 'borderless'` | `'outlined'` | Visual variant |
| `nxStatus` | `'error' \| 'warning' \| 'success' \| ''` | `''` | Status indicator |
| `disabled` | `boolean` | `false` | Whether the input is disabled |
| `readonly` | `boolean` | `false` | Whether the input is readonly |

### Selector

```
input[nx-input], textarea[nx-input]
```

### Export As

```
nxInput
```

## Styling

The input component uses SCSS and follows the design tokens from your global styles:

- `$primary-color` - Focus border color
- `$secondary-color` - Disabled/readonly background
- `$danger-color` - Error state color
- `$hover-color` - Hover state background

Import the global stylesheet to include input styles:

```scss
@import 'ngx-unnamed/lib/style/global.scss';
```

## Examples

### Login Form

```typescript
@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, InputDirective, ButtonComponent],
    template: `
        <form [formGroup]="loginForm">
            <input
                nx-input
                formControlName="email"
                placeholder="Email"
                [nxStatus]="emailInvalid ? 'error' : ''"
            />
            <input
                nx-input
                type="password"
                formControlName="password"
                placeholder="Password"
                [nxStatus]="passwordInvalid ? 'error' : ''"
            />
            <button nx-button [nxVariant]="'primary'">Login</button>
        </form>
    `
})
export class LoginComponent {
    loginForm = new FormGroup({
        email: new FormControl(''),
        password: new FormControl('')
    });

    get emailInvalid() {
        return this.loginForm.get('email')?.invalid && this.loginForm.get('email')?.touched;
    }

    get passwordInvalid() {
        return this.loginForm.get('password')?.invalid && this.loginForm.get('password')?.touched;
    }
}
```

## Implementation Details

The input component is implemented as a directive following Angular best practices:

- **Standalone**: No NgModule required
- **Signals**: Uses Angular signals for reactive state management
- **Host Bindings**: CSS classes applied via host bindings for optimal performance
- **Forms Integration**: Full support for Angular Reactive Forms with `NgControl`
- **Accessibility**: Proper disabled and readonly attributes
- **ViewEncapsulation.None**: Global styles for easy theming

## Testing

Comprehensive test suite included covering:
- Basic directive functionality
- Size and variant classes
- Disabled and readonly states
- Status indicators
- Reactive forms integration
- Textarea support

Run tests:
```bash
npm test
```

## Browser Support

Follows Angular's browser support policy. Compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
