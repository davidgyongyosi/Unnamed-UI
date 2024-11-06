
import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import { IconDefinition, ThemeType } from '../types';
import { alreadyHasAThemeSuffix, getNameAndNamespace, isIconDefinition, warn, withSuffix } from '../utils';
import { IconService } from './icon.service';

interface RenderMeta {
  type: string | IconDefinition;
  theme?: ThemeType;
  twoToneColor?: string;
}

function checkMeta(prev: RenderMeta, after: RenderMeta): boolean {
  return prev.type === after.type && prev.theme === after.theme && prev.twoToneColor === after.twoToneColor;
}

@Directive({
  selector: '[nx-icon]'
})
export class IconDirective implements OnChanges {
  @Input() type?: string | IconDefinition;

  @Input() theme?: ThemeType;

  constructor(protected _iconService: IconService, protected _elementRef: ElementRef, protected _renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['type'] || changes['theme']) {
      this._changeIcon();
    }
  }

  protected _changeIcon(): Promise<SVGElement | null> {
    return new Promise<SVGElement | null>(resolve => {
      if (!this.type) {
        this._clearSVGElement();
        resolve(null);
        return;
      } 

      const beforeMeta = this._getSelfRenderMeta();
      this._iconService.getRenderedContent(
        this._parseIconType(this.type, this.theme)
      ).subscribe(svg => {
        const afterMeta = this._getSelfRenderMeta()
        if (checkMeta(beforeMeta, afterMeta)) {
          this._setSVGElement(svg);
          resolve(svg);
        } else {
          resolve(null);
        }
      });
    });
  }

  protected _getSelfRenderMeta(): RenderMeta {
    return {
      type: this.type!,
      theme: this.theme
    };
  }
  
  protected _parseIconType(type: string | IconDefinition, theme?: ThemeType): IconDefinition | string {
    if (isIconDefinition(type)) {
      return type;
    } else {
      const [ name, namespace ] = getNameAndNamespace(type);
      if (namespace) {
        return type;
      }
      if (alreadyHasAThemeSuffix(name)) {
        if (!!theme) {
          warn(`'type' ${name} already gets a theme inside so 'theme' ${theme} would be ignored`);
        }
        return name;
      } else {
        return withSuffix(name, theme || this._iconService.defaultTheme);
      }
    }
  }

  protected _setSVGElement(svg: SVGElement): void {
    this._clearSVGElement();
    this._renderer.appendChild(this._elementRef.nativeElement, svg);
  }

  protected _clearSVGElement(): void {
    const el: HTMLElement = this._elementRef.nativeElement;
    const children = el.childNodes;
    const length = children.length;
    for (let i = length - 1; i >= 0; i--) {
      const child = children[ i ] as any;
      if (child.tagName?.toLowerCase() === 'svg') {
        this._renderer.removeChild(el, child);
      }
    }
  }
}