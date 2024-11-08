import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonComponent } from '../../../ngx-unnamed/src/lib/components/button/button.component';
import { AcornFill, AirplaneInFlightFill, IconModule, IconService } from '../../../ngx-unnamed-icons/src/public-api';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AirplaneInFlightOutline, PlusCircleFill } from 'ngx-unnamed-icons';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonComponent, IconModule, HttpClientModule],
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
