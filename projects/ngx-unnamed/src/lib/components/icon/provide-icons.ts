import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { IconDefinition } from 'ngx-unnamed-icons';
import { NX_ICONS } from './icon.service';

/**
 * Provide icon definitions for NzIcon in root
 *
 * @param icons Icon definitions
 */
export const provideNxIcons = (icons: IconDefinition[]): EnvironmentProviders => {
    return makeEnvironmentProviders([
        {
            provide: NX_ICONS,
            useValue: icons,
        },
    ]);
};
