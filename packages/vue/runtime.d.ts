import type { DefineComponent } from 'vue';

export type IconComponent = DefineComponent<{
    /** Width and height of the rendered svg. Defaults to '1em', so it follows font-size. */
    size?: number | string;
    /** Accessible name. When omitted the icon is aria-hidden. */
    title?: string;
}>;

/** Each path is [d, fillRule?, clipRule?]. */
export declare function createIcon(name: string, paths: [string, string?, string?][]): IconComponent;
