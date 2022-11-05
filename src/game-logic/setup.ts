import { Sprite, Texture } from 'pixi.js';
import Paddle from './models/paddle';
import { GameState, Collisions } from './types';
import Ball from './models/ball';
import Brick from './models/brick';
import Bricks from './models/brick-container';

export const paddleSetup = (state: GameState) => {
  // Create the paddle and add to the game state.
  const {
    renderList: { paddle },
    config,
  } = state;

  // Give the paddle a velocity to be used in the game loop.
  paddle.vx = 0;
  paddle.borderCollision = {
    left: false,
    right: false,
    top: false,
    bottom: false,
  };
  // resize the paddle and set in the middle of the screen
  paddle.scale.set(0.4, 0.4);
  paddle.anchor.set(0.5);
  paddle.position.set(
    config.width / 2,
    config.height - (paddle.height / 2) * 1.1
  );
};

export const ballSetup = (state: GameState) => {
  const {
    renderList: { ball, paddle },
    config,
  } = state;

  // Give the paddle a velocity to be used in the game loop.
  ball.vx = 2;
  ball.vy = -2;
  ball.borderCollision = {
    left: false,
    right: false,
    top: false,
    bottom: false,
  };
  // resize the ball and set ontop of the paddle
  ball.scale.set(0.05, 0.05);
  ball.anchor.set(0.5);
  ball.position.set(
    (config.width - ball.texture.width * 0.05) / 2,
    config.height - (paddle ? paddle.texture.height : 0) * 0.4
  );
};

export const bricksSetup = (
  state: GameState,
  textures: { brick2: Texture }
) => {
  if (!state.config) return;
  const brickScale = 0.4;
  const adjustedWidth = textures.brick2.width * brickScale;
  const adjustedHeight = textures.brick2.height * brickScale;
  const numberOfRows = 6;
  const bricksPerRow = 10;
  const bricksContainer = new Bricks();
  const brickGrid = [];

  for (let i = 0; i < numberOfRows; i += 1) {
    const row: Array<Brick | Sprite> = [];
    for (let j = 0; j < bricksPerRow; j += 1) {
      // initialize the brick
      const newBrick = new Brick(textures.brick2);
      newBrick.ballCollision = {
        type: Collisions.None,
        _warning: Collisions.None,
        broken: false,
      };

      newBrick.anchor.set(0.5);
      newBrick.scale.set(brickScale);
      newBrick.position.set(
        (adjustedWidth + 10) * j,
        (adjustedHeight + 10) * i
      );
      row.push(newBrick);
    }
    brickGrid.push(row);
  }
  bricksContainer.addChild(...brickGrid.flat());
  bricksContainer.x = 10;
  bricksContainer.y = 10;
  bricksContainer.width = state.config.width - 50;
  bricksContainer.height = state.config.height - 0.7 * state.config.height;
  state.renderList.bricks = bricksContainer;
};
