import * as PIXI from 'pixi.js';
import MovingSprite from './models/base-models/moving-sprite';
import {
  Config,
  SpriteWithVelocity,
  BallSprite,
  BrickSprite,
  Collisions,
  PaddleSprite,
} from './types';

// I had to specify the return value here because otherwise the returned type would be composite,
// and typescript expects it to be a simple type when assigning it as an argument in other functions.
export const borderCollisionTest = (
  sprite: SpriteWithVelocity | undefined,
  config: Config
): SpriteWithVelocity => {
  // clear old borders collision check
  // first make a type check to ensure the sprite is not undefined
  if (typeof sprite === 'undefined' || !config) return new MovingSprite();

  sprite.borderCollision = {
    left: false,
    right: false,
    top: false,
    bottom: false,
  };

  const halfWidth = 0.5 * sprite.width;
  const halfHeight = 0.5 * sprite.height;

  if (sprite.x + halfWidth >= config.width) {
    sprite.borderCollision.right = true;
  }
  if (sprite.x <= halfWidth) {
    sprite.borderCollision.left = true;
  }
  // check vertical sides
  if (sprite.y + halfHeight >= config.height) {
    sprite.borderCollision.bottom = true;
  }
  if (sprite.y <= halfHeight) {
    sprite.borderCollision.top = true;
  }

  return sprite;
};

export const paddleAndBallCollisionTest = (
  paddle: PaddleSprite,
  ball: BallSprite
): BallSprite => {
  // reset old test
  ball.paddleCollision = Collisions.None;
  // if ball is further than the paddle top and in between the paddle width then it has hit the paddle
  if (
    ball.y >= paddle.y - ball.height &&
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.width &&
    ball.vy > 0
  ) {
    // ball has collided with the top of the paddle
    ball.paddleCollision = Collisions.Vertical;
  }
  return ball;
};

export const ballAndBrickCollisionTest = (
  ball: BallSprite,
  brickGrid: BrickSprite[]
) => {
  // type check
  if (!brickGrid) return Collisions.None;
  // the ball has collided with a brick when the vertical and horizontal distance from their anchors are both less than the sum of half their respective widths and heights.
  // The simplest way to do this would be to loop through the brickgrid and test the distance from every brickto find any bricks the ball is currently colliding with, and whether the collision is vertical or horizontal.

  console.log(brickGrid);

  // 1. Filter the brickgrid by
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
