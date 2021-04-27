import { Actor, Color, Engine, vec, Vector } from 'excalibur';
import { tilePos, zero } from '../utils';
import { ITile } from './tile';

export enum ESide {
  top,
  right,
  bottom,
  left,
}

export class BasicRouteNode extends Actor implements ITile {
  items = <Actor[]>[];

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

  get tile() {
    return this.routeNode.tile;
  }

  get side() {
    return this.routeNode.side;
  }

  /** reposition items based on actor rotation */
  organizeItems() {
    const offset = vec([8, 0][this.side % 2], [0, 8][this.side % 2]);
    this.items.map((item, i) => {
      item.pos = this.pos.add(vec(2, 2)).add(offset.scale(i));
    });
  }

  popItem() {
    const item = this.items.shift();
    if (item) {
      item.visible = false;
      this.organizeItems();
    }
    return item;
  }

  pushItem(item: Actor) {
    this.items.push(item);
    item.visible = true;
    this.organizeItems();
  }
}

export class SrBay extends BasicRouteNode {
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
