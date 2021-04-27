import { Actor, EasingFunctions, Engine, Sprite, vec } from 'excalibur';
import { R, tilePos } from '../utils';
import { BasicItem, Item } from './item';
import { SrBay } from './routeNode';

const truckSprite = new Sprite(R.texture.truck, 0, 0, 59, 15);

export class PickUp {
  constructor(
    public pickUp: {
      have: BasicItem[];
      need: BasicItem[];
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
  constructor(purpose: TruckState) {
    super();

    if (purpose instanceof DropOff) {
      this.dropOff(purpose);
    } else if (purpose instanceof PickUp) {
      // TODO: this.pickUp();
    }
  }

  onInitialize(engine: Engine) {
    super.onInitialize(engine);

    // assumes loading bays are always at the left of screen
    this.anchor.setTo(1, 0);
    this.addDrawing(truckSprite);
  }

  private dropOff(ctx: DropOff) {
    const bayPos = tilePos(ctx.dropOff.bay.tile);

    // start off screen
    const begin = bayPos.clone();
    begin.x = 0;
    const end = bayPos.add(vec(-4, 0));

    this.pos = begin;
    this.actions
      .easeTo(end.x, end.y, 4000, EasingFunctions.EaseOutCubic)
      .callMethod(() => this.offload(ctx));
  }

  private offload(ctx: DropOff) {
    // TODO: slowly remove items one by one into the current bay.
  }
}
