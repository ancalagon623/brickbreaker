import { Sprite, Texture } from 'pixi.js';
import { Collisions } from '../types';
import State from './state';

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
    textures: {
      stage1: Texture.from(`images/brick-stage-1.png`),
      stage2: Texture.from('images/brick-stage-2.png'),
    },
  };

  break() {
    if (this.ballCollision.broken) return;
    this.breakingAnimation.stage += 1;
    if (this.breakingAnimation.stage === 3) {
      this.ballCollision.broken = true;
      this.state.increaseScore(1);
      this.visible = false;
    } else {
      const { stage, textures } = this.breakingAnimation;
      this.texture = textures[`stage${stage}` as keyof typeof textures];
    }
  }
}
