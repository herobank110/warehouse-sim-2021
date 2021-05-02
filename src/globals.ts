import { Engine } from 'excalibur';
import { Forklift } from './actors/forklift2';
import { Shelf, SrBay } from './actors/routeNode';

export const warehouseGlobals = {
  game: {} as Engine,
  ui: {
    route: undefined as { html: JQuery; srBay: number; shelf: number } | undefined,
  },
  world: {
    srBays: [] as SrBay[],
    shelves: [] as Shelf[],
    forklifts: [] as Forklift[],
  },
  score: 0,
  onScoreChanged: () => void 0,
};
