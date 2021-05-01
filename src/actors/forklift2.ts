import { ActionContext, Actor, Color, Vector } from 'excalibur';
import { ActionQueue } from 'excalibur/dist/Actions/Action';
import { Item } from './item';
import { Shelf, SrBay } from './routeNode';

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

  get item() {
    return this.item_;
  }

  set item(value) {
    this.item_ = value;
    if (value) {
      value.visible = false;
    }
  }

  constructor(ctor: { route: Route; color: Color }) {
    super({ width: 8, height: 3, color: ctor.color });
    this.route = { ...ctor.route, direction: RouteDirection.srBayToShelf };
    this.mainLoop();
  }

  private mainLoop() {
    this.moveAlongPath(this.actions);
    this.actions.callMethod(() => this.onReachedNode());
    this.actions.repeatForever();
  }

  private moveAlongPath(actions: ActionContext) {
    const path = [...this.route.path];
    if (this.route.direction == RouteDirection.shelfToSrBay) {
      path.reverse();
    }
    this.pos = this.route.path[0];
    path.map(p => actions.moveTo(p.x, p.y, 10));

    // const actions = new ActionContext(this)
    // this.actionQueue.add(actions.moveTo())
  }

  private onReachedNode() {
    //TODO: implement
    this.route.direction = 1 - this.route.direction;
  }

  static makePath(route: Route) {
    // simple lerp route
    return [(route.shelf.pos.clone(), route.srBay.pos.clone())];
  }
}
