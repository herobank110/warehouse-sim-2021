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
      $('<h2>', { text: 'Warehouse Simulator 2021' }),
      $('<div>').append(
        $('<i>', { css: { backgroundImage: `url('${R.texture.suitcase.path}')` } }),
      ),
    );
