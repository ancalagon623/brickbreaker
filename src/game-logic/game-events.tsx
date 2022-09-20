// I had to specify the return value here because otherwise the returned type would be composite,
// and typescript expects it to be a simple type when assigning it as an argument in other functions.
export const borderCollisionTest = (
  sprite: SpriteWithVelocity | undefined
): SpriteWithVelocity => {
  // clear old borders collision check
  // first make a type check to ensure the sprite is not undefined
  if (typeof sprite === 'undefined') return new PIXI.Sprite();

  sprite.borders = {
    left: false,
    right: false,
    top: false,
    bottom: false,
  };

  if (
    sprite.borders &&
    sprite.x + sprite.texture.width * sprite.scale.x >= appConfig.w
  ) {
    sprite.borders.right = true;
  }
  if (sprite.borders && sprite.x <= 0) {
    sprite.borders.left = true;
  }
  // check vertical sides
  if (
    sprite.borders &&
    sprite.y + sprite.texture.height * sprite.scale.y >= appConfig.h
  ) {
    sprite.borders.bottom = true;
  }
  if (sprite.borders && sprite.y <= 0) {
    sprite.borders.top = true;
  }

  return sprite;
};

export const paddleAndBallCollisionTest = (
  paddle: SpriteWithVelocity | undefined,
  ball: BallSprite
): BallSprite => {
  if (typeof paddle === 'undefined' || !ball.vy) return ball;
  // reset old test
  ball.paddleCollision = undefined;
  const paddleWidth = paddle.texture.width * paddle.scale.x;
  const ballWidth = ball.texture.width * ball.scale.x;
  const ballHeight = ball.texture.height * ball.scale.y;
  // if ball is further than the paddle top and in between the paddle width then it has hit the paddle
  if (
    ball.y >= paddle.y - ballHeight &&
    ball.x > paddle.x &&
    ball.x < paddle.x + paddleWidth &&
    ball.vy > 0
  ) {
    // ball has collided with the top of the paddle
    ball.paddleCollision = 'top';
  }
  return ball;
};
