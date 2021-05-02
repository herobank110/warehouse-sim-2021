import $ from 'jquery';
import { makeUiOverlay } from '../utils/ui';

export const makeRouteScreen = () =>
  makeUiOverlay()
    .addClass('route-screen')
    .append($('<h2>', { text: 'Forklift Route' }));
