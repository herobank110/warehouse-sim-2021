import { Engine } from 'excalibur';
import { R } from '../utils';

export default class extends Engine {
  constructor() {
    super({
      backgroundColor: R.color.bg,
      viewport: R.viewportSize,
      suppressConsoleBootMessage: true,
      antialiasing: false,
    });
  }
}
