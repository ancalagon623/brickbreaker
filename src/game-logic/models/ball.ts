import { Collisions, PaddleSprite } from '../types';
import MovingSprite from './base-models/moving-sprite';

export default class Ball extends MovingSprite {
  paddleCollision = Collisions.None;

  increaseVelocityByScore = (score: number) => {
    this.vx += 0.04 * score * Math.sign(this.vx);
    this.vy += 0.04 * score * Math.sign(this.vy);
  };

  static calculateComponentVelocityByAngle = (
    angle: number,
    angleDirection: number,
    resultantVelocity: number
  ) => {
    const xComponent = Math.cos(angle) * resultantVelocity;
    const yComponent = Math.sin(angle) * resultantVelocity;

    return [xComponent * angleDirection, yComponent * -1];
  };

  calculateReflectionAngle = (paddle: PaddleSprite) => {
    const paddleHalfWidth = paddle.width / 2;
    const distanceOfBallFromPaddleCenter = this.x - paddle.x;
    const distanceFromNearestEdge =
      paddleHalfWidth - Math.abs(distanceOfBallFromPaddleCenter);
    const angleFactor = distanceFromNearestEdge / paddleHalfWidth;
    const angleDirection = Math.sign(distanceOfBallFromPaddleCenter);

    // 1. Calculate the angle of reflection
    let angle = angleFactor * (Math.PI / 2);
    if (angle < 0.15) angle = 0.15;

    return [angle, angleDirection];
  };

  collideWithPaddle = (paddle: PaddleSprite) => {
    const resultantVelocity = Math.hypot(this.vx, this.vy);
    const [angle, angleDirection] = this.calculateReflectionAngle(paddle);

    const [vx, vy] = Ball.calculateComponentVelocityByAngle(
      angle,
      angleDirection,
      resultantVelocity
    );
    this.vx = vx;
    this.vy = vy;
  };

  lost = false;
}
