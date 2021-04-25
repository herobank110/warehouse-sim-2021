import { Actor, Color, Engine, Scene, Sprite, vec } from 'excalibur';
import { R, tileCoords, zero } from '../utils';
import { World } from './world';

export default (game: Engine) => {
  const scene = new Scene(game);
  const w = new World();

  const a = new Actor({
    pos: tileCoords('(0, 0)'),
    currentDrawing: new Sprite(R.texture.srBay, 0, 0, 28, 28),
    width: 28,
    height: 28,
    color: Color.Red,
    anchor: zero(),
  });
  scene.add(a);

  w.tiles['(0, 0)'] = {
    actor: a,
  };

  scene.camera.pos.setTo(100, 100);
  scene.camera.zoom(2);

  return scene;
};
