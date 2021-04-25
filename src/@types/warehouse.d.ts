import 'excalibur';
import { TileIndex } from '../game/world';

declare module 'excalibur' {
  interface Vector {
    /** Special override for toString as tile */
    toString(): TileIndex;
  }
}
