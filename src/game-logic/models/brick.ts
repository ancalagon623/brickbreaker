import { Sprite } from 'pixi.js';
import { Collisions } from '../types';

export default class Brick extends Sprite {
  ballCollision = {
    _warning: Collisions.None,
    type: Collisions.None,
    broken: false,
  };

  breakingAnimation = {
    stage: 0,
  };

  break() {
    this.ballCollision.broken = true;
    this.breakingAnimation.stage = 1;
  }
}
