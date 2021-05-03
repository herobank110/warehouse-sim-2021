import {
  Actor,
  EasingFunction,
  EasingFunctions,
  Engine,
  Sprite,
  vec,
  Vector,
} from 'excalibur';
import { warehouseGlobals } from '../globals';
import { R, tilePos, attachActorToActor } from '../utils';
import { GettableItem, Item } from './item';
import { SrBay } from './routeNode';

const truckSprite = new Sprite(R.texture.truck, 0, 0, 59, 15);
const driveTime = 4000;

export type TruckState = PickUp | DropOff;

export class PickUp {
  constructor(
    public pickUp: {
      bay: SrBay;
      items: GettableItem[];
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

/**
 * Trucks are single use!
 * Purpose is given when made
 * And dies once complete.
 */
export class Truck extends Actor {
  private moveTime = -1;
  private moveStartX = 0;
  private moveEndX = 0;
  private moveEasing = EasingFunctions.EaseInCubic;
  private moveCallback = () => {};
  private readonly moveDuration = 4000;

  constructor(public purpose: TruckState) {
    super();
  }

  onInitialize(engine: Engine) {
    super.onInitialize(engine);

    // Now scene reference is set!
    if (this.purpose instanceof DropOff) {
      this.dropOff(this.purpose);
    } else if (this.purpose instanceof PickUp) {
      this.pickUp(this.purpose);
    }

    // assumes loading bays are always at the left of screen
    this.anchor.setTo(1, 0);
    this.addDrawing(truckSprite);
  }

  // drop off

  private dropOff(ctx: DropOff) {
    // not strictly needed as not using excalibur repeat action any more
    if (ctx.dropOff.items.length <= 1)
      throw new Error('attempted truck drop off with one or no items');

    this.organizeItems(ctx.dropOff.items);
    this.arrive(ctx.dropOff.bay, () => this.offload(ctx));
  }

  /** slowly remove items one by one into the current bay.*/
  private offload(ctx: DropOff) {
    const delay = 750;
    ctx.dropOff.items.map((_, i) =>
      setTimeout(() => {
        // pop one item into bay
        const item = ctx.dropOff.items.pop();
        if (!item) throw new Error('truck offload items out of bounds');
        ctx.dropOff.bay.pushItem(item);
        this.organizeItems(ctx.dropOff.items);
      }, i * delay),
    );
    // fails if items has zero or one item
    setTimeout(() => this.depart(ctx.dropOff.bay), ctx.dropOff.items.length * delay);
  }

  // pick up

  private pickUp(ctx: PickUp) {
    this.organizeItems(ctx.pickUp.items);
    return this.arrive(ctx.pickUp.bay, () => {
      this.loadUp(ctx);
      ctx.pickUp.bay.dockedTruck = this;
      ctx.pickUp.bay.bayTruckCallback = () => this.loadUp(ctx);
    });
  }

  private loadUp(ctx: PickUp) {
    // TODO: return early when one item is taken and have a min delay in item taking.
    // copy in case items is mutated, thereby invalidating iterator
    [...ctx.pickUp.bay.items].map(item => this.tryLoadItem(ctx, item));
  }

  public canLoadItem(item: Item) {
    return (
      this.purpose instanceof PickUp &&
      this.purpose.pickUp.items.findIndex(
        it => !it.isGot && it.item.constructor == item.constructor,
      ) != -1
    );
  }

  /** @returns whether the item was loaded */
  private tryLoadItem(ctx: PickUp, item: Item) {
    const i = ctx.pickUp.items.findIndex(
      it => !it.isGot && it.item.constructor == item.constructor,
    );
    if (i == -1) {
      return false;
    }

    // remove previous world representation of item
    ctx.pickUp.bay.popItem(ctx.pickUp.bay.items.indexOf(item));
    // emits an annoying error otherwise about not being in scene
    this.add(item);
    if (item.scene !== null) {
      item.kill();
    }
    // display a tick over the item
    ctx.pickUp.items[i]!.isGot = true;

    if (this.gotAllItems(ctx)) {
      // TODO: do score update just before kill?!?!
      // track score in packages shipped
      warehouseGlobals.score += ctx.pickUp.items.length;
      warehouseGlobals.onScoreChanged();
      ctx.pickUp.bay.dockedTruck = undefined;
      ctx.pickUp.bay.bayTruckCallback = undefined;
      this.depart(ctx.pickUp.bay);
    }
    return true;
  }

  private gotAllItems(ctx: PickUp) {
    for (const item of ctx.pickUp.items) {
      if (!item.isGot) {
        return false;
      }
    }
    return true;
    // return !ctx.pickUp.items.some(item => !item.isGot);
  }

  // helpers

  private arrive(bay: SrBay, fn: () => void) {
    const bayPos = tilePos(bay.tile);
    bayPos.y += 7;
    const begin = bayPos.clone();
    begin.x = 0; // start off screen
    const end = bayPos.add(vec(-4, 0));
    this.drive(begin, end, EasingFunctions.EaseOutCubic, fn);
  }

  private depart(bay: SrBay) {
    const bayPos = tilePos(bay.tile);
    bayPos.y += 7;
    const begin = bayPos.add(vec(-4, 0));
    const end = bayPos.clone();
    end.x = 0; // start off screen

    this.drive(begin, end, EasingFunctions.EaseInCubic, () => this.kill());
  }

  /** add a drive to the action queue. (only moves horizontally) */
  private drive(begin: Vector, end: Vector, easing: EasingFunction, fn: () => void) {
    this.moveTime = 0;
    this.moveCallback = fn;
    this.moveEasing = easing;
    this.pos.setTo(begin.x, begin.y);
    this.moveStartX = begin.x;
    this.moveEndX = end.x;
  }

  onPostUpdate(engine: Engine, delta: number) {
    super.onPostUpdate(engine, delta);

    if (this.moveTime != -1) {
      this.moveTime += delta;
      this.pos.x = this.moveEasing(
        this.moveTime,
        this.moveStartX,
        this.moveEndX,
        this.moveDuration,
      );
      if (Math.abs(this.pos.x - this.moveEndX) < 0.1) {
        this.pos.x = this.moveEndX;
        this.moveTime = -1;
        this.moveCallback();
      }
    }
  }

  private organizeItems(items: Item[]) {
    items.map((item, i) => {
      attachActorToActor(item, this);
      item.pos.setTo(-35 + i * 8, 2);
    });
  }
}
