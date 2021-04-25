import { Color, Engine } from 'excalibur';
import testScene from './testScene';
import warehouseScene from './warehouseScene';

const game = new Engine({
  backgroundColor: Color.White,
  viewport: { width: 400, height: 400 },
  suppressConsoleBootMessage: true,
});

game.addScene('test', testScene(game));
game.addScene('warehouse', warehouseScene(game));
game.goToScene('warehouse');

// export function to start game.
export default async () => {
  await game.start();
};
