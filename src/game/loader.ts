import { Loader } from 'excalibur';
import { R } from '../utils';
// @ts-ignore
import logoUrl from 'url:../../res/logo.png';

export default class extends Loader {
  constructor() {
    super(Object.values(R.texture));
    this.playButtonText = 'Start';
    this.logo = logoUrl;
    this.backgroundColor = R.color.bg.toHex();
    this.loadingBarColor = R.color.fg;
  }
}
