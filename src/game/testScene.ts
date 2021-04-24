import { Scene, Engine, Actor, Color } from 'excalibur';
export default (game: Engine) => {
  const scene = new Scene(game);
  const srBay = new Actor({
    x: 80,
    y: 80,
    width: 28,
    height: 28,
    color: Color.fromHex('dbc751'),
  });

  scene.add(srBay);
  scene.camera.pos.setTo(100, 100);
  scene.camera.zoom(2);
  return scene;
};
