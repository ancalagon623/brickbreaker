import { Sprite } from 'pixi.js';

export default class MovingSprite extends Sprite {
  vx = 0;

  vy = 0;

  borderCollision = {
    left: false,
    right: false,
    top: false,
    bottom: false,
  };
}
