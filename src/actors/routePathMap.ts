import { vec } from 'excalibur';
import { tilePos } from '../utils';
import { RouteIndexicalSymbol, RoutePath } from './forklift2';

export const routePathMap: Record<RouteIndexicalSymbol, RoutePath> = {
  srbay0_shelf0: [
    tilePos(vec(0, 0), 'center'),
    tilePos(vec(0, 0), 'cr'),
    tilePos(vec(0, 0), 'cbr'),
    tilePos(vec(1, 0), 'cb'),
    tilePos(vec(1, 0), 'center'),
  ],
  srbay0_shelf1: [
    tilePos(vec(0, 0), 'center'),
    tilePos(vec(0, 0), 'cr'),
    tilePos(vec(0, 1), 'cbr'),
    tilePos(vec(1, 1), 'cb'),
    tilePos(vec(1, 1), 'center'),
  ],
  // TODO: rest of them
  //   srbay0_shelf2: [
  //     tilePos(vec(0, 0), 'center'),
  //     tilePos(vec(0, 0), 'cr'),
  //     tilePos(vec(0, 2), 'cbr'),
  //     tilePos(vec(1, 2), 'cb'),
  //     tilePos(vec(1, 2), 'center'),
  //   ],
} as const;
