
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Optional, Renderer2, RendererFactory2, SecurityContext, DOCUMENT } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { of, Observable, Subject } from 'rxjs';
import {
  catchError,
  filter,
  finalize,
  map,
  share,
  take,
  tap
} from 'rxjs/operators';
import {
  CachedIconDefinition,
  IconDefinition,
  ThemeType
} from '../types';
import {
  cloneSVG,
  getIconDefinitionFromAbbr,
  getNameAndNamespace,
  isIconDefinition,
  warn,
  withSuffix,
  withSuffixAndColor
} from '../utils';
import {
  DynamicLoadingTimeoutError,
  HttpModuleNotImport,
  IconNotFoundError,
  NameSpaceIsNotSpecifyError,
  SVGTagNotFoundError,
  UrlNotSafeError
} from './icon.error';

const JSONP_HANDLER_NAME = 'nx_icon_load';
export const NX_ICONS = new InjectionToken<IconDefinition[]>('nx_icons');

@Injectable()
export class IconService {
  defaultTheme: ThemeType = 'outline';
  protected _renderer: Renderer2;
  protected _http: HttpClient | undefined;
  protected readonly _svgDefinitions = new Map<string, IconDefinition>();
  protected readonly _svgRenderedDefinitions = new Map<string, CachedIconDefinition>();
  protected get disableDynamicLoading(): boolean {
    return false;
  }

  protected _inProgressFetches = new Map<
    string,
    Observable<IconDefinition | null>
  >();
  protected _assetsUrlRoot = '';

  private _enableJsonpLoading = false;
  private readonly _jsonpIconLoad$ = new Subject<IconDefinition>();

  constructor(
    protected _rendererFactory: RendererFactory2,
    @Optional() protected _handler: HttpBackend,
    @Optional() @Inject(DOCUMENT) protected _document: any,
    protected sanitizer: DomSanitizer,

    @Optional() @Inject(NX_ICONS) protected _nxIcons: IconDefinition[]
  ) {
    this._renderer = this._rendererFactory.createRenderer(null, null);

    if (this._handler) {
      this._http = new HttpClient(this._handler);
    }

    if (this._nxIcons) {
      this.addIcon(...this._nxIcons);
    }
  }

  useJsonpLoading(): void {
    if (!this._enableJsonpLoading) {
      this._enableJsonpLoading = true;

      (window as any)[JSONP_HANDLER_NAME] = (icon: IconDefinition) => {
        this._jsonpIconLoad$.next(icon);
      };
    } else {
      warn('You are already using jsonp loading.');
    }
  }

  changeAssetsSource(prefix: string): void {
    this._assetsUrlRoot = prefix.endsWith('/') ? prefix : prefix + '/';
  }

  addIcon(...icons: IconDefinition[]): void {
    icons.forEach(icon => {
      this._svgDefinitions.set(withSuffix(icon.name, icon.theme), icon);
    });
  }

  addIconLiteral(type: string, literal: string): void {
    const [_, namespace] = getNameAndNamespace(type);
    if (!namespace) {
      throw NameSpaceIsNotSpecifyError();
    }
    this.addIcon({ name: type, icon: literal });
  }

  clear(): void {
    this._svgDefinitions.clear();
    this._svgRenderedDefinitions.clear();
  }

  getRenderedContent(
    icon: IconDefinition | string
  ): Observable<SVGElement> {
    const definition: IconDefinition | null = isIconDefinition(icon)
      ? (icon as IconDefinition)
      : this._svgDefinitions.get(icon) || null;
    
    if (!definition && this.disableDynamicLoading) {
      throw IconNotFoundError(icon as string);
    }

    const $iconDefinition = definition
      ? of(definition)
      : this._loadIconDynamically(icon as string);

    return $iconDefinition.pipe(
      map(i => {
        if (!i) {
          throw IconNotFoundError(icon as string);
        }
        return this._loadSVGFromCacheOrCreateNew(i);
      })
    );
  }

  getCachedIcons(): Map<string, IconDefinition> {
    return this._svgDefinitions;
  }

  protected _loadIconDynamically(
    type: string
  ): Observable<IconDefinition | null> {
    if (!this._http && !this._enableJsonpLoading) {
      return of(HttpModuleNotImport());
    }
    let inProgress = this._inProgressFetches.get(type);

    if (!inProgress) {
      const [name, namespace] = getNameAndNamespace(type);
      const icon: IconDefinition = namespace
        ? { name: type, icon: '' }
        : getIconDefinitionFromAbbr(name);

      const suffix = this._enableJsonpLoading ? '.js' : '.svg';
      const url =
        (namespace
          ? `${this._assetsUrlRoot}assets/${namespace}/${name}`
          : `${this._assetsUrlRoot}assets/${icon.theme}/${icon.name}`) + suffix;

      const safeUrl = this.sanitizer.sanitize(SecurityContext.URL, url);

      if (!safeUrl) {
        throw UrlNotSafeError(url);
      }

      const source = !this._enableJsonpLoading
        ? this._http!
            .get(safeUrl, { responseType: 'text' })
            .pipe(map(literal => ({ ...icon, icon: literal })))
        : this._loadIconDynamicallyWithJsonp(icon, safeUrl);

      inProgress = source.pipe(
        tap(definition => this.addIcon(definition)),
        finalize(() => this._inProgressFetches.delete(type)),
        catchError(() => of(null)),
        share()
      );

      this._inProgressFetches.set(type, inProgress);
    }

    return inProgress;
  }

  protected _loadIconDynamicallyWithJsonp(icon: IconDefinition, url: string): Observable<IconDefinition> {
    return new Observable<IconDefinition>(subscriber => {
      const loader = this._document.createElement('script');
      const timer = setTimeout(() => {
        clean();
        subscriber.error(DynamicLoadingTimeoutError());
      }, 6000);

      loader.src = url;

      function clean(): void {
        loader.parentNode.removeChild(loader);
        clearTimeout(timer);
      }

      this._document.body.appendChild(loader);
      this._jsonpIconLoad$
          .pipe(
              filter(i => i.name === icon.name && i.theme === icon.theme),
              take(1)
          )
          .subscribe(i => {
            subscriber.next(i);
            clean();
          });
    });
  }

  protected _loadSVGFromCacheOrCreateNew(
    icon: IconDefinition
  ): SVGElement {
    let svg: SVGElement;
    const key =
      icon.theme === 'outline'
        ? withSuffixAndColor(icon.name, icon.theme)
        : icon.theme === undefined
        ? icon.name
        : withSuffix(icon.name, icon.theme);

    const cached = this._svgRenderedDefinitions.get(key);

    if (cached) {
      svg = cached.icon;
    } else {
      svg = this._setSVGAttribute(
          this._createSVGElementFromString(
            icon.icon
          )
      );
      this._svgRenderedDefinitions.set(key, {
        ...icon,
        icon: svg
      } as CachedIconDefinition);
    }

    return cloneSVG(svg);
  }

  protected _createSVGElementFromString(str: string): SVGElement {
    const div = this._document.createElement('div');
    div.innerHTML = str;
    const svg: SVGElement = div.querySelector('svg');
    if (!svg) {
      throw SVGTagNotFoundError;
    }
    return svg;
  }

  protected _setSVGAttribute(svg: SVGElement): SVGElement {
    this._renderer.setAttribute(svg, 'width', '1.2em');
    this._renderer.setAttribute(svg, 'height', '1.2em');
    return svg;
  }
}