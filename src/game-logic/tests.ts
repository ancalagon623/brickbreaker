import * as PIXI from 'pixi.js';
import {
  SpriteWithVelocity,
  BallSprite,
  BrickSprite,
  Collisions,
  PaddleSprite,
} from './types';

export const borderCollisionTest = (
  sprite: SpriteWithVelocity,
  renderer: PIXI.Renderer | PIXI.AbstractRenderer
): SpriteWithVelocity => {
  // clear old borders collision check

  sprite.borderCollision = {
    left: false,
    right: false,
    top: false,
    bottom: false,
  };

  const halfWidth = 0.5 * sprite.width;
  const halfHeight = 0.5 * sprite.height;

  if (sprite.x + halfWidth >= renderer.view.width && sprite.vx > 0) {
    sprite.borderCollision.right = true;
  }
  if (sprite.x <= halfWidth && sprite.vx < 0) {
    sprite.borderCollision.left = true;
  }
  // check vertical sides
  if (sprite.y + halfHeight >= renderer.view.height && sprite.vy > 0) {
    sprite.borderCollision.bottom = true;
  }
  if (sprite.y <= halfHeight && sprite.vy < 0) {
    sprite.borderCollision.top = true;
  }

  return sprite;
};

export const paddleAndBallCollisionTest = (
  paddle: PaddleSprite,
  ball: BallSprite
): BallSprite => {
  const paddleHalfHeight = paddle.height * 0.5;
  const paddleHalfWidth = paddle.width * 0.5;
  const ballHalfHeight = ball.height * 0.5;
  const ballHalfWidth = ball.width * 0.5;

  if (
    ballHalfHeight + paddleHalfHeight >= Math.abs(ball.y - paddle.y) &&
    ballHalfWidth + paddleHalfWidth >= Math.abs(ball.x - paddle.x) &&
    ball.x >= paddle.x - paddleHalfWidth &&
    ball.x <= paddle.x + paddleHalfWidth &&
    ball.vy > 0
  ) {
    // ball is inside the paddle's space. If it's the first time this has happened, then turn a collision has happened
    if (ball.paddleCollision === Collisions.None) {
      ball.paddleCollision = Collisions.Vertical;
      // debugger;
    } else {
      ball.paddleCollision = Collisions.Ongoing;
      // debugger;
    }
  } else if (ball.paddleCollision !== Collisions.None) {
    // ball is no longer inside the paddle's space, so reset the old test
    ball.paddleCollision = Collisions.None;
    // debugger;
  }
  return ball;
};

export const ballAndBrickCollisionTest = (
  ball: BallSprite,
  brickGrid: BrickSprite[]
) => {
  // the ball has collided with a brick when the vertical and horizontal distance from their anchors are both less than the sum of half their respective widths and heights.
  // The simplest way to do this would be to loop through the brickgrid and test the distance from every brickto find any bricks the ball is currently colliding with, and whether the collision is vertical or horizontal.

  // 1. Filter the bricks that have been hit
  const hitBricks = brickGrid.filter((brick) => {
    const globalBrickCenter = brick.toGlobal(new PIXI.Point(0, 0));
    // ignore this brick if it's already been hit
    if (brick.ballCollision.broken === true) return false;

    const yDiff = Math.abs(globalBrickCenter.y - ball.y);
    const xDiff = Math.abs(globalBrickCenter.x - ball.x);
    const yLimit = brick.height / 2 + ball.height / 2;
    const xLimit = brick.width / 2 + ball.width / 2;

    let brokenYLimit = 0;
    let brokenXLimit = 0;

    if (yDiff <= yLimit) {
      brokenYLimit = Math.abs(yLimit - yDiff);
    }

    if (xDiff <= xLimit) {
      brokenXLimit = Math.abs(xLimit - xDiff);
    }

    if (brokenXLimit > 0 && brokenYLimit > 0) {
      // collision, find out which one and assign it to type
      brick.ballCollision.type =
        brick.ballCollision._warning === Collisions.Horizontal
          ? Collisions.Horizontal
          : Collisions.Vertical;
      brick.break();
      return true;
    }
    // if no collision has happened but one of the limits broke then a flag is turned on to note what collision may happen next.
    if (brokenXLimit === 0 && brokenYLimit === 0) {
      brick.ballCollision._warning = Collisions.None;
    } else if (brokenYLimit > 0) {
      brick.ballCollision._warning = Collisions.Horizontal;
    } else {
      // only the x limit has been broken
      brick.ballCollision._warning = Collisions.Vertical;
    }

    return false;
  });

  const collisionTypeCounter = hitBricks.reduce(
    (acc, brick) => {
      if (brick.ballCollision?.type === Collisions.Vertical) {
        acc.v += 1;
        return acc;
      }
      acc.h += 1;
      return acc;
    },
    { h: 0, v: 0 }
  );

  if (!collisionTypeCounter.h && !collisionTypeCounter.v)
    return Collisions.None;
  if (collisionTypeCounter.h >= collisionTypeCounter.v)
    return Collisions.Horizontal;
  return Collisions.Vertical;
};
