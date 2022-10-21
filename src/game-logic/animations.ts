import { Container, DisplayObject } from 'pixi.js';
import {
  SpriteWithVelocity,
  BallSprite,
  GameState,
  Config,
  Brick,
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
  paddle: SpriteWithVelocity | undefined,
  config: Config
) => {
  // check whether the paddle is touching a border
  // but first make a type guard to ensure the function doesn't operate on an undefined value
  if (typeof paddle === 'undefined') return;
  const { borders } = borderCollisionTest(paddle, config);
  if (typeof paddle.vx === 'number' && borders?.left && paddle.vx < 0) {
    endXAnimation(paddle);
  } else if (typeof paddle.vx === 'number' && borders?.right && paddle.vx > 0) {
    endXAnimation(paddle);
  }
};

export const updateBallVelocity = (
  paddle: SpriteWithVelocity | undefined,
  ball: BallSprite | undefined,
  brickGrid: DisplayObject[] | undefined,
  config: Config
) => {
  if (
    typeof ball === 'undefined' ||
    typeof paddle === 'undefined' ||
    !ball.vx ||
    !ball.vy ||
    paddle.vx === undefined
  )
    return ball;

  // all checks go here
  const { borders } = borderCollisionTest(ball, config);
  const { paddleCollision } = paddleAndBallCollisionTest(paddle, ball);
  const brickCollision = ballAndBrickCollisionTest(ball, brickGrid);
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
