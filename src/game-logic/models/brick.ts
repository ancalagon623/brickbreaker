import { Sprite, Texture } from 'pixi.js';
import { Collisions } from '../types';
import type State from './state';

export default class Brick extends Sprite {
  constructor(state: State, texture: Texture) {
    super(texture);
    this.state = state;
  }

  state: State;

  // these are attributes which help the test functions calculate whether the ball has collided with a brick
  ballCollision = {
    _warning: Collisions.None,
    type: Collisions.None,
    broken: false,
  };

  breakingAnimation = {
    stage: 0,
    textures: {},
  };

  break() {
    if (this.ballCollision.broken) return;
    this.breakingAnimation.stage += 1;
    if (this.breakingAnimation.stage === 1) {
      this.ballCollision.broken = true;
      this.state.increaseScore(1);
      this.visible = false;
    }
  }
}
