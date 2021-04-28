import { Color, Texture } from 'excalibur';
// @ts-ignore
import truckUrl from 'url:../../res/truck.png';
// @ts-ignore
import srBayUrl from 'url:../../res/srBay.png';
// @ts-ignore
import squareUrl from 'url:../../res/square.png';
// @ts-ignore
import triangleUrl from 'url:../../res/triangle.png';
// @ts-ignore
import tickUrl from 'url:../../res/tick.png';

export const R = {
  texture: {
    truck: new Texture(truckUrl),
    srBay: new Texture(srBayUrl),
    square: new Texture(squareUrl),
    triangle: new Texture(triangleUrl),
    tick: new Texture(tickUrl),
  } as const,
  color: {
    bg: Color.White,
    fg: Color.fromHex('afafaf'),
  } as const,
} as const;
