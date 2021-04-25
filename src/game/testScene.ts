import { Scene, Engine, Actor, Color, Label, vec, TextAlign } from 'excalibur';

const Zero = () => vec(0, 0);

export default (game: Engine) => {
  const scene = new Scene(game);
  [
    new Actor({
      x: 80,
      y: 80,
      width: 14,
      height: 28,
      color: Color.fromHex('dbc751'),
      anchor: Zero()
    }),
    // new Label({ text: 'S&R', x: 80, y: 80, textAlign: TextAlign.Center }),
    // new Label({ text: 'bay', x: 80, y: 90, textAlign: TextAlign.Center }),
    new Actor({
      x: 80,
      y: 109,
      width: 14,
      height: 28,
      color: Color.fromHex('51b6db'),
      anchor: Zero()
    }),
    // new Label({ text: 'de', x: 80, y: 109, textAlign: TextAlign.Center }),
    // new Label({ text: 'pot', x: 80, y: 119, textAlign: TextAlign.Center }),
    new Actor({
      x: 109,
      y: 80,
      width: 28,
      height: 14,
      color: Color.fromHex('afafaf'),
      anchor: Zero()
    }),
    new Actor({
      x: 109,
      y: 109,
      width: 28,
      height: 14,
      color: Color.fromHex('afafaf'),
      anchor: Zero()
    }),
    // new Label({ text: 'de', x: 80, y: 109, textAlign: TextAlign.Center }),
    // new Label({ text: 'pot', x: 80, y: 119, textAlign: TextAlign.Center }),
  ].map(s => scene.add(s));

  scene.camera.pos.setTo(100, 100);
  scene.camera.zoom(2);

  return scene;
};
