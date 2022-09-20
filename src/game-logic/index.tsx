import * as PIXI from 'pixi.js';
import { GameState } from './types';

// start the PIXI app that creates a loader, ticker, and renderer for us.
export const appConfig = { w: 640, h: 690 };

const app = new PIXI.Application({
  width: appConfig.w,
  height: appConfig.h,
  backgroundColor: 0x000000,
});

export const play = (resources: PIXI.utils.Dict<PIXI.LoaderResource>) => {
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
    state.brickGrid === undefined
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
  app.stage.addChild(...state.brickGrid.flat());

  // start the game loop
  app.ticker.add((delta: number) => {
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
