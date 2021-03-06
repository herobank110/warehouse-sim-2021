import { Actor, Color, Engine, GameEvent, vec, Vector } from 'excalibur';
import { randomIntInRange } from 'excalibur/dist/Util';
import { attachActorToActor, R, tilePos, zero } from '../utils';
import { Item } from './item';
import { ITile } from './tile';
import { Truck } from './truck';

export enum ESide {
  top,
  right,
  bottom,
  left,
}

export class BasicRouteNode extends Actor implements ITile {
  // TODO: replace actor with BasicItem
  items: Item[] = [];
  bayTruckCallback?: () => void;

  constructor(private routeNode: { tile: Vector; side: ESide }) {
    super({
      // position in correct place for anchor (0, 0)
      pos: tilePos(routeNode.tile).add(
        vec(
          routeNode.side == ESide.right ? 14 : 0,
          routeNode.side == ESide.bottom ? 14 : 0,
        ),
      ),
      width: [28, 14][routeNode.side % 2],
      height: [14, 28][routeNode.side % 2],
      anchor: zero(),
    });
  }

  /** reposition items based on actor rotation */
  private organizeItems() {
    const offset = vec([8, 0][this.side % 2]!, [0, 8][this.side % 2]!);
    this.items.map((item, i) => {
      attachActorToActor(item, this);
      item.pos = offset.scale(i).add(vec(2, 2));
    });
  }

  /**
   * @param index undefined means last pushed item
   * @returns the removed item, or undefined if empty or index invalid
   */
  popItem(index?: number) {
    index = index ?? this.items.length - 1;
    const item = this.items[index];
    if (item) {
      this.items.splice(index, 1);
      item.visible = false;
      this.organizeItems();
      this.bayTruckCallback?.call(undefined);
    }
    return item;
  }

  pushItem(...items: Actor[]) {
    this.items.push(...items);
    items.map(item => (item.visible = true));
    this.bayTruckCallback?.call(undefined);
    this.organizeItems();
  }

  get tile() {
    return this.routeNode.tile;
  }

  get side() {
    return this.routeNode.side;
  }

  get unlocked() {
    return this.visible;
  }

  set unlocked(value) {
    this.visible = value;
  }
}

export class SrBay extends BasicRouteNode {
  dockedTruck?: Truck;

  onInitialize(engine: Engine) {
    super.onInitialize(engine);
    this.color = Color.fromHex('dbc751');
  }
}

export class Shelf extends BasicRouteNode {
  onInitialize(engine: Engine) {
    super.onInitialize(engine);
    this.color = Color.fromHex('afafaf');
  }
}

export type RouteNode = SrBay | Shelf;
