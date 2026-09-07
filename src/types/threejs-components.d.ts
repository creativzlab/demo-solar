declare module "threejs-components/build/cursors/tubes1.min.js" {
  type TubesCursorOptions = {
    bloom?: {
      threshold?: number;
      strength?: number;
      radius?: number;
    };
    tubes?: {
      count?: number;
      minRadius?: number;
      maxRadius?: number;
      colors?: string[];
      lights?: {
        intensity?: number;
        colors?: string[];
      };
    };
  };

  type TubesCursorInstance = {
    dispose: () => void;
    tubes?: {
      setColors: (colors: string[]) => void;
      setLightsColors: (colors: string[]) => void;
    };
  };

  export default function createTubesCursor(
    canvas: HTMLCanvasElement,
    options?: TubesCursorOptions,
  ): TubesCursorInstance;
}
