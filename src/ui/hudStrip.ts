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
          $('<span>', { id: 'hud-items-now', text: '0' }),
          $('<span>', { text: '🡒' }),
          $('<span>', { id: 'hud-items-next',text: '10' }),
        ),
      ),
    );
