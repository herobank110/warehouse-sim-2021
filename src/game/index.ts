import testScene from './testScene';
import warehouseScene from './warehouseScene';
import Loader from './loader';
import Engine from './engine';

export default async () => {
  const game = new Engine();
  await game.start(new Loader());
  // game.addScene('test', testScene(game));
  // game.goToScene('test');
  game.addScene('warehouse', warehouseScene(game));
  game.goToScene('warehouse');
};
