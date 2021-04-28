import { Color, Texture } from 'excalibur';
// @ts-ignore
import truckUrl from 'url:../../res/truck.png';
// @ts-ignore
import srBayUrl from 'url:../../res/srBay.png';
// @ts-ignore
import squareUrl from 'url:../../res/square.png';
// @ts-ignore
import triangleUrl from 'url:../../res/triangle.png';

export const R = {
  texture: {
    truck: new Texture(truckUrl),
    srBay: new Texture(srBayUrl),
    square: new Texture(squareUrl),
    triangle: new Texture(triangleUrl),
  } as const,
  color: {
    bg: Color.Black,
  } as const,
} as const;
