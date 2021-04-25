import { Actor, Vector } from 'excalibur';
import { tileCoords } from '../utils';

enum Side {
  top,
  right,
  bottom,
  left,
}

export class RouteNode extends Actor {
  constructor(private routeNode: { tile: Vector; side: Side }) {
    super({
      // TODO: position in correct place for anchor .5 .5
      pos: tileCoords(routeNode.tile),
      width: [28, 14][routeNode.side % 2],
      height: [14, 28][routeNode.side % 2],
    });
  }

  public get tile() {
    return this.routeNode.tile;
  }

  public get side() {
    return this.routeNode.side;
  }
}
