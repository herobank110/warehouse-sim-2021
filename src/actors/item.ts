import { Actor, Engine, Sprite } from 'excalibur';
import { R } from '../utils';

export class BasicItem extends Actor {
  onInitialize(engine: Engine) {
    super.onInitialize(engine);
    this.anchor.setTo(0, 0);
  }
}

export type Item = Square | Triangle;

export class Square extends BasicItem {
  private static readonly sprite = new Sprite(R.texture.square, 0, 0, 7, 7);

  onInitialize(engine: Engine) {
    super.onInitialize(engine);
    this.addDrawing(Square.sprite);
  }
}

export class Triangle extends BasicItem {
  private static readonly sprite = new Sprite(R.texture.triangle, 0, 0, 7, 7);

  onInitialize(engine: Engine) {
    super.onInitialize(engine);
    this.addDrawing(Triangle.sprite);
  }
}
