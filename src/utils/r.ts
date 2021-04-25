import { Texture } from 'excalibur';
import truckUrl from 'url:../../res/truck.png';
import srBayUrl from 'url:../../res/srBay.png';
import squareUrl from 'url:../../res/square.png';
import triangleUrl from 'url:../../res/triangle.png';

export const R = {
  texture: {
    truck: new Texture(truckUrl),
    srBay: new Texture(srBayUrl),
    square: new Texture(squareUrl),
    triangle: new Texture(triangleUrl),
  } as const,
} as const;
