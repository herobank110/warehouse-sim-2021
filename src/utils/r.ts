import { Color, Sound, Texture } from 'excalibur';
// @ts-ignore
import truckUrl from 'url:../../res/truck.png';
// @ts-ignore
import srBayUrl from 'url:../../res/srBay.png';
// @ts-ignore
import squareUrl from 'url:../../res/new/square_sm.png';
// @ts-ignore
import triangleUrl from 'url:../../res/new/triangle_sm.png';
// @ts-ignore
import tickUrl from 'url:../../res/tick.png';
// @ts-ignore
import suitcaseUrl from 'url:../../res/suitcase.png';
// @ts-ignore
import warningUrl from 'url:../../res/warning.png';
// @ts-ignore
import forkliftUrl from 'url:../../res/forklift.png';
// @ts-ignore
import bgUrl from 'url:../../res/bg.png';
// @ts-ignore
import musicUrl from 'url:../../res/music.mp3';

export const R = {
  texture: {
    truck: new Texture(truckUrl),
    srBay: new Texture(srBayUrl),
    square: new Texture(squareUrl),
    triangle: new Texture(triangleUrl),
    tick: new Texture(tickUrl),
    suitcase: new Texture(suitcaseUrl),
    warning: new Texture(warningUrl),
    forklift: new Texture(forkliftUrl),
    bg: new Texture(bgUrl),
  } as const,
  sound: {
    music: new Sound(musicUrl),
  } as const,
  color: {
    bg: Color.White,
    fg: Color.fromHex('afafaf'),
  } as const,
  viewportSize: { width: 400, height: 400 } as const,
  id: {
    routeShelf: 'route-shelf',
    routeSrBay: 'route-srbay',
    hudItemsNext: 'hud-items-next',
    hudItemsNow: 'hud-items-now',
  } as const,
} as const;
