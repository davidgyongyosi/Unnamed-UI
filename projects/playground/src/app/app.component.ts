import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonComponent } from '../../../ngx-unnamed/src/lib/components/button/button.component';
import { IconDefinition, IconService } from '../../../ngx-unnamed-icons/src/public-api';
import * as AllIcons from '../../../ngx-unnamed-icons/src/assets/public-api';
import { IconModule } from 'ngx-unnamed-icons';
import { HttpClient, HttpClientModule } from '@angular/common/http';


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

  constructor(private iconService: IconService) {
    const allIcons = AllIcons as { [key: string]: IconDefinition };
    this.iconService.addIcon(...Object.keys(allIcons).map(key => allIcons[key]));
  }

}
