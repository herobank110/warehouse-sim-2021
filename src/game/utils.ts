import { vec, Vector } from 'excalibur';
import { TileIndex } from './world';

/** Convert to Vector object. Same ref is already a vector. */
export function toVec(vec: TileIndex | Vector) {
  return vec instanceof Vector
    ? vec
    : new Vector(
        ...(vec.toString().split(',').map(Number) as [number, number]),
      );
}

/** @returns top left world pos of tile */
export function tileCoords(tile: TileIndex | Vector) {
  return toVec(tile).clone().scaleEqual(29).addEqual(vec(50, 80));
}
