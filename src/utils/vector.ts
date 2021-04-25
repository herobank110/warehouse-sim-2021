import { vec, Vector } from 'excalibur';
import { TileIndex } from '../game/world';

/** Convert to Vector object. Same ref is already a vector. */
export function toVec(tile: TileIndex | Vector) {
  return typeof tile == 'string'
    ? vec(...(tile.toString().split(',').map(Number) as [number, number]))
    : tile;
}

/** @returns top left world pos of tile */
export function tileCoords(tile: TileIndex | Vector) {
  return toVec(tile).clone().scaleEqual(29).addEqual(vec(70, 50));
}

export const Zero = () => vec(0, 0);
