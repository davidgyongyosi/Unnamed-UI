export interface IconDefinition {
  name: string; // kebab-case-style
  theme?: ThemeType | undefined;
  icon: string;
}

// svg folder names
export type ThemeType = 'fill' | 'outline';

export interface Manifest {
  fill: string[];
  outline: string[];
}

export interface CachedIconDefinition {
  name: string;
  theme: string;
  icon: SVGElement;
}
