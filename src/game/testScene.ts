import { Scene, Engine, Actor, Color, vec, Sprite } from 'excalibur';
import { R } from '../utils';
import { tileCoords, zero } from '../utils/vector';

export default (game: Engine) => {
  // game.input.pointers.primary.on('move', e => {});
  // game.input.pointers.primary.on('down', e => {});

  const scene = new Scene(game);

  const items = [
    new Actor({
      currentDrawing: new Sprite(R.texture.square, 0, 0, 7, 7),
      pos: tileCoords(vec(0, 0)).add(vec(2, 2)),
      anchor: zero(),
    }),
    new Actor({
      currentDrawing: new Sprite(R.texture.square, 0, 0, 7, 7),
      pos: tileCoords(vec(0, 0)).add(vec(2, 10)),
      anchor: zero(),
    }),
    new Actor({
      currentDrawing: new Sprite(R.texture.triangle, 0, 0, 7, 7),
      pos: tileCoords(vec(0, 0)).add(vec(2, 18)),
      anchor: zero(),
    }),
  ];

  const scenery = [
    new Actor({
      pos: tileCoords(vec(0, 0)),
      width: 14,
      height: 28,
      color: Color.fromHex('dbc751'),
      anchor: zero(),
      enableCapturePointer: true,
    }),
    // no depot for now
    // new Actor({
    //   pos: tileCoords(vec(0, 1)),
    //   width: 14,
    //   height: 28,
    //   color: Color.fromHex('51b6db'),
    //   anchor: zero(),
    // }),
    new Actor({
      pos: tileCoords(vec(1, 0)),
      width: 28,
      height: 14,
      color: Color.fromHex('afafaf'),
      anchor: zero(),
    }),
    new Actor({
      pos: tileCoords(vec(1, 1)),
      width: 28,
      height: 14,
      color: Color.fromHex('afafaf'),
      anchor: zero(),
    }),
  ];

  [...scenery, ...items].map(i => scene.add(i));

  scenery[0].on('pointerdown', () => {
    console.log('pointerdown');
  });

  scene.camera.pos.setTo(100, 100);
  scene.camera.zoom(2);

  return scene;
};
