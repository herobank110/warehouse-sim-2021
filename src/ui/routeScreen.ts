import $ from 'jquery';
import { warehouseGlobals } from '../globals';
import { makeUiOverlay } from '../utils/ui';

export function makeRouteScreen() {
  const html = makeRouteScreenUi({
    onAccept: () => {
      const route = warehouseGlobals.ui.route;
      if (!route) throw new Error('route invalid state');
      if (route.srBay != -1 && route.srBay != -1) {
        route.html.remove();
        // TODO: add forklift of specified route
        console.log('accepted', route.srBay, 'to', route.shelf);
      }
    },
  });
  warehouseGlobals.ui.route = { html, srBay: -1, shelf: -1 };
  $('body').append(html);
}

const makeRouteScreenUi = (data: { onAccept: () => void }) =>
  makeUiOverlay()
    .addClass('route-screen')
    .append(
      $('<h2>', { text: 'Forklift Routing Screen' }),
      $('<div>').append(
        $('<form>').append(
          $('<div>').append(
            $('<label>', { text: 'Shipping & Receiving Bay' }),
            $('<p>', { id: 'route-srbay', text: 'Not selected' }),
          ),
          $('<div>').append(
            $('<label>', { text: 'Shelving Unit' }),
            $('<p>', { id: 'route-shelf', text: 'Not selected' }),
          ),
        ),
        $('<button>', { text: 'Accept' }).on('click', data.onAccept),
      ),
    );
