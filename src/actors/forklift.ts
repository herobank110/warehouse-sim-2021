import { Actor, Color, vec } from 'excalibur';
import { warehouseGlobals } from '../globals';
import { Item } from './item';
import { RouteNode } from './routeNode';

type ForkliftRunning = { forklift: Forklift; route: Route };

type Route = RouteNode[];

let idleForklifts = 2;
let runningForklifts = <ForkliftRunning[]>[];

export class Forklift extends Actor {
  item_?: Item;

  get item() {
    return this.item_;
  }

  set item(value) {
    this.item_ = value;
    if (value) {
      // hide the original item in the world.
      value.visible = false;
    }
  }

  constructor(forklift: { route: Route; item: Item; color: Color }) {
    super({
      pos: forklift.route[0].pos.add(vec(14, 14)),
      width: 8,
      height: 3,
      color: forklift.color,
    });
    this.item = forklift.item;
  }

  goToDestination(ctx: ForkliftRunning) {
    return this.goToNode(ctx.route[1]);
  }

  goToOrigin(ctx: ForkliftRunning) {
    return this.goToNode(ctx.route[0]);
  }

  private goToNode(node: RouteNode) {
    return this.actions.moveTo(node.pos.x + 14, node.pos.y + 14, 10);
  }
}

export function tryDispatchForklift(route: Route) {
  if (idleForklifts == 0) return;
  const item = route[0].popItem();
  if (!item) return;
  const actor = new Forklift({ route, item, color: Color.Red });
  warehouseGlobals.game.add(actor);
  idleForklifts--;
  return idleToRunning(actor, item, route);
}

/** Assumes he's already at the first point in the route. */
function idleToRunning(forklift: Forklift, item: Actor, route: Route) {
  forklift.item = item;
  const ctx: ForkliftRunning = { forklift, route };
  runningForklifts.push(ctx);
  scheduleForklift(ctx);
  return ctx;
}

function runningToIdle(ctx: ForkliftRunning) {
  deregisterRunningForklift(ctx);
  ctx.forklift.kill();
  idleForklifts++;
}

function recycleRunningToRunning() {}

function scheduleForklift(ctx: ForkliftRunning) {
  if (ctx.forklift.item) {
    // already at first point in route
    ctx.forklift.goToDestination(ctx).callMethod(() => unloadForklift(ctx));
  } else if (noItemsToPickup(ctx.route)) {
    // already at first point in route
    runningToIdle(ctx);
  } else {
    // already at last point in route
    ctx.forklift.goToOrigin(ctx).callMethod(() => {
      const item = ctx.route[0].popItem();
      ctx.forklift.item = item;
      scheduleForklift(ctx);
      if (!item) {
        runningToIdle(ctx);
        return;
      }
      // Create a new forklift running context.
      idleToRunning(ctx.forklift, item, ctx.route);
      deregisterRunningForklift(ctx);
    });
  }
}

function unloadForklift(ctx: ForkliftRunning) {
  const item = ctx.forklift.item;
  if (!item) throw new Error('Cannot unload empty forklift');
  ctx.forklift.item = undefined;
  ctx.route[1].pushItem(item);
  scheduleForklift(ctx);
}

function noItemsToPickup(route: Route) {
  return route[0]?.items.length == 0 ?? false;
}

function deregisterRunningForklift(ctx: ForkliftRunning) {
  const index = runningForklifts.indexOf(ctx);
  if (index != -1) {
    runningForklifts.splice(index, 1);
  }
}
