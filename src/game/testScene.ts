import { Scene, Engine, Color, vec } from 'excalibur';
import { Forklift } from '../actors/forklift2';
import { GettableItem, Item, Square, Triangle } from '../actors/item';
import { ESide, RouteNode, Shelf, SrBay } from '../actors/routeNode';
import { DropOff, PickUp, Truck } from '../actors/truck';
import { warehouseGlobals } from '../globals';
import { iota, lerp1 } from '../utils';
import { makeRouteScreen } from '../ui/routeScreen';
import $ from 'jquery';

async function newForklift() {
  warehouseGlobals.game.stop();
  const { srBay, shelf } = await makeRouteScreen();
  const f = new Forklift({
    route: { srBay, shelf, path: Forklift.makePath(srBay, shelf) },
    color: Color.Red,
  });
  warehouseGlobals.world.forklifts.push(f);
  warehouseGlobals.game.add(f);
  warehouseGlobals.game.start();
}

function onNodeClicked(node: RouteNode) {
  if (warehouseGlobals.ui.route) {
    if (node instanceof SrBay) {
      const i = warehouseGlobals.world.srBays.indexOf(node);
      warehouseGlobals.ui.route.srBay = i;
      $('#route-srbay').text(`Bay ${i + 1}`);
    } else if (node instanceof Shelf) {
      const i = warehouseGlobals.world.shelves.indexOf(node);
      warehouseGlobals.ui.route.shelf = i;
      $('#route-shelf').text(`Shelf ${i + 1}`);
    }
  }
}

function loopTrucks() {
  const bay = warehouseGlobals.world.srBays[0]!;
  if (!bay.dockedTruck) {
    warehouseGlobals.game.add(
      new Truck(
        Math.random() < 0.6
          ? new DropOff({
              items: iota(lerp1(1, 4, Math.random())).map(
                () => new (randomItemClass())(),
              ),
              bay,
            })
          : new PickUp({
              items: iota(lerp1(1, 4, Math.random())).map(
                () => new GettableItem(randomItemClass()),
              ),
              bay,
            }),
      ),
    );
  }
  setTimeout(loopTrucks, lerp1(10000, 15000, Math.random()));
}

function randomItemClass(): new () => Item {
  return [Square, Triangle, Triangle][Math.floor(Math.random() * 2)]!;
}

export default (game: Engine) => {
  const scene = new Scene(game);

  const { srBays, shelves } = warehouseGlobals.world;
  srBays.push(new SrBay({ tile: vec(0, 0), side: ESide.left }));
  shelves.push(
    new Shelf({ tile: vec(1, 0), side: ESide.top }),
    new Shelf({ tile: vec(1, 1), side: ESide.top }),
  );

  [...srBays, ...shelves].map(s => {
    s.on('pointerdown', e => onNodeClicked(e.target as RouteNode));
  });

  [...srBays, ...shelves].map(i => scene.add(i));
  // setTimeout(newForklift, 3000);

  setTimeout(() => loopTrucks(), 1000);
  scene.camera.pos.setTo(100, 100);
  scene.camera.zoom(2);

  return scene;
};
