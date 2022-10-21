import * as PIXI from 'pixi.js';
import type { Texture } from 'pixi.js';
import { Sprite } from 'pixi.js';
import { GameState, Brick, Collisions, BrickContainer } from './types';

export const paddleSetup = (state: GameState, texture: Texture) => {
  // Create the paddle and add to the game state.
  const { renderList, config } = state;
  renderList.paddle = new PIXI.Sprite(texture);
  if (!renderList.paddle || !config) return; // type checking

  // Give the paddle a velocity to be used in the game loop.
  renderList.paddle.vx = 0;
  renderList.paddle.borders = {
    left: false,
    right: false,
    top: false,
    bottom: false,
  };
  // resize the paddle and set in the middle of the screen
  renderList.paddle.scale.set(0.4, 0.4);
  renderList.paddle.position.set(
    (config.width - renderList.paddle.texture.width * 0.4) / 2,
    config.height - renderList.paddle.texture.height * 0.4 * 1.1
  );
};

export const ballSetup = (state: GameState, texture: Texture) => {
  const { renderList, config } = state;
  // Create the paddle and add to the game state.
  renderList.ball = new PIXI.Sprite(texture);
  if (!renderList.ball || !config) return;

  // Give the paddle a velocity to be used in the game loop.
  renderList.ball.vx = 2;
  renderList.ball.vy = -2;
  renderList.ball.borders = {
    left: false,
    right: false,
    top: false,
    bottom: false,
  };
  // resize the ball and set ontop of the paddle
  renderList.ball.scale.set(0.05, 0.05);
  renderList.ball.anchor.set(0.5);
  renderList.ball.position.set(
    (config.width - renderList.ball.texture.width * 0.05) / 2,
    config.height -
      (renderList.paddle ? renderList.paddle.texture.height : 0) * 0.4
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
  const bricksContainer: BrickContainer = new PIXI.Container();
  const brickGrid = [];

  for (let i = 0; i < numberOfRows; i += 1) {
    const row: Array<Brick | Sprite> = [];
    for (let j = 0; j < bricksPerRow; j += 1) {
      // initialize the brick
      const newBrick: Brick = new Sprite(textures.brick2);
      newBrick.collision = {
        type: Collisions.None,
        _warning: Collisions.None,
        broken: false,
      };

      newBrick.anchor.set(0.5);
      if (!newBrick) {
        row.push(new Sprite());
      } else {
        newBrick.scale.set(brickScale);
        newBrick.position.set(
          (adjustedWidth + 10) * j,
          (adjustedHeight + 10) * i
        );
        row.push(newBrick);
      }
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
