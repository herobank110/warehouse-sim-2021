import { vec, Vector } from 'excalibur';
import { toVec } from './utils';

export type Tile = {};
export type TileIndexImpl = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
export type TileIndex = `(${TileIndexImpl}, ${TileIndexImpl})`;

export class World {
  public tiles = <Record<TileIndex, Tile | undefined>>{};
  public units = <Record<TileIndex, Tile | undefined>>{};
}
