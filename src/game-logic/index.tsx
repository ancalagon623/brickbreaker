import * as PIXI from 'pixi.js';
import type { Sprite } from '@pixi/sprite';
import type { Texture } from 'pixi.js';

// start the PIXI app that creates a loader, ticker, and renderer for us.
export const appConfig = { w: 640, h: 690 };

const app = new PIXI.Application({
  width: appConfig.w,
  height: appConfig.h,
  backgroundColor: 0x000000,
});

// NOTE TYPES ------------------------------------------

interface SpriteWithVelocity extends Sprite {
  vx?: number;
  vy?: number;
  borders?: {
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
  };
}

interface BallSprite extends SpriteWithVelocity {
  paddleCollision?: string;
}

// Input listeners for the game control keys
interface KeyObject {
  value: string;
  [key: string]: any;
  press?: () => void;
  release?: () => void;
  downHandler?: (event: KeyboardEvent) => void;
  upHandler?: (event: KeyboardEvent) => void;
  unsubscribe?: () => void;
}

// Game State Object
interface GameState {
  [key: string]: any;
  paddle?: SpriteWithVelocity;
  ball?: BallSprite;
}

// NOTE FUNCTIONS --------------------------------------------------------

// Function that adds a listener for a key and creates a settings object for that key to which you can add press and release event callbacks.
function keyboard(value: string) {
  const key: KeyObject = {
    value,
    isDown: false,
    isUp: true,
    press: undefined,
    release: undefined,
  };

  // The `downHandler`
  key.downHandler = (event) => {
    if (event.key === key.value) {
      if (key.isUp && key.press) {
        key.press();
      }
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };

  // The `upHandler`
  key.upHandler = (event) => {
    if (event.key === key.value) {
      if (key.isDown && key.release) {
        key.release();
      }
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };

  // Attach event listeners
  const downListener = key.downHandler.bind(key);
  const upListener = key.upHandler.bind(key);

  window.addEventListener('keydown', downListener, false);
  window.addEventListener('keyup', upListener, false);

  // Detach event listeners
  key.unsubscribe = () => {
    window.removeEventListener('keydown', downListener);
    window.removeEventListener('keyup', upListener);
  };

  return key;
}

const paddleSetup = (state: GameState, texture: Texture) => {
  // Create the paddle and add to the game state.
  state.paddle = new PIXI.Sprite(texture);
  // Give the paddle a velocity to be used in the game loop.
  state.paddle.vx = 0;
  state.paddle.borders = {
    left: false,
    right: false,
    top: false,
    bottom: false,
  };
  // resize the paddle and set in the middle of the screen
  state.paddle.scale.set(0.4, 0.4);
  state.paddle.position.set(
    (appConfig.w - state.paddle.texture.width * 0.4) / 2,
    appConfig.h - state.paddle.texture.height * 0.4 * 1.1
  );
};

const ballSetup = (state: GameState, texture: Texture) => {
  // Create the paddle and add to the game state.
  state.ball = new PIXI.Sprite(texture);
  // Give the paddle a velocity to be used in the game loop.
  state.ball.vx = 2;
  state.ball.vy = -2;
  state.ball.borders = {
    left: false,
    right: false,
    top: false,
    bottom: false,
  };
  // resize the ball and set ontop of the paddle
  state.ball.scale.set(0.05, 0.05);
  state.ball.position.set(
    (appConfig.w - state.ball.texture.width * 0.05) / 2,
    appConfig.h - (state.paddle ? state.paddle.texture.height : 0) * 0.4
  );
};

const bricksSetup = (
  state: GameState,
  textures: { [key: string]: Texture }
) => {};

// I had to specify the return value here because otherwise the returned type would be composite,
// and typescript expects it to be a simple type when assigning it as an argument in other functions.
const borderCollisionTest = (
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

const paddleAndBallCollisionTest = (
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

// define a function that allows us to change the velocity of the sprite.
const animateX = (sprite: SpriteWithVelocity | undefined, velocity: number) => {
  if (sprite) {
    sprite.vx = velocity;
  }
};

const animateY = (sprite: SpriteWithVelocity | undefined, velocity: number) => {
  if (sprite) {
    sprite.vy = velocity;
  }
};

const endXAnimation = (sprite: SpriteWithVelocity) => {
  sprite.vx = 0;
};

const updatePaddleVelocity = (paddle: SpriteWithVelocity | undefined) => {
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

const updateBallVelocity = (
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

// NOTE APPLICATION SETUP -----------------------------------

export const gameSetup = (resources: PIXI.utils.Dict<PIXI.LoaderResource>) => {
  const state: GameState = {};

  // Create paddle, ball, and brick sprites and add to the state object.
  if (
    resources.paddle.texture &&
    resources.ball.texture &&
    resources.brick2.texture
  ) {
    paddleSetup(state, resources.paddle.texture);
    ballSetup(state, resources.ball.texture);
    bricksSetup(state, { brick2: resources.brick2.texture });
  }

  if (
    state.paddle === undefined ||
    state.ball === undefined ||
    state.brick2 === undefined
  ) {
    throw new Error(
      'State is incomplete. Check the loader function to make sure the resources were loaded properly'
    );
  }

  // initialize the arrow key listeners and add the animation callbacks
  const leftKeySettings = keyboard('ArrowLeft');
  const rightKeySettings = keyboard('ArrowRight');
  leftKeySettings.press = () => {
    animateX(state.paddle, -5);
  };
  leftKeySettings.release = () => {
    if (state.paddle?.vx && state.paddle.vx < 0) {
      endXAnimation(state.paddle);
    }
  };
  rightKeySettings.press = () => {
    animateX(state.paddle, 5);
  };
  rightKeySettings.release = () => {
    if (state.paddle?.vx && state.paddle.vx > 0) {
      endXAnimation(state.paddle);
    }
  };

  // add and render the sprites to the stage
  app.stage.addChild(state.paddle, state.ball);

  // start the game loop
  app.ticker.add((delta) => {
    // check the paddle's position and update the velocity as necessary.
    updatePaddleVelocity(state.paddle);
    // check the ball's position and change it if it hits a side or the paddle
    updateBallVelocity(state.paddle, state.ball);

    // animate the ball
    if (state.ball?.vx) {
      state.ball.x += delta * state.ball.vx;
    }
    if (state.ball?.vy) {
      state.ball.y += delta * state.ball.vy;
    }

    // animate the paddle
    if (state.paddle?.vx) {
      state.paddle.x += delta * state.paddle.vx;
    }
  });

  // return a cleanup function
  return () => {
    if (leftKeySettings.unsubscribe && rightKeySettings.unsubscribe) {
      leftKeySettings.unsubscribe();
      rightKeySettings.unsubscribe();
    }
  };
};

export default app;
