import { AbstractRenderer, Renderer } from 'pixi.js';
import {
  SpriteWithVelocity,
  BallSprite,
  Collisions,
  BrickSprite,
  PaddleSprite,
} from './types';
import {
  ballAndBrickCollisionTest,
  borderCollisionTest,
  paddleAndBallCollisionTest,
} from './tests';

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
  paddle: PaddleSprite,
  renderer: Renderer | AbstractRenderer
) => {
  // check whether the paddle is touching a border

  const { borderCollision } = borderCollisionTest(paddle, renderer);
  if (typeof paddle.vx === 'number' && borderCollision?.left && paddle.vx < 0) {
    endXAnimation(paddle);
  } else if (borderCollision.right && paddle.vx > 0) {
    endXAnimation(paddle);
  }
};

export const updateBallVelocity = (
  paddle: PaddleSprite,
  ball: BallSprite,
  brickGrid: BrickSprite[],
  renderer: Renderer | AbstractRenderer
) => {
  // all checks go here

  const { borderCollision } = borderCollisionTest(ball, renderer);
  const { paddleCollision } = paddleAndBallCollisionTest(paddle, ball);
  const brickCollision = ballAndBrickCollisionTest(ball, brickGrid);
  // same process for changing the paddle velocity, only there are different rules for how the ball reflects off the walls.
  if (borderCollision.left) {
    animateX(ball, ball.vx * -1);
  }

  if (borderCollision.right) {
    animateX(ball, ball.vx * -1);
  }

  if (borderCollision.top || borderCollision.bottom) {
    animateY(ball, ball.vy * -1);
  }

  if (brickCollision === Collisions.Horizontal) {
    animateX(ball, ball.vx * -1);
  }

  if (brickCollision === Collisions.Vertical) {
    animateY(ball, ball.vy * -1);
  }

  // animate based on the paddle collision
  if (paddleCollision === Collisions.Vertical) {
    animateY(ball, ball.vy * -1);
  }

  if (paddleCollision === Collisions.Horizontal) {
    animateX(ball, ball.vx * -1);
  }
};
