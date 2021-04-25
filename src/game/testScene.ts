import { Scene, Engine, Actor, Color, Label, vec, TextAlign } from 'excalibur';
import { tileCoords, zero } from '../utils/vector';

export default (game: Engine) => {
  game.input.pointers
    .at(0)
    .on('move', e => console.log('Mouse move to world pos ' + e.worldPos));
  game.input.pointers
    .at(0)
    .on('down', e => console.log(e.button + ' mouse button down'));

  const scene = new Scene(game);
  [
    new Actor({
      pos: tileCoords(vec(0, 0)),
      width: 14,
      height: 28,
      color: Color.fromHex('dbc751'),
      anchor: zero(),
    }),
    new Actor({
      pos: tileCoords(vec(0, 1)),
      width: 14,
      height: 28,
      color: Color.fromHex('51b6db'),
      anchor: zero(),
    }),
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
  ].map(s => scene.add(s));

  scene.camera.pos.setTo(100, 100);
  scene.camera.zoom(2);

  return scene;
};
