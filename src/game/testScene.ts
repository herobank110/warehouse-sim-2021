import { Scene, Engine, Actor, Color, vec } from 'excalibur';
import { tryDispatchForklift } from '../actors/forklift';
import { GettableItem, Square, Triangle } from '../actors/item';
import {
  BasicRouteNode,
  ESide,
  RouteNode,
  Shelf,
  SrBay,
} from '../actors/routeNode';
import { DropOff, PickUp, Truck } from '../actors/truck';

// game state
let dragFrom: RouteNode | undefined;
const shelves: Shelf[] = [];
const srBays: SrBay[] = [];

function startDrag(from: Actor) {
  if (from instanceof BasicRouteNode) {
    dragFrom = from;
  }
}

function endDrag(to: Actor) {
  // if (dragFrom && to instanceof Shelf && shelves.includes(to)) {
  if (dragFrom && to instanceof BasicRouteNode) {
    tryDispatchForklift([dragFrom, to]);
  }
  dragFrom = undefined;
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

  [...srBays, ...shelves].map(s => {
    s.on('pointerdown', e => startDrag(e.target));
    s.on('pointerup', e => endDrag(e.target));
  });

  [...srBays, ...shelves, ...items].map(i => scene.add(i));

  scene.add(new Truck(new DropOff({ items, bay: srBays[0] })));

  setTimeout(() => {
    scene.add(
      new Truck(
        new PickUp({
          bay: srBays[0],
          items: [new GettableItem(Square), new GettableItem(Square)],
        }),
      ),
    );
  }, 15000);

  scene.camera.pos.setTo(100, 100);
  scene.camera.zoom(2);

  return scene;
};
