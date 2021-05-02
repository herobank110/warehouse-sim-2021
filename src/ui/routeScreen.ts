import $ from 'jquery';
import { iota } from '../utils';
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
            $('<select>').append(
              ...iota(data.srBays).map(i =>
                $('<option>', { text: `Bay ${i + 1}`, value: i }),
              ),
            ),
          ),
          $('<div>').append(
            $('<label>', { text: 'Shelving Unit' }),
            $('<select>').append(
              ...iota(data.shelves).map(i =>
                $('<option>', { text: `Shelf ${i + 1}`, value: i }),
              ),
            ),
          ),
        ),
        $('<button>', { text: 'Accept' }).on('click', () => {
            console.log('hi');
            
        }),
      ),
    );
