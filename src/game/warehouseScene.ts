import { Engine, Scene } from 'excalibur';
import { World } from './world';

export default (game: Engine) => {
  const scene = new Scene(game);
  const w = new World();

  return scene;
};
