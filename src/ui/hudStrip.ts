import $ from 'jquery';
import { R, makeUiOverlay } from '../utils';

export function makeHudStrip() {
  const html = makeHudStripUi();
  $('body').append(html);
}

const makeHudStripUi = () =>
  makeUiOverlay()
    .addClass('hud-strip')
    .append(
      $('<h3>', { text: 'Warehouse Simulator 2021' }).append(
        $('<div>').append(
          $('<div>', { css: { backgroundImage: `url('${R.texture.suitcase.path}')` } }),
          $('<span>', { id: R.id.hudItemsNow, text: '0' }),
          $('<span>', { text: ' >> ' }),
          $('<span>', { id: R.id.hudItemsNext,text: '5' }),
        ),
      ),
    );
