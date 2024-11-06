<h1 align="center">
Unnamed UI Icons for Angular
</h1>

<div align="center">

[![NPM version](https://img.shields.io/npm/v/ngx-unnamed-icons.svg?style=flat)](https://www.npmjs.com/package/ngx-unnamed-icons)
[![NPM downloads](https://img.shields.io/npm/dm/ngx-unnamed-icons.svg?style=flat)](https://www.npmjs.com/package/ngx-unnamed-icons)

</div>

## Installation

```bash
ng add ngx-unnamed-icons

# or npm install ngx-unnamed-icons
```

## Usage

You should import `IconModule` in your application's root module.

```ts
import { IconModule } from 'ngx-unnamed-icons';

@NgModule({
  imports: [
    IconModule
  ]
})
export class AppModule { }
```

And register the icons that you need to `IconService` (all or explicitly, we call it **static loading**):

> ATTENTION! We strongly suggest you not to register all icons. That would increase your bundle's size dramatically.

```ts
import { Component, OnInit } from '@angular/core';
import { IconDefinition, IconService } from 'ngx-unnamed-icons';
import { AcornFill } from 'ngx-unnamed-icons/icons'
// import * as AllIcons from 'ant-icons-angular/icons';

@Component({
  selector   : 'app-root',
  templateUrl: './app.component.html',
  styleUrls  : ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private _iconService: IconService) {
    // Import all. NOT RECOMMENDED. ❌
    // const allIcons = AllIcons as {
      // [key: string]: IconDefinition;
    // };
    // this._iconService.addIcon(...Object.keys(allIcons).map(key => allIcons[key]));
    // Import what you need! ✔️
    this._iconService.addIcon(...[ AcornFill ]);
  }
}
```

When you want to render an icon:

```html
<span nxIcon type="acorn" theme="fill"></span>
```



## Development

You can find the source code [here](https://github.com/davidgyongyosi/Unnamed-UI/tree/main/projects/ngx-unnamed-icons).

> DISCLAIMER! The icons used in this pack is not my work, you can find the icons use [here](https://phosphoricons.com/?weight=%22thin%22&q=%22%22&size=96)