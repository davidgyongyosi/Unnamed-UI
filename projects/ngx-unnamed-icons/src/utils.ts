import { isDevMode } from '@angular/core';
import { IconDefinition, ThemeType } from './types';

export const NX_ANGULAR_CONSOLE_PREFIX = '[@ngx-unnamed-icons]:';

export function error(message: string): void {
  console.error(`${NX_ANGULAR_CONSOLE_PREFIX} ${message}.`);
}

export function warn(message: string): void {
  if (isDevMode()) {
    console.warn(`${NX_ANGULAR_CONSOLE_PREFIX} ${message}.`);
  }
}

/*export function getSecondaryColor(primaryColor: string): string {
  return primaryColor === 'white' ? 'black' : 'white';
}*/

export function withSuffix(name: string, theme: ThemeType | undefined): string {
  switch (theme) {
    case 'fill': return `${name}_fill`;
    case 'outline': return `${name}_line`;
    case undefined: return name;
    default: throw new Error(`${NX_ANGULAR_CONSOLE_PREFIX}Theme "${theme}" is not a recognized theme!`);
  }
}

export function withSuffixAndColor(name: string, theme: ThemeType): string {
  return `${withSuffix(name, theme)}`;
}

export function mapAbbrToTheme(abbr: string): ThemeType {
  return abbr === 'line' ? 'outline' : abbr as ThemeType;
}

export function alreadyHasAThemeSuffix(name: string): boolean {
  return name.endsWith('_fill') || name.endsWith('_line');
}

export function isIconDefinition(target: string | IconDefinition): target is IconDefinition {
  return (
    typeof target === 'object' &&
    typeof target.name === 'string' &&
    (typeof target.theme === 'string' || target.theme === undefined) &&
    typeof target.icon === 'string'
  );
}

/**
 * Get an `IconDefinition` object from abbreviation type, like `account-book_fill`.
 * @param str
 */
export function getIconDefinitionFromAbbr(str: string): IconDefinition {
  const arr = str.split('-');
  const theme = mapAbbrToTheme(arr.splice(arr.length - 1, 1)[0]);
  const name = arr.join('-');

  return {
    name,
    theme,
    icon: ''
  } as IconDefinition;
}

export function cloneSVG(svg: SVGElement): SVGElement {
  return svg.cloneNode(true) as SVGElement;
}

/**
 * Split a name with namespace in it into a tuple like [ name, namespace ].
 */
export function getNameAndNamespace(type: string): [string, string] {
  const split = type.split(':');
  switch (split.length) {
    case 1: return [type, ''];
    case 2: return [split[1], split[0]];
    default: throw new Error(`${NX_ANGULAR_CONSOLE_PREFIX}The icon type ${type} is not valid!`);
  }
}
