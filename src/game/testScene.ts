import { Scene, Engine, Actor, Color, vec } from 'excalibur';
import { Forklift } from '../actors/forklift2';
// import { tryDispatchForklift } from '../actors/forklift';
import { GettableItem, Item, Square, Triangle } from '../actors/item';
import {
  BasicRouteNode,
  ESide,
  RouteNode,
  Shelf,
  SrBay,
} from '../actors/routeNode';
import { DropOff, PickUp, Truck } from '../actors/truck';
import { warehouseGlobals } from '../globals';
import { iota, lerp1 } from '../utils';

// game state
let dragFrom: RouteNode | undefined;
const shelves: Shelf[] = [];
const srBays: SrBay[] = [];

// TODO: replace excalibur dragging with simple html dropdown of srbay and shelf number
function startDrag(from: Actor) {
  if (from instanceof BasicRouteNode) {
    dragFrom = from;
  }
}

function endDrag(to: Actor) {
  // if (dragFrom && to instanceof Shelf && shelves.includes(to)) {
  if (dragFrom && to instanceof BasicRouteNode) {
    // tryDispatchForklift([dragFrom, to]);
  }
  dragFrom = undefined;
}

function loopTrucks() {
  const scene = warehouseGlobals.game.currentScene;

  const bay = srBays[0]!;
  if (bay.dockedTruck) {
    return;
  }

  scene.add(
    new Truck(
      Math.random() < 0.6
        ? new DropOff({
            items: iota(lerp1(1, 4, Math.random())).map(
              i => new (randomItemClass())(),
            ),
            bay,
          })
        : new PickUp({
            items: iota(lerp1(1, 4, Math.random())).map(
              i => new GettableItem(randomItemClass()),
            ),
            bay,
          }),
    ),
  );

  setTimeout(loopTrucks, lerp1(10000, 15000, Math.random()));
}

function randomItemClass(): new () => Item {
  return [Square, Triangle, Triangle][Math.floor(Math.random() * 2)]!;
}

export default (game: Engine) => {
  // game.input.pointers.primary.on('move', e => {});
  // game.input.pointers.primary.on('down', e => {});

  const scene = new Scene(game);

  srBays.push(new SrBay({ tile: vec(0, 0), side: ESide.left }));
  shelves.push(
    new Shelf({ tile: vec(1, 0), side: ESide.top }),
    new Shelf({ tile: vec(1, 1), side: ESide.top }),
  );

  [...srBays, ...shelves].map(s => {
    s.on('pointerdown', e => startDrag(e.target));
    s.on('pointerup', e => endDrag(e.target));
  });

  [...srBays, ...shelves].map(i => scene.add(i));

  // scene.add(
  //   new Forklift({
  //     route: {
  //       shelf: shelves[0]!,
  //       srBay: srBays[0]!,
  //       path: Forklift.makePath(srBays[0]!, shelves[0]!),
  //     },
  //     color: Color.Red,
  //   }),
  // );

  setTimeout(() => loopTrucks(), 1000);
  scene.camera.pos.setTo(100, 100);
  scene.camera.zoom(2);

  return scene;
};
