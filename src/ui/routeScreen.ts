import $ from 'jquery';
import { R } from '../utils';

const makeUiOverlay = () =>
  $('<div>', {
    class: 'ui-overlay',
    css: { width: R.viewportSize.width, height: R.viewportSize.height },
  });

export const makeRouteScreen = () =>
  makeUiOverlay()
    .addClass('route-screen')
    .append($('<p>', { text: 'hi' }));
