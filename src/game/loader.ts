import { Loader } from 'excalibur';
import { R } from '../utils';

export default class extends Loader {
  constructor() {
    super(Object.values(R.texture));
    this.playButtonText = 'Start';
    // this.logo = ""
  }
}
