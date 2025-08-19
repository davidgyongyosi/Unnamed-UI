import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AirplaneInFlightOutline, PlusCircleFill } from 'ngx-unnamed-icons';
import { AcornFill, AirplaneInFlightFill, IconModule, IconService } from '../../../ngx-unnamed-icons/src/public-api';
import { ButtonComponent } from '../../../ngx-unnamed/src/lib/components/button/button.component';


@Component({
    selector: 'app-root',
    imports: [RouterOutlet, ButtonComponent, IconModule],
    standalone: true,
    providers: [IconService],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'playground';

  constructor(private _iconService: IconService) {
    this._iconService.addIcon(...[AcornFill, AirplaneInFlightFill, AirplaneInFlightOutline, PlusCircleFill]);
  }

}
