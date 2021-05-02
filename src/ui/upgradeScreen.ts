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

const makeUpgradeCard = (data: {
  name: string;
  img: string;
  have: number;
  total: number;
  onPick: () => void;
}) =>
  $('<div>', { class: 'upgrade-card' }).append(
    $('<div>', { css: { backgroundImage: `url('${data.img}')` } }),
    $('<p>', { text: data.name }),
    $('<span>', { text: `${data.have} / ${data.total}` }),
    $('<button>', { text: 'Choose', disabled: data.have >= data.total }).on('click', () =>
      data.onPick(),
    ),
  );

const makeUpgradeScreenUi = (data: { onPick: (type: EUpgrade) => void }) =>
  makeUiOverlay()
    .addClass('upgrade-screen')
    .append(
      $('<h2>').append(
        $('<span>', { text: warehouseGlobals.score }),
        $('<div>', { css: { backgroundImage: `url('${R.texture.suitcase.path}')` } }),
        $('<span>', { text: 'items delivered!' }),
      ),
      $('<h3>', { text: 'Pick an upgrade' }),
      $('<div>').append(
        makeUpgradeCard({
          name: 'Shipping & Receiving Bay',
          img: '',
          have: warehouseGlobals.world.srBays.length,
          total: 5,
          onPick: () => data.onPick(EUpgrade.srBay),
        }),
        makeUpgradeCard({
          name: 'Shelf',
          img: '',
          have: warehouseGlobals.world.shelves.length,
          total: 8,
          onPick: () => data.onPick(EUpgrade.shelf),
        }),
        makeUpgradeCard({
          name: 'Forklift',
          img: '',
          have: warehouseGlobals.world.forklifts.length,
          total: 14,
          onPick: () => data.onPick(EUpgrade.forklift),
        }),
      ),
    );
