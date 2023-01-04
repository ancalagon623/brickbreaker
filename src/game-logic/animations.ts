import { AbstractRenderer, Renderer } from 'pixi.js';
import { SpriteWithVelocity, Collisions, PaddleSprite } from './types';
import {
  ballAndBrickCollisionTest,
  borderCollisionTest,
  paddleAndBallCollisionTest,
} from './tests';
import State from './models/state';

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
  if (borderCollision.left && paddle.vx < 0) {
    endXAnimation(paddle);
  } else if (borderCollision.right && paddle.vx > 0) {
    endXAnimation(paddle);
  }
};

export const updateBallVelocity = (state: State) => {
  // all checks go here

  const {
    renderList: { ball, paddle, bricks },
    app: { renderer },
  } = state;

  const { borderCollision } = borderCollisionTest(ball, renderer);
  const { paddleCollision } = paddleAndBallCollisionTest(paddle, ball);
  const brickCollision = ballAndBrickCollisionTest(ball, bricks.children);
  // same process for changing the paddle velocity, only there are different rules for how the ball reflects off the walls.
  if (borderCollision.left) {
    ball.x += ball.width;
    animateX(ball, ball.vx * -1);
  }

  if (borderCollision.right) {
    animateX(ball, ball.vx * -1);
  }

  if (borderCollision.top) {
    animateY(ball, ball.vy * -1);
  }

  if (brickCollision === Collisions.Horizontal) {
    animateX(ball, ball.vx * -1);
  }

  if (brickCollision === Collisions.Vertical) {
    animateY(ball, ball.vy * -1);
  }

  if (
    paddleCollision === Collisions.Vertical ||
    paddleCollision === Collisions.Horizontal
  ) {
    ball.collideWithPaddle(paddle);
  }

  if (ball.y >= ball.height / 2 + renderer.view.height) {
    // ball has past the bottom threshold
    ball.lost = true;
  }
};
