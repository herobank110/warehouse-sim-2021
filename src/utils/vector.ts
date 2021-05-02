import { vec, Vector } from 'excalibur';
import { TileIndex } from '../game/world';

/** Convert to Vector object. Same ref is already a vector. */
export function toVec(tile: TileIndex | Vector) {
  return typeof tile == 'string'
    ? vec(
        ...(tile.toString().replace('(', '').replace(')', '').split(',').map(Number) as [
          number,
          number,
        ]),
      )
    : tile;
}

type TileAnchor =
  | 'center'
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'tl'
  | 'tr'
  | 'bl'
  | 'br'
  | 'ct'
  | 'cl'
  | 'cb'
  | 'cr'
  | 'ctr'
  | 'ctl'
  | 'cbr'
  | 'cbl';

/** @returns top left world pos of tile */
export function tilePos(tile: TileIndex | Vector, anchor: TileAnchor = 'tl') {
  const ret = toVec(tile).clone().scaleEqual(29).addEqual(vec(70, 50));
  ret.addEqual(
    {
      center: vec(14, 14),
      top: vec(0, 14),
      bottom: vec(0, 28),
      left: vec(0, 14),
      right: vec(28, 14),
      tl: vec(0, 0),
      tr: vec(28, 0),
      bl: vec(0, 28),
      br: vec(28, 28),
      ct: vec(14, 7),
      cb: vec(14, 21),
      cr: vec(21, 14),
      cl: vec(7, 21),
      ctl: vec(7, 7),
      ctr: vec(21, 7),
      cbl: vec(7, 21),
      cbr: vec(21, 21),
    }[anchor]!,
  );
  return ret;
}

export const zero = () => vec(0, 0);
