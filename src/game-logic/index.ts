import * as PIXI from 'pixi.js';
import * as anim from './animations';
import { paddleSetup, ballSetup, bricksSetup } from './setup';
import { keyboard } from './event-listeners';
import State from './models/state';

export const play = (
  app: PIXI.Application,
  resources: PIXI.utils.Dict<PIXI.LoaderResource>
) => {
  const state = new State(app, resources);
  const { renderList, gameOverRenderList } = state;
  const updaters = {
    stop(delta: number) {
      renderList.root.visible = false;
      gameOverRenderList.root.visible = true;
    },
    run(delta: number) {
      // check the paddle's position and update the velocity as necessary.
      anim.updatePaddleVelocity(renderList.paddle, app.renderer);
      // check the ball's position and change it if it hits a side or the paddle
      anim.updateBallVelocity(
        renderList.paddle,
        renderList.ball,
        renderList.bricks.children,
        app.renderer
      );

      // animate the ball
      if (renderList.ball.vx) {
        renderList.ball.x += delta * renderList.ball.vx;
      }
      if (renderList.ball.vy) {
        renderList.ball.y += delta * renderList.ball.vy;
      }
      if (renderList.ball.lost) {
        renderList.ball.visible = false;
      }
      if (renderList.paddle.vx) {
        // animate the paddle
        renderList.paddle.x += delta * renderList.paddle.vx;
      }

      if (renderList.ball.lost) {
        updateState = this.stop.bind(this);
      }
    },
  };

  let updateState: (delta: number) => void;

  updateState = updaters.run.bind(updaters);

  // Create paddle, ball, and brick sprites and add to the state object.
  if (
    resources.paddle.texture &&
    resources.ball.texture &&
    resources.brick2.texture
  ) {
    paddleSetup(state);
    ballSetup(state);
    bricksSetup(state, { brick: resources.brick2.texture });
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

  // start the game loop
  app.ticker.add((delta: number) => {
    updateState(delta);
  });

  // add and render the two to the stage
  app.stage.addChild(state.gameOverRenderList.root);
  app.stage.addChild(state.renderList.root);

  // return a cleanup function
  return () => {
    if (leftKeySettings.unsubscribe && rightKeySettings.unsubscribe) {
      leftKeySettings.unsubscribe();
      rightKeySettings.unsubscribe();
    }
  };
};
