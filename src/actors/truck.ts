import {
  Actor,
  EasingFunction,
  EasingFunctions,
  Engine,
  Sprite,
  vec,
  Vector,
} from 'excalibur';
import { R, tilePos, attachActorToActor } from '../utils';
import { BasicItem, Item } from './item';
import { SrBay } from './routeNode';

const truckSprite = new Sprite(R.texture.truck, 0, 0, 59, 15);

export class PickUp {
  constructor(
    public pickUp: {
      bay: SrBay;
      need: BasicItem[];
      have: BasicItem[];
    },
  ) {}
}

export class DropOff {
  constructor(
    public dropOff: {
      items: Item[];
      bay: SrBay;
    },
  ) {}
}

export type TruckState = PickUp | DropOff;

/**
 * Trucks are single use!
 * Purpose is given when made
 * And dies once complete.
 */
export class Truck extends Actor {
  constructor(private purpose: TruckState) {
    super();
  }

  onInitialize(engine: Engine) {
    super.onInitialize(engine);

    // Now scene reference is set!
    if (this.purpose instanceof DropOff) {
      this.dropOff(this.purpose);
    } else if (this.purpose instanceof PickUp) {
      // TODO: this.pickUp();
    }

    // assumes loading bays are always at the left of screen
    this.anchor.setTo(1, 0);
    this.addDrawing(truckSprite);
  }

  private dropOff(ctx: DropOff) {
    // not strictly needed as not using excalibur repeat action any more
    if (ctx.dropOff.items.length <= 1)
      throw new Error('attempted truck drop off with one or no items');

    const bayPos = tilePos(ctx.dropOff.bay.tile);
    const begin = bayPos.clone();
    begin.x = 0; // start off screen
    const end = bayPos.add(vec(-4, 0));

    this.organizeItems(ctx.dropOff.items);
    this.drive(begin, end, EasingFunctions.EaseOutCubic);
    this.actions.callMethod(() => this.offload(ctx));
  }

  /** slowly remove items one by one into the current bay.*/
  private offload(ctx: DropOff) {
    const delay = 750;
    ctx.dropOff.items.map((_, i) =>
      setTimeout(() => {
        // pop one item into bay
        const item = ctx.dropOff.items.shift();
        if (!item) throw new Error('truck offload items out of bounds');
        ctx.dropOff.bay.pushItem(item);
        this.organizeItems(ctx.dropOff.items);
      }, i * delay),
    );
    // fails if items has zero or one item
    setTimeout(() => this.depart(ctx), ctx.dropOff.items.length * delay);
  }

  private depart(ctx: DropOff) {
    const bayPos = tilePos(ctx.dropOff.bay.tile);
    const begin = bayPos.add(vec(-4, 0));
    const end = bayPos.clone();
    end.x = 0; // start off screen

    this.drive(begin, end, EasingFunctions.EaseInCubic);
    this.actions.die();
  }

  /** add a drive to the action queue. */
  private drive(begin: Vector, end: Vector, easing: EasingFunction) {
    this.pos.setTo(begin.x, begin.y);
    this.actions.easeTo(end.x, end.y, 4000, easing);
  }

  private organizeItems(items: Item[]) {
    items.map((item, i) => {
      attachActorToActor(item, this);
      item.pos.setTo(-35 + i * 8, 2);
    });
  }
}
