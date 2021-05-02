import { Engine } from 'excalibur';

export const warehouseGlobals = {
  game: <Engine>{},
  ui: {
    route: <{ html: JQuery; srBay: number; shelf: number } | undefined>undefined,
  },
};
