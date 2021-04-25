import { Texture } from 'excalibur';
import truckUrl from 'url:../../res/truck.png';
import srBayUrl from 'url:../../res/srBay.png';

export const R = {
  texture: {
    truck: new Texture(truckUrl),
    srBay: new Texture(srBayUrl),
  } as const,
} as const;
