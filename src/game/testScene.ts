import { Scene, Engine, Actor, Color, vec, Sprite } from 'excalibur';
import { warehouseGlobals } from '../globals';
import { R } from '../utils';
import { tileCoords, zero } from '../utils/vector';

let idleForklifts = 2;
type Forklift = { actor: Actor; item?: Actor };
type ForkliftRunning = { forklift: Forklift; route: Route };
let runningForklifts = <ForkliftRunning[]>[];

type RouteNode = { actor: Actor; items: Actor[] };
type Route = RouteNode[];

let dragFrom: Actor | undefined;
function startDrag(from: Actor) {
  dragFrom = from;
}

function endDrag(to: Actor) {
  if (dragFrom == srBay.actor) {
    const toShelf = to == shelf1.actor ? shelf1 : shelf2;
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
    pos: route[0].actor.pos.add(vec(14, 14)),
    width: 8,
    height: 3,
    color: Color.Red,
  });
  warehouseGlobals.game.add(actor);
  idleForklifts--;

  // onwards to destination
  const ctx: ForkliftRunning = { forklift: { actor, item }, route };
  runningForklifts.push(ctx);
  scheduleForklift(ctx);
  item.visible = false;
  return ctx;
}

function organizeItems(node: RouteNode) {
  node.items.map((item, i) => {
    // TODO: reposition items based on actor rotation
    item.pos = node.actor.pos.add(vec(2 + i * 8, 2));
    item.visible = true; // just to be sure!
  });
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
      .moveTo(ctx.route[1].actor.pos.x + 14, ctx.route[1].actor.pos.y + 14, 10)
      .callMethod(() => unloadForklift(ctx));
  } else if (noItemsToPickup(ctx.route)) {
    ctx.forklift.actor.kill();
    idleForklifts++;
  } else {
    ctx.forklift.actor.actions
      .moveTo(ctx.route[0].actor.pos.x + 14, ctx.route[0].actor.pos.y + 14, 10)
      .callMethod(() => {
        // TODO: pick up item at bay or die it has become empty
      });
  }
}

// box, box, triangle
const items = [
  new Actor({
    currentDrawing: new Sprite(R.texture.square, 0, 0, 7, 7),
    pos: tileCoords(vec(0, 0)).add(vec(2, 2)),
    anchor: zero(),
  }),
  new Actor({
    currentDrawing: new Sprite(R.texture.square, 0, 0, 7, 7),
    pos: tileCoords(vec(0, 0)).add(vec(2, 10)),
    anchor: zero(),
  }),
  new Actor({
    currentDrawing: new Sprite(R.texture.triangle, 0, 0, 7, 7),
    pos: tileCoords(vec(0, 0)).add(vec(2, 18)),
    anchor: zero(),
  }),
];

// s/r, shelf1, shelf2
const scenery = [
  new Actor({
    pos: tileCoords(vec(0, 0)),
    width: 14,
    height: 28,
    color: Color.fromHex('dbc751'),
    anchor: zero(),
    enableCapturePointer: true,
  }),
  // no depot for now
  // new Actor({
  //   pos: tileCoords(vec(0, 1)),
  //   width: 14,
  //   height: 28,
  //   color: Color.fromHex('51b6db'),
  //   anchor: zero(),
  // }),
  new Actor({
    pos: tileCoords(vec(1, 0)),
    width: 28,
    height: 14,
    color: Color.fromHex('afafaf'),
    anchor: zero(),
  }),
  new Actor({
    pos: tileCoords(vec(1, 1)),
    width: 28,
    height: 14,
    color: Color.fromHex('afafaf'),
    anchor: zero(),
  }),
];

const srBay = <RouteNode>{ actor: scenery[0], items: [...items] };
const shelf1 = <RouteNode>{ actor: scenery[1], items: [] };
const shelf2 = <RouteNode>{ actor: scenery[2], items: [] };

export default (game: Engine) => {
  // game.input.pointers.primary.on('move', e => {});
  // game.input.pointers.primary.on('down', e => {});

  const scene = new Scene(game);

  [...scenery, ...items].map(i => scene.add(i));

  scenery[0].on('pointerdown', e => startDrag(e.target));
  scenery[1].on('pointerup', e => endDrag(e.target));
  scenery[2].on('pointerup', e => endDrag(e.target));

  scene.camera.pos.setTo(100, 100);
  scene.camera.zoom(2);

  return scene;
};
