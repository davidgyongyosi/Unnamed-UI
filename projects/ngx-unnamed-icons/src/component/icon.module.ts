import { NgModule } from '@angular/core';
import { NxIconDirective } from './icon.directive';
import { IconService } from './icon.service';

@NgModule({ exports: [NxIconDirective], declarations: [NxIconDirective], providers: [IconService] })
export class IconModule {}
