import { Sprite, Texture } from 'pixi.js';
import { Collisions, GameState } from '../types';

export default class Brick extends Sprite {
  constructor(state: GameState, texture: Texture) {
    super(texture);
    this.state = state;
  }

  state: GameState;

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
      this.state.score += 1;
      this.renderable = false;
    } else {
      const { stage, textures } = this.breakingAnimation;
      this.texture = textures[`stage${stage}` as keyof typeof textures];
    }
  }
}
