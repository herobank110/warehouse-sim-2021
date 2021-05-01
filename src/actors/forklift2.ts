import { ActionContext, Actor, Color, Vector } from 'excalibur';
import { ActionQueue } from 'excalibur/dist/Actions/Action';
import { Item } from './item';
import { RouteNode, Shelf, SrBay } from './routeNode';
import { PickUp } from './truck';

type RoutePath = Vector[];

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

  private initRoute(route: Route) {
    // initially direction is actually srBayToShelf but its like using -1 turn
    // index, it will then be reversed!
    this.route = { ...route, direction: RouteDirection.shelfToSrBay };

    // immediate position at srBay
    this.pos = route.srBay.pos.clone();

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
    // this.pos = this.route.path[0];
    path.map(p => actions.moveTo(p.x, p.y, 10));

    // const actions = new ActionContext(this)
    // this.actionQueue.add(actions.moveTo())
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
      } else if (
        node instanceof Shelf &&
        srBay.dockedTruck?.purpose instanceof PickUp
      ) {
        // pick an item the truck wants, if any
        this.item = node.popItem(
          node.items.findIndex(item => srBay.dockedTruck?.canLoadItem(item)),
        );
      }
    }
  }

  static makePath(srBay: SrBay, shelf: Shelf) {
    // simple lerp route
    return [srBay.pos.clone(), shelf.pos.clone()];
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
