import { Color, Engine } from 'excalibur';
import { R } from '../utils';

export default class extends Engine {
  constructor() {
    super({
      backgroundColor: R.color.bg,
      viewport: { width: 400, height: 400 },
      suppressConsoleBootMessage: true,
      antialiasing: false,
    });
  }
}
