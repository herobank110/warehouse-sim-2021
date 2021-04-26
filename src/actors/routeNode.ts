import { Actor, Color, Engine, vec, Vector } from 'excalibur';
import { tilePos, zero } from '../utils';
import { ITile } from './tile';

export enum ESide {
  top,
  right,
  bottom,
  left,
}

export class RouteNode extends Actor implements ITile {
  public items = <Actor[]>[];

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

  public get tile() {
    return this.routeNode.tile;
  }

  public get side() {
    return this.routeNode.side;
  }
}

export class SrBay extends RouteNode {
  onInitialize(engine: Engine) {
    super.onInitialize(engine);
    this.color = Color.fromHex('dbc751');
  }
}

export class Shelf extends RouteNode {
  onInitialize(engine: Engine) {
    super.onInitialize(engine);
    this.color = Color.fromHex('afafaf');
  }
}
