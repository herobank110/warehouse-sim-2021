import { Actor, Engine, Sprite, Vector } from 'excalibur';
import { R } from '../utils';
import { ITile } from './tile';

export class BasicItem extends Actor implements ITile {
  constructor(private basicItem: { tile: Vector }) {
    super({});
  }

  get tile() {
    return this.basicItem.tile;
  }
}

export class Square extends BasicItem {
  private static readonly spr = new Sprite(R.texture.square, 0, 0, 7, 7);

  onInitialize(engine: Engine) {
    super.onInitialize(engine);
    this.addDrawing(Square.spr);
  }
}
