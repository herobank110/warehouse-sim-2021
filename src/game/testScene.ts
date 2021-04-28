import { Scene, Engine, Actor, Color, vec } from 'excalibur';
import { Square, Triangle } from '../actors/item';
import {
  BasicRouteNode,
  ESide,
  RouteNode,
  Shelf,
  SrBay,
} from '../actors/routeNode';
import { DropOff, PickUp, Truck } from '../actors/truck';
import { warehouseGlobals } from '../globals';
import { tilePos } from '../utils';

// TODO: make forklift class, make free functions member fn
type Forklift = { actor: Actor; item?: Actor };
type ForkliftRunning = { forklift: Forklift; route: Route };

type Route = RouteNode[];

// game state
let idleForklifts = 2;
let dragFrom: RouteNode | undefined;
const shelves: Shelf[] = [];
const srBays: SrBay[] = [];
let runningForklifts = <ForkliftRunning[]>[];

function startDrag(from: Actor) {
  if (from instanceof BasicRouteNode) {
    dragFrom = from;
  }
}

function endDrag(to: Actor) {
  if (dragFrom && to instanceof Shelf && shelves.includes(to)) {
    dispatchForklift([dragFrom, to]);
  }
  dragFrom = undefined;
}

function dispatchForklift(route: Route) {
  if (idleForklifts == 0) return;

  const item = route[0].popItem();
  if (!item) return;

  // spawn a forklift
  const actor = new Actor({
    pos: route[0].pos.add(vec(14, 14)),
    width: 8,
    height: 3,
    color: Color.Red,
  });
  warehouseGlobals.game.add(actor);
  idleForklifts--;
  return runRoute({ actor }, item, route);
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

function scheduleForklift(ctx: ForkliftRunning) {
  if (ctx.forklift.item) {
    // take to destination
    ctx.forklift.actor.actions
      .moveTo(ctx.route[1].pos.x + 14, ctx.route[1].pos.y + 14, 10)
      .callMethod(() => unloadForklift(ctx));
  } else if (noItemsToPickup(ctx.route)) {
    ctx.forklift.actor.kill();
    idleForklifts++;
  } else {
    ctx.forklift.actor.actions
      .moveTo(ctx.route[0].pos.x + 14, ctx.route[0].pos.y + 14, 10)
      .callMethod(() => {
        const item = ctx.route[0].popItem();
        if (!item) {
          ctx.forklift.actor.kill();
          return;
        }
        // Create a new forklift running context.
        runRoute(ctx.forklift, item, ctx.route);
        deregisterRunningForklift(ctx);
      });
  }
}

export default (game: Engine) => {
  // game.input.pointers.primary.on('move', e => {});
  // game.input.pointers.primary.on('down', e => {});

  const scene = new Scene(game);

  const items = [new Square(), new Square(), new Triangle()];
  srBays.push(new SrBay({ tile: vec(0, 0), side: ESide.left }));
  shelves.push(
    new Shelf({ tile: vec(1, 0), side: ESide.top }),
    new Shelf({ tile: vec(1, 1), side: ESide.top }),
  );

  srBays.map(s => s.on('pointerdown', e => startDrag(e.target)));
  shelves.map(s => s.on('pointerup', e => endDrag(e.target)));

  [...srBays, ...shelves, ...items].map(i => scene.add(i));

  scene.add(new Truck(new DropOff({ items, bay: srBays[0] })));

  setTimeout(() => {
    scene.add(
      new Truck(
        new PickUp({
          bay: srBays[0],
          need: [new Square(), new Square()],
          have: [],
        }),
      ),
    );
  }, 3000);

  scene.camera.pos.setTo(100, 100);
  scene.camera.zoom(2);

  return scene;
};

function deregisterRunningForklift(ctx: ForkliftRunning) {
  const index = runningForklifts.indexOf(ctx);
  if (index != -1) {
    runningForklifts.splice(index, 1);
  }
}
