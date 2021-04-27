import { Color, Engine } from 'excalibur';

export default class extends Engine {
  constructor() {
    super({
      backgroundColor: Color.Black,
      viewport: { width: 400, height: 400 },
      suppressConsoleBootMessage: true,
      antialiasing: false,
    });
  }
}
