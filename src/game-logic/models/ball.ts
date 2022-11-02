import MovingSprite from './base-models/moving-sprite';

export default class Ball extends MovingSprite {
  borderCollision = {
    left: false,
    right: false,
    top: false,
    bottom: false,
  };

  paddleCollision = '';
}
