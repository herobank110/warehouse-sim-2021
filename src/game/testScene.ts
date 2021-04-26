import { Scene, Engine, Actor, Color, vec, Sprite } from 'excalibur';
import { RouteNode, ESide, Shelf, SrBay } from '../actors/routeNode';
import { warehouseGlobals } from '../globals';
import { R } from '../utils';
import { tilePos, zero } from '../utils/vector';

let idleForklifts = 2;
type Forklift = { actor: Actor; item?: Actor };
type ForkliftRunning = { forklift: Forklift; route: Route };
let runningForklifts = <ForkliftRunning[]>[];

// type RouteNode = { actor: Actor; items: Actor[] };
type Route = RouteNode[];

let dragFrom: Actor | undefined;
function startDrag(from: Actor) {
  dragFrom = from;
}

function endDrag(to: Actor) {
  if (dragFrom == srBay) {
    const toShelf = to == shelf1 ? shelf1 : shelf2;
    dispatchForklift([srBay, toShelf]);
  }
  dragFrom = undefined;
}

function dispatchForklift(route: Route) {
  if (idleForklifts == 0) return;

  const item = route[0].items.shift();
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

function organizeItems(node: RouteNode) {
  node.items.map((item, i) => {
    // TODO: reposition items based on actor rotation
    item.pos = node.pos.add(vec(2 + i * 8, 2));
    item.visible = true; // just to be sure!
  });
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
  ctx.route[1].items.push(item);
  ctx.forklift.item = undefined;
  organizeItems(ctx.route[1]);
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
        const item = ctx.route[0].items.shift();
        if (!item) {
          ctx.forklift.actor.kill();
          return;
        }
        const newCtx = runRoute(ctx.forklift, item, ctx.route);
        deregisterRunningForklift(ctx);
      });
  }
}

// box, box, triangle
const items = [
  new Actor({
    currentDrawing: new Sprite(R.texture.square, 0, 0, 7, 7),
    pos: tilePos(vec(0, 0)).add(vec(2, 2)),
    anchor: zero(),
  }),
  new Actor({
    currentDrawing: new Sprite(R.texture.square, 0, 0, 7, 7),
    pos: tilePos(vec(0, 0)).add(vec(2, 10)),
    anchor: zero(),
  }),
  new Actor({
    currentDrawing: new Sprite(R.texture.triangle, 0, 0, 7, 7),
    pos: tilePos(vec(0, 0)).add(vec(2, 18)),
    anchor: zero(),
  }),
];

// s/r, shelf1, shelf2
const scenery = [
  new SrBay({ tile: vec(0, 0), side: ESide.left }),
  // no depot for now
  // new Actor({
  //   pos: tileCoords(vec(0, 1)),
  //   width: 14,
  //   height: 28,
  //   color: Color.fromHex('51b6db'),
  //   anchor: zero(),
  // }),
  new Shelf({ tile: vec(1, 0), side: ESide.top }),
  new Shelf({ tile: vec(1, 1), side: ESide.top }),
];

const srBay: RouteNode = scenery[0];
srBay.items.push(...items);
const shelf1: RouteNode = scenery[1];
const shelf2: RouteNode = scenery[2];

export default (game: Engine) => {
  // game.input.pointers.primary.on('move', e => {});
  // game.input.pointers.primary.on('down', e => {});

  const scene = new Scene(game);

  [...scenery, ...items].map(i => scene.add(i));

  srBay.on('pointerdown', e => startDrag(e.target));
  shelf1.on('pointerup', e => endDrag(e.target));
  shelf2.on('pointerup', e => endDrag(e.target));

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
