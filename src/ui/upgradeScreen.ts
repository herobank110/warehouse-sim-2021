import $ from 'jquery';
import { warehouseGlobals } from '../globals';
import { R, makeUiOverlay } from '../utils';

enum EUpgrade {
  srBay,
  shelf,
  forklift,
}

export const makeUpgradeScreen = () =>
  new Promise<EUpgrade>(resolve => {
    const html = makeUpgradeScreenUi({
      onPick: type => {
        html.remove();
        resolve(type);
      },
    });
    $('body').append(html);
  });

const makeUpgradeScreenUi = (data: { onPick: (type: EUpgrade) => void }) =>
  makeUiOverlay()
    .addClass('upgrade-screen')
    .append(
      $('<h2>', { text: 'Upgrade Screen' }),
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
        $('<button>', { text: 'Accept' }).on('click', data.onPick),
      ),
    );
