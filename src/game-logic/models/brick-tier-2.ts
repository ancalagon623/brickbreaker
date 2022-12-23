import { utils } from 'pixi.js';
import Brick from './brick';

export default class BrickTier2 extends Brick {
  break() {
    if (this.ballCollision.broken) return;
    this.breakingAnimation.stage += 1;
    if (this.breakingAnimation.stage === 2) {
      this.ballCollision.broken = true;
      this.state.increaseScore(1);
      this.visible = false;
    } else {
      const { stage, textures } = this.breakingAnimation;
      this.texture =
        utils.TextureCache[`brick2_stage${stage}` as keyof typeof textures];
    }
  }
}
