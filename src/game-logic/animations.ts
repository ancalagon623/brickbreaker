import { SpriteWithVelocity, BallSprite } from './types';
import { borderCollisionTest, paddleAndBallCollisionTest } from './tests';

// define a function that allows us to change the velocity of the sprite.
export const animateX = (
  sprite: SpriteWithVelocity | undefined,
  velocity: number
) => {
  if (sprite) {
    sprite.vx = velocity;
  }
};

export const animateY = (
  sprite: SpriteWithVelocity | undefined,
  velocity: number
) => {
  if (sprite) {
    sprite.vy = velocity;
  }
};

export const endXAnimation = (sprite: SpriteWithVelocity) => {
  sprite.vx = 0;
};

export const updatePaddleVelocity = (
  paddle: SpriteWithVelocity | undefined
) => {
  // check whether the paddle is touching a border
  // but first make a type guard to ensure the function doesn't operate on an undefined value
  if (typeof paddle === 'undefined') return;
  const { borders } = borderCollisionTest(paddle);
  if (typeof paddle.vx === 'number' && borders?.left && paddle.vx < 0) {
    endXAnimation(paddle);
  } else if (typeof paddle.vx === 'number' && borders?.right && paddle.vx > 0) {
    endXAnimation(paddle);
  }
};

export const updateBallVelocity = (
  paddle: SpriteWithVelocity | undefined,
  ball: BallSprite | undefined
) => {
  if (
    typeof ball === 'undefined' ||
    typeof paddle === 'undefined' ||
    !ball.vx ||
    !ball.vy ||
    paddle.vx === undefined
  )
    return ball;
  const { borders } = borderCollisionTest(ball);
  const { paddleCollision } = paddleAndBallCollisionTest(paddle, ball);
  // same process for changing the paddle velocity, only there are different rules for how the ball reflects off the walls.
  if (borders?.left || borders?.right) {
    animateX(ball, ball.vx * -1);
  }

  if (borders?.top || borders?.bottom) {
    animateY(ball, ball.vy * -1);
  }

  // animate based on the paddle collision
  if (paddleCollision === 'top') {
    animateY(ball, ball.vy * -1);
  }
};
