import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { IconDefinition } from '../types';
import { NX_ICONS } from './icon.service';

/**
 * Provide icon definitions for NxIcon in root application.
 * Use this in your app.config.ts or main.ts to register icons globally.
 *
 * @param icons Icon definitions to register
 * @returns Environment providers for icon registration
 *
 * @example
 * ```typescript
 * // In app.config.ts
 * import { provideNxIcons } from 'ngx-unnamed-icons';
 * import { HeartStraightOutline, GearOutline } from 'ngx-unnamed-icons';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideNxIcons([HeartStraightOutline, GearOutline])
 *   ]
 * };
 * ```
 */
export function provideNxIcons(icons: IconDefinition[]): EnvironmentProviders {
    return makeEnvironmentProviders([
        {
            provide: NX_ICONS,
            useValue: icons,
        },
    ]);
}
