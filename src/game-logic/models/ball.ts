import { Collisions, PaddleSprite } from '../types';
import MovingSprite from './base-models/moving-sprite';

export default class Ball extends MovingSprite {
  paddleCollision = Collisions.None;

  increaseVelocityByScore = (score: number) => {
    this.vx += 0.05 * score * (this.vx / Math.abs(this.vx));
    this.vy += 0.05 * score * (this.vy / Math.abs(this.vy));
  };

  collideWithPaddle = (paddle: PaddleSprite) => {
    const vector = this.vx * this.vy;
    if (paddle.vx * this.vx > 0) {
      // both objects moving in the same direction relative to the x axis
      this.vx -= paddle.vx;
      this.vy = vector / this.vx;
      // this.vy = this.vy * -1 + paddle.vx;
    }
    if (paddle.vx * this.vx < 0) {
      // objects moving in defferent directions along the x axis
      this.vx += paddle.vx;
      this.vy = vector / this.vx;
    }
    if (paddle.vx === 0) {
      this.vy = this.vy > 0 ? this.vy * -1 : this.vy;
    }
  };

  lost = false;
}
