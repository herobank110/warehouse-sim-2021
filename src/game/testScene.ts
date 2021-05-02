import { Scene, Engine, Color, vec } from 'excalibur';
import { Forklift } from '../actors/forklift2';
import { GettableItem, Item, Square, Triangle } from '../actors/item';
import { ESide, RouteNode, Shelf, SrBay } from '../actors/routeNode';
import { DropOff, PickUp, Truck } from '../actors/truck';
import { warehouseGlobals } from '../globals';
import { iota, lerp1, R } from '../utils';
import { makeRouteScreen } from '../ui/routeScreen';
import $ from 'jquery';
import { makeHudStrip } from '../ui/hudStrip';
import { EUpgrade, makeUpgradeScreen } from '../ui/upgradeScreen';

function setIsPaused(newPaused: boolean) {
  warehouseGlobals.game.timescale = newPaused ? 0.001 : 1;
}

function isPaused() {
  return warehouseGlobals.game.timescale == 0.001;
}

async function newForklift() {
  setIsPaused(true);
  const { srBay, shelf } = await makeRouteScreen();
  const f = new Forklift({
    route: { srBay, shelf, path: Forklift.makePath(srBay, shelf) },
    color: Color.Red,
  });
  warehouseGlobals.world.forklifts.push(f);
  warehouseGlobals.game.add(f);
  setIsPaused(false);
}

function onNodeClicked(node: RouteNode) {
  if (node.unlocked && warehouseGlobals.ui.route) {
    if (node instanceof SrBay) {
      const i = warehouseGlobals.world.srBays.indexOf(node);
      warehouseGlobals.ui.route.srBay = i;
      $(`#${R.id.routeSrBay}`).text(`Bay ${i + 1}`);
    } else if (node instanceof Shelf) {
      const i = warehouseGlobals.world.shelves.indexOf(node);
      warehouseGlobals.ui.route.shelf = i;
      $(`#${R.id.routeShelf}`).text(`Shelf ${i + 1}`);
    }
  }
}

function loopTrucks() {
  const bay = warehouseGlobals.world.srBays.find(bay => bay.unlocked && !bay.dockedTruck);
  if (bay && !isPaused()) {
    warehouseGlobals.game.add(
      // TODO: increase items max to 3 if score high
      // TODO: only spawn pickup for items that exist (why else would you schedule a pickup?!)
      new Truck(
        Math.random() < 0.6
          ? new DropOff({
              items: iota(lerp1(1, 2, Math.random())).map(
                () => new (randomItemClass())(),
              ),
              bay,
            })
          : new PickUp({
              items: iota(lerp1(1, 2, Math.random())).map(
                () => new GettableItem(randomItemClass()),
              ),
              bay,
            }),
      ),
    );
  }
  setTimeout(loopTrucks, lerp1(15_000, 20_000, Math.random()));
}

function randomItemClass(): new () => Item {
  return [Square, Triangle, Triangle][Math.floor(Math.random() * 2)]!;
}

async function levelUp() {
  setIsPaused(true);
  const upgrade = await makeUpgradeScreen();
  switch (upgrade) {
    case EUpgrade.srBay:
      unlockFirstNode(warehouseGlobals.world.srBays);
      break;
    case EUpgrade.shelf:
      unlockFirstNode(warehouseGlobals.world.shelves);
      break;
    case EUpgrade.forklift:
      newForklift();
      break;
  }
  setIsPaused(false);
}

function unlockFirstNode(arr: RouteNode[]) {
  const it = arr.find(i => !i.unlocked);
  if (it) {
    it.unlocked = true;
  }
}

export default (game: Engine) => {
  const scene = new Scene(game);

  const { srBays, shelves } = warehouseGlobals.world;
  srBays.push(
    new SrBay({ tile: vec(0, 0), side: ESide.left }),
    new SrBay({ tile: vec(0, 1), side: ESide.left }),
    new SrBay({ tile: vec(0, 2), side: ESide.left }),
    new SrBay({ tile: vec(0, 3), side: ESide.left }),
  );
  shelves.push(
    new Shelf({ tile: vec(1, 0), side: ESide.top }),
    new Shelf({ tile: vec(1, 1), side: ESide.top }),
    new Shelf({ tile: vec(1, 2), side: ESide.top }),
    new Shelf({ tile: vec(1, 3), side: ESide.top }),
    new Shelf({ tile: vec(2, 0), side: ESide.top }),
    new Shelf({ tile: vec(2, 1), side: ESide.top }),
    new Shelf({ tile: vec(2, 2), side: ESide.top }),
    new Shelf({ tile: vec(2, 3), side: ESide.top }),
  );

  srBays.map((s, i) => (s.unlocked = i < 1));
  shelves.map((s, i) => (s.unlocked = i < 2));

  [...srBays, ...shelves].map(s => {
    scene.add(s);
    s.on('pointerdown', e => onNodeClicked(e.target as RouteNode));
  });

  makeHudStrip();

  scene.camera.pos.setTo(100, 100);
  scene.camera.zoom(2);

  warehouseGlobals.onScoreChanged = () => {
    const score = warehouseGlobals.score;
    $(`#${R.id.hudItemsNow}`).text(score);
    $(`#${R.id.hudItemsNext}`).text(Math.floor(score / 10) * 10 + 10);

    if (score % 10 == 0) {
      levelUp();
    }
  };

  R.sound.music.loop = true;
  R.sound.music.play();

  // TODO: show main menu screen
  setTimeout(newForklift, 10);
  setTimeout(() => loopTrucks(), 1000);

  return scene;
};
