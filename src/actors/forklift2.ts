import { ActionContext, Actor, Color, vec, Vector } from 'excalibur';
import { warehouseGlobals } from '../globals';
import { Item } from './item';
import { RouteNode, Shelf, SrBay } from './routeNode';
import { routePathMap } from './routePathMap';
import { PickUp } from './truck';

type SrBayIndex = 0 | 1 | 2 | 3;
type ShelfIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type RouteIndexicalSymbol = `srbay${SrBayIndex}_shelf${ShelfIndex}`;

export type RoutePath = Vector[];

enum RouteDirection {
  srBayToShelf,
  shelfToSrBay,
}

type Route = {
  srBay: SrBay;
  shelf: Shelf;
  path: RoutePath;
};

type RouteRunner = Route & {
  direction: RouteDirection;
};

export class Forklift extends Actor {
  private item_?: Item;
  route: RouteRunner;

  constructor(ctor: { route: Route; color: Color }) {
    super({
      width: 8,
      height: 3,
      color: ctor.color, // will this tint textures? just need to store it to draw path lines
    });

    // assignment for typescript to realized its initialized
    this.route = this.initRoute(ctor.route);
  }

  onPostDraw(_ctx: CanvasRenderingContext2D, delta: number) {
    const [begin, ...p2] = this.route.path
      .map(v => v.sub(this.pos)) // ctx is relative to the actor position!
      .map(v => warehouseGlobals.game.worldToScreenCoordinates(v))
      .map(v => v.scale(0.5));
    // .map(v => vec(Math.floor(v.x), Math.floor(v.y)));
    if (!begin || p2.length == 0) throw new Error('path must be at least 2');

    const ctx = document.querySelector('canvas')?.getContext('2d')!;

    ctx.strokeStyle = this.color.toHex();
    // using dashed thin line almost masks the vibration of excalibur
    ctx.lineWidth = 0.3;
    ctx.setLineDash([1, 5])
    ctx.beginPath();
    ctx.moveTo(begin.x, begin.y);
    p2.map(v => ctx.lineTo(v.x, v.y));
    ctx.stroke();
    super.onPostDraw(ctx, delta);
  }

  private initRoute(route: Route) {
    // initially direction is actually srBayToShelf but its like using -1 turn
    // index, it will then be reversed!
    this.route = { ...route, direction: RouteDirection.shelfToSrBay };

    // immediate position at srBay
    this.pos = route.srBay.pos.add(vec(14, 14));

    this.onReachedNode(route.srBay);
    this.mainLoop();

    return this.route;
  }

  private mainLoop() {
    this.actions.clearActions();
    this.followPath(this.actions);
    this.actions.callMethod(() => this.onReachedNode(this.endNode));
  }

  private followPath(actions: ActionContext) {
    const path = [...this.route.path];
    if (this.route.direction == RouteDirection.shelfToSrBay) {
      path.reverse();
    }
    path.map(p => actions.moveTo(p.x, p.y, 10));
  }

  private onReachedNode(node: RouteNode) {
    this.tryUnload(node);
    this.tryLoad(node);
    this.route.direction = 1 - this.route.direction;
    this.mainLoop();
  }

  private tryUnload(node: RouteNode) {
    if (
      this.item &&
      (node instanceof Shelf ||
        (node instanceof SrBay && node.dockedTruck?.canLoadItem(this.item)))
    ) {
      node.pushItem(this.item);
      this.item = undefined;
    }
  }

  private tryLoad(node: RouteNode) {
    const srBay = this.route.srBay;
    if (!this.item) {
      if (node instanceof SrBay) {
        this.item = node.popItem();
      } else if (node instanceof Shelf && srBay.dockedTruck?.purpose instanceof PickUp) {
        // pick an item the truck wants, if any
        this.item = node.popItem(
          node.items.findIndex(item => srBay.dockedTruck?.canLoadItem(item)),
        );
      }
    }
  }

  private static routeSym(srBay: SrBay, shelf: Shelf) {
    const { srBays, shelves } = warehouseGlobals.world;
    const i = srBays.indexOf(srBay);
    const j = shelves.indexOf(shelf);
    if (i != -1 && j != -1) {
      if (i > 3 || j > 7) throw new Error('shelf or srbay out of range');
      return `srbay${i}_shelf${j}` as RouteIndexicalSymbol;
    }
    return undefined;
  }

  static makePath(srBay: SrBay, shelf: Shelf) {
    const sym = this.routeSym(srBay, shelf);
    if (!sym) throw new Error('invalid path nodes');
    return routePathMap[sym];
  }

  get item() {
    return this.item_;
  }

  set item(value) {
    this.item_ = value;
    if (value) {
      value.visible = false;
    }
  }

  private get startNode() {
    return this.route.direction == RouteDirection.srBayToShelf
      ? this.route.srBay
      : this.route.shelf;
  }

  private get endNode() {
    return this.route.direction == RouteDirection.srBayToShelf
      ? this.route.shelf
      : this.route.srBay;
  }
}
