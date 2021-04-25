import 'excalibur';
import { TileIndex } from '../game/world';

declare module 'excalibur' {
  interface Vector {
    /** Special override for toString as tile */
    toString(): TileIndex;
  }
}

declare module '*.png' {
  const url: string;
  export = url;
}

declare module '*.mp3' {
  const url: string;
  export = url;
}
