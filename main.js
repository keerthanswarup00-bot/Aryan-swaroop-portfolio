import { Game } from './js/Game.js';

const canvas = document.querySelector('#game');
const game = new Game(canvas, document.querySelector('#mute'));
game.start();
