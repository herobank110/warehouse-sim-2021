import { Actor, Engine, Sprite } from 'excalibur';
import { R } from '../utils';
import { BasicItem } from './item';

const truckSprite = new Sprite(R.texture.truck, 0, 0, 59, 15);

export class PickUp {
  have: BasicItem[] = [];
  need: BasicItem[] = [];
}

export class DropOff {
  items: BasicItem[] = [];
}

export type TruckState = PickUp | DropOff;

export class Truck extends Actor {
  truckState: TruckState = new PickUp();

  onInitialize(engine: Engine) {
    super.onInitialize(engine);

    this.addDrawing(truckSprite);
  }

  enterLoadingBay() {}
}
