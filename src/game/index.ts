import { Color, Engine } from 'excalibur';
import testScene from './testScene';
import warehouseScene from './warehouseScene';
import Loader from './loader';

const game = new Engine({
  backgroundColor: Color.White,
  viewport: { width: 400, height: 400 },
  suppressConsoleBootMessage: true,
});

// export function to start game.
export default async () => {
  await game.start(new Loader());
  game.addScene('test', testScene(game));
  game.addScene('warehouse', warehouseScene(game));
  game.goToScene('warehouse');
};
