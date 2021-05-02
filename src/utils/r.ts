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
// @ts-ignore
import suitcaseUrl from 'url:../../res/suitcase.png';

export const R = {
  texture: {
    truck: new Texture(truckUrl),
    srBay: new Texture(srBayUrl),
    square: new Texture(squareUrl),
    triangle: new Texture(triangleUrl),
    tick: new Texture(tickUrl),
    suitcase: new Texture(suitcaseUrl),
  } as const,
  color: {
    bg: Color.White,
    fg: Color.fromHex('afafaf'),
  } as const,
  viewportSize: { width: 400, height: 400 } as const,
} as const;
