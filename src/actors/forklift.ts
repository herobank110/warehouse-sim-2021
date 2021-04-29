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
    // hide the original item in the world.
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
}

export function tryDispatchForklift(route: Route) {
  if (idleForklifts == 0) return;
  const item = route[0].popItem();
  if (!item) return;
  const actor = new Forklift({ route, item, color: Color.Red });
  warehouseGlobals.game.add(actor);
  idleForklifts--;
  return runRoute(actor, item, route);
}

/** Assumes he's already at the first point in the route. */
function runRoute(forklift: Forklift, item: Actor, route: Route) {
  forklift.item = item;
  const ctx: ForkliftRunning = { forklift, route };
  runningForklifts.push(ctx);
  scheduleForklift(ctx);
  item.visible = false;
  return ctx;
}

function scheduleForklift(ctx: ForkliftRunning) {
  if (ctx.forklift.item) {
    // take to destination
    ctx.forklift.actions
      .moveTo(ctx.route[1].pos.x + 14, ctx.route[1].pos.y + 14, 10)
      .callMethod(() => unloadForklift(ctx));
  } else if (noItemsToPickup(ctx.route)) {
    ctx.forklift.kill();
    idleForklifts++;
  } else {
    ctx.forklift.actions
      .moveTo(ctx.route[0].pos.x + 14, ctx.route[0].pos.y + 14, 10)
      .callMethod(() => {
        const item = ctx.route[0].popItem();
        if (!item) {
          ctx.forklift.kill();
          return;
        }
        // Create a new forklift running context.
        runRoute(ctx.forklift, item, ctx.route);
        deregisterRunningForklift(ctx);
      });
  }
}

function unloadForklift(ctx: ForkliftRunning) {
  if (!ctx.forklift.item) throw new Error('Cannot unload empty forklift');
  const item = ctx.forklift.item;
  ctx.route[1].pushItem(item);
  ctx.forklift.item = undefined;
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
