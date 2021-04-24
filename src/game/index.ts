import { Actor, Color, Engine, vec } from 'excalibur';

const game = new Engine({
  backgroundColor: Color.White,
  viewport: { width: 400, height: 400 },
  suppressConsoleBootMessage: true,
});

const srBay = new Actor({
  x: 80,
  y: 80,
  width: 28,
  height: 28,
  color: Color.fromHex('dbc751'),
});

game.add(srBay);
game.currentScene.camera.pos.setTo(100, 100);
game.currentScene.camera.zoom(2);

// export function to start game.
export default async () => {
  await game.start();
  game.canvas.style.border = 'solid 1px #ccc';
  game.canvas.style.borderRadius = '4px';
};
