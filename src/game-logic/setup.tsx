import type { Texture } from 'pixi.js';
import { GameState } from './types';

export const paddleSetup = (state: GameState, texture: Texture) => {
  // Create the paddle and add to the game state.
  state.paddle = new PIXI.Sprite(texture);
  if (!state.paddle) return; // type checking

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

export const ballSetup = (state: GameState, texture: Texture) => {
  // Create the paddle and add to the game state.
  state.ball = new PIXI.Sprite(texture);
  if (!state.ball) return;

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

export const bricksSetup = (
  state: GameState,
  textures: { brick2: Texture }
) => {
  const brickScale = 0.4;
  const adjustedWidth = textures.brick2.width * brickScale;
  const adjustedHeight = textures.brick2.height * brickScale;
  const numberOfRows = 6;
  const bricksPerRow = Math.floor(appConfig.w / (adjustedWidth + 20));
  state.brickGrid = [];

  for (let i = 0; i < numberOfRows; i += 1) {
    const row: Sprite[] = [];
    for (let j = 0; j < bricksPerRow; j += 1) {
      const newBrick = new Sprite(textures.brick2);
      if (!newBrick) {
        row.push(new Sprite());
      } else {
        newBrick.scale.set(brickScale);
        newBrick.position.set(
          10 + (adjustedWidth + 10) * j,
          10 + (adjustedHeight + 10) * i
        );
        row.push(newBrick);
      }
    }
    state.brickGrid.push(row);
  }
};
