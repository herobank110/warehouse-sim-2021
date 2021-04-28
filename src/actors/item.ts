import { Actor, Engine, Sprite } from 'excalibur';
import { Darken } from 'excalibur/dist/Drawing/SpriteEffects';
import { R } from '../utils';

export type Item = Square | Triangle;

export class BasicItem extends Actor {
  onInitialize(engine: Engine) {
    super.onInitialize(engine);
    this.anchor.setTo(0, 0);
  }
}

/** Item that can be gotten. */
const tickSprite = new Sprite(R.texture.tick, 0, 0, 7, 7);
export class GettableItem extends BasicItem {
  isGot_ = false;
  private tickActor?: Actor;

  get isGot() {
    return this.isGot_;
  }

  set isGot(value) {
    this.isGot_ = value;
    if (!this.tickActor) throw new Error('cannot set isGot without tick actor');
    this.tickActor.visible = value;
    this.currentDrawing.clearEffects();
    this.currentDrawing.addEffect(new Darken(value ? 0 : 0.5));
  }

  onInitialize(engine: Engine) {
    super.onInitialize(engine);
    this.tickActor = new Actor({ currentDrawing: tickSprite });
    this.add(this.tickActor);
    this.isGot = this.isGot_;
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
