import $ from 'jquery';
import { makeUiOverlay } from '../utils/ui';

export const makeRouteScreen = (data: { srBays: number; shelves: number }) =>
  makeUiOverlay()
    .addClass('route-screen')
    .append(
      $('<h2>', { text: 'Forklift Route' }),
      $('<div>').append(
        $('<form>').append(
          $('<div>').append(
            $('<label>', { text: 'Shipping & Receiving Bay' }),
            $('<p>', { id: 'route-srbay', text: 'Not selected' }),
          ),
          $('<div>').append(
            $('<label>', { text: 'Shelving Unit' }),
            $('<p>', { id: 'route-shelf', text: 'Not selected' }),
          ),
        ),
        $('<button>', { text: 'Accept' }).on('click', () => {
          console.log('hi');
        }),
      ),
    );
