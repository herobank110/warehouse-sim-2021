import { Texture } from 'excalibur';
import truckUrl from 'url:../../res/truck.png';

export const R = {
  texture: {
    truck: new Texture(truckUrl),
  } as const,
} as const;
