import { Actor, Color, Engine, Scene, Sprite, vec } from 'excalibur';
import { R, tilePos, zero } from '../utils';
import { World } from './world';

export default (game: Engine) => {
  const scene = new Scene(game);
  const w = new World();

  const a = new Actor({
    pos: tilePos(vec(0, 0)),
    currentDrawing: new Sprite(R.texture.srBay, 0, 0, 28, 28),
    width: 14,
    height: 28,
    anchor: zero(),
  });

  w.tiles['(0, 0)'] = {
    actor: a,
  };

  scene.camera.pos.setTo(100, 100);
  scene.camera.zoom(2);

  return scene;
};
