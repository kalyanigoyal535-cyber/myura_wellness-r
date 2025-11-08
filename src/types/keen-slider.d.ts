declare module 'keen-slider/keen-slider.min.css';

declare module 'keen-slider' {
  export type KeenSliderInstance = {
    prev: () => void;
    next: () => void;
    container: HTMLElement;
    on: (eventName: string, callback: (...args: unknown[]) => void) => void;
    update?: () => void;
    destroy?: () => void;
  };
}

declare module 'keen-slider/react' {
  import { MutableRefObject } from 'react';
  import type { KeenSliderInstance } from 'keen-slider';

  export type KeenSliderOptions = Record<string, unknown>;
  export type KeenSliderPlugin = (slider: KeenSliderInstance) => void;

  export function useKeenSlider<T extends HTMLElement = HTMLElement>(
    options?: KeenSliderOptions,
    plugins?: KeenSliderPlugin[]
  ): [MutableRefObject<T | null>, MutableRefObject<KeenSliderInstance | null>];
}

