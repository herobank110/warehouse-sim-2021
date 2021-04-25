import {
  Scene,
  Engine,
  Actor,
  Color,
  Label,
  vec,
  TextAlign,
  Sprite,
} from 'excalibur';
import { R } from '../utils';
import { tileCoords, zero } from '../utils/vector';

export default (game: Engine) => {
  game.input.pointers
    .at(0)
    .on('move', e => console.log('Mouse move to world pos ' + e.worldPos));
  game.input.pointers
    .at(0)
    .on('down', e => console.log(e.button + ' mouse button down'));

  const scene = new Scene(game);

  const it1 = new Actor({
    currentDrawing: new Sprite(R.texture.square, 0, 0, 7, 7),
    pos: tileCoords(vec(0, 0)).add(vec(2, 2)),
    anchor: zero(),
  });
  const it2 = new Actor({
    currentDrawing: new Sprite(R.texture.square, 0, 0, 7, 7),
    pos: tileCoords(vec(0, 0)).add(vec(2, 10)),
    anchor: zero(),
  });
  const it3 = new Actor({
    currentDrawing: new Sprite(R.texture.triangle, 0, 0, 7, 7),
    pos: tileCoords(vec(0, 0)).add(vec(2, 18)),
    anchor: zero(),
  });
  const items = [it1, it2, it3];

  const scenery = [
    new Actor({
      pos: tileCoords(vec(0, 0)),
      width: 14,
      height: 28,
      color: Color.fromHex('dbc751'),
      anchor: zero(),
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

  scene.camera.pos.setTo(100, 100);
  scene.camera.zoom(2);

  return scene;
};
