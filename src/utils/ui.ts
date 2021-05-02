import { R } from '.';

export const makeUiOverlay = () =>
  $('<div>', {
    class: 'ui-overlay',
    css: { width: R.viewportSize.width, height: R.viewportSize.height },
  });
