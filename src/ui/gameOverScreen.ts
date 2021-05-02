import $ from 'jquery';
import { warehouseGlobals } from '../globals';
import { R, makeUiOverlay } from '../utils';

export const makeGameOverScreen = () =>
  new Promise<void>(resolve => {
    const html = makeGameOverScreenUi({
      score: warehouseGlobals.score,
      onDone: () => resolve(),
    });
    $('body').append(html);
  });

const makeGameOverScreenUi = (data: { score: number; onDone: () => void }) =>
  makeUiOverlay()
    .addClass('game-over')
    .append(
      $('<h2>', { text: 'Game Over' }).append(
        $('<div>').append(
          $('<span>', { text: 'Score:' }),
          $('<span>', { text: data.score }),
          $('<div>', { css: { backgroundImage: `url('${R.texture.suitcase.path}')` } }),
        ),
      ),
    );
