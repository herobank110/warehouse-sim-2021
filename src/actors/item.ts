import { Actor, Engine, Sprite, vec } from 'excalibur';
import {
  Darken,
  Lighten,
  Saturate,
} from 'excalibur/dist/Drawing/SpriteEffects';
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

/** Wraps an item into a gettable thing. */
export class GettableItem extends Actor {
  private isGot_ = false;
  private tickActor?: Actor;

  get isGot() {
    return this.isGot_;
  }

  set isGot(value) {
    this.isGot_ = value;
    if (!this.tickActor) throw new Error('cannot set isGot without tick actor');
    this.tickActor.visible = value;
  }

  constructor(public item: Item) {
    super({ anchor: vec(0, 0) });
    this.add(item);
  }

  onInitialize(engine: Engine) {
    super.onInitialize(engine);
    this.tickActor = new Actor({
      currentDrawing: tickSprite,
      anchor: vec(0, 0),
    });
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
