import * as PIXI from 'pixi.js';
import { Config, GameObject, GameState } from './types';
import * as anim from './animations';
import { paddleSetup, ballSetup, bricksSetup } from './setup';
import { keyboard } from './event-listeners';
import Bricks from './models/brick-container';
import Ball from './models/ball';
import Paddle from './models/paddle';

export const play = (
  resources: PIXI.utils.Dict<PIXI.LoaderResource>,
  app: PIXI.Application,
  config: Config
) => {
  const state: GameState = {
    config,
    renderList: {
      bricks: new Bricks(),
      ball: new Ball(resources.ball.texture),
      paddle: new Paddle(resources.paddle.texture),
    },
  };

  const { renderList } = state;

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
    renderList.paddle === undefined ||
    renderList.ball === undefined ||
    renderList.bricks === undefined
  ) {
    throw new Error(
      'State is incomplete. Check the loader function to make sure the resources were loaded properly'
    );
  }

  // initialize the arrow key listeners and add the animation callbacks
  const leftKeySettings = keyboard('ArrowLeft');
  const rightKeySettings = keyboard('ArrowRight');
  leftKeySettings.press = () => {
    anim.animateX(renderList.paddle, -5);
  };
  leftKeySettings.release = () => {
    if (renderList.paddle?.vx && renderList.paddle.vx < 0) {
      anim.endXAnimation(renderList.paddle);
    }
  };
  rightKeySettings.press = () => {
    anim.animateX(renderList.paddle, 5);
  };
  rightKeySettings.release = () => {
    if (renderList.paddle?.vx && renderList.paddle.vx > 0) {
      anim.endXAnimation(renderList.paddle);
    }
  };

  // add and render the sprites to the stage
  app.stage.addChild(...Object.values<GameObject>(renderList));

  // start the game loop
  app.ticker.add((delta: number) => {
    // check the paddle's position and update the velocity as necessary.
    anim.updatePaddleVelocity(renderList.paddle, config);
    // check the ball's position and change it if it hits a side or the paddle
    anim.updateBallVelocity(
      renderList.paddle,
      renderList.ball,
      renderList.bricks?.children,
      config
    );

    // animate the ball
    if (renderList.ball?.vx) {
      renderList.ball.x += delta * renderList.ball.vx;
    }
    if (renderList.ball?.vy) {
      renderList.ball.y += delta * renderList.ball.vy;
    }

    // animate the paddle
    if (renderList.paddle?.vx) {
      renderList.paddle.x += delta * renderList.paddle.vx;
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
