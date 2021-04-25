import { Color, Engine } from 'excalibur';
import makeTestScene from './testScene';
import { World } from './world';
let w = new World()

const game = new Engine({
  backgroundColor: Color.White,
  viewport: { width: 400, height: 400 },
  suppressConsoleBootMessage: true,
});

const testScene = makeTestScene(game);
game.addScene('testScene', testScene);
game.goToScene('testScene');

// export function to start game.
export default async () => {
  await game.start();
};
