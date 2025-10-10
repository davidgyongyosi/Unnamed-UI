import { Component, Input, ViewEncapsulation } from '@angular/core';
import { IconDefinition, ThemeType } from '../types';
import { NxIconDirective } from './icon.directive';

/**
 * Icon component that wraps the NxIconDirective for easier usage.
 * This is a standalone component that can be used directly without imports.
 *
 * @example
 * ```typescript
 * import { NxIconComponent } from 'ngx-unnamed-icons';
 * import { HeartStraightOutline } from 'ngx-unnamed-icons';
 *
 * @Component({
 *   template: `<nx-icon [type]="HeartStraightOutline" />`
 * })
 * export class MyComponent {
 *   HeartStraightOutline = HeartStraightOutline;
 * }
 * ```
 */
@Component({
    selector: 'nx-icon',
    standalone: true,
    imports: [NxIconDirective],
    template: `<span nxIcon [type]="type" [theme]="theme"></span>`,
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'nx-icon',
    },
})
export class NxIconComponent {
    /**
     * Icon type - can be a string name or IconDefinition object
     */
    @Input() type?: string | IconDefinition;

    /**
     * Icon theme - outline, fill, or twotone
     */
    @Input() theme?: ThemeType;
}
