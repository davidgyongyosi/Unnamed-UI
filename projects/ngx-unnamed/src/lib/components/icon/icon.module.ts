import { ModuleWithProviders, NgModule } from '@angular/core';
import { IconDefinition } from 'ngx-unnamed-icons';
import { NxIconComponent } from './icon.component';
import { NxIconDirective } from './icon.directive';
import { provideNxIcons } from './provide-icons';

/**
 * Icon module that exports icon component and directive.
 * For standalone usage, import NxIconComponent directly instead.
 *
 * @deprecated Use standalone NxIconComponent instead, or use provideNxIcons() in app config
 */
@NgModule({
    imports: [NxIconDirective, NxIconComponent],
    exports: [NxIconDirective, NxIconComponent],
})
export class NxIconModule {
    static forRoot(icons: IconDefinition[]): ModuleWithProviders<NxIconModule> {
        return {
            ngModule: NxIconModule,
            providers: [provideNxIcons(icons)],
        };
    }
}
