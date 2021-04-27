import { Actor, Engine, Sprite } from 'excalibur';
import { R } from '../utils';

export type Item = Square | Triangle;

export class BasicItem extends Actor {
  onInitialize(engine: Engine) {
    super.onInitialize(engine);
    this.anchor.setTo(0, 0);
  }
}

const squareSprite = new Sprite(R.texture.square, 0, 0, 7, 7);
export class Square extends BasicItem {
  onInitialize(engine: Engine) {
    super.onInitialize(engine);
    this.addDrawing(squareSprite);
  }
}

const triangleSprite = new Sprite(R.texture.triangle, 0, 0, 7, 7);
export class Triangle extends BasicItem {
  onInitialize(engine: Engine) {
    super.onInitialize(engine);
    this.addDrawing(triangleSprite);
  }
}
