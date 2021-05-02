import $ from 'jquery';
import { Shelf, SrBay } from '../actors/routeNode';
import { warehouseGlobals } from '../globals';
import { R, makeUiOverlay } from '../utils';

export const makeRouteScreen = () =>
  new Promise<{ srBay: SrBay; shelf: Shelf }>(resolve => {
    const html = makeRouteScreenUi({
      onAccept: () => {
        const route = warehouseGlobals.ui.route;
        if (!route) throw new Error('route invalid state');
        if (route.srBay != -1 && route.shelf != -1) {
          route.html.remove();
          warehouseGlobals.ui.route = undefined;
          resolve({
            srBay: warehouseGlobals.world.srBays[route.srBay]!,
            shelf: warehouseGlobals.world.shelves[route.shelf]!,
          });
        }
      },
    });
    warehouseGlobals.ui.route = { html, srBay: -1, shelf: -1 };
    $('body').append(html);
  });

const makeRouteScreenUi = (data: { onAccept: () => void }) =>
  makeUiOverlay()
    .addClass('route-screen')
    .append(
      $('<h2>', { text: 'Forklift Routing Screen' }),
      $('<div>').append(
        $('<form>').append(
          $('<div>').append(
            $('<label>', { text: 'Shipping & Receiving Bay' }),
            $('<p>', { id: R.id.routeSrBay, text: 'Not selected' }),
          ),
          $('<div>').append(
            $('<label>', { text: 'Shelving Unit' }),
            $('<p>', { id: R.id.routeShelf, text: 'Not selected' }),
          ),
        ),
        $('<button>', { text: 'Accept' }).on('click', data.onAccept),
      ),
    );
