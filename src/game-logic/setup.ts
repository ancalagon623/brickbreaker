import { Texture } from 'pixi.js';
import Brick from './models/brick';
import Bricks from './models/brick-container';
import State from './models/state';

export const paddleSetup = (state: State) => {
  const {
    renderList: { paddle },
    app: { renderer },
  } = state;

  // resize the paddle and set in the middle of the screen
  paddle.scale.set(0.4, 0.4);
  paddle.anchor.set(0.5);
  paddle.position.set(
    renderer.view.width / 2,
    renderer.view.height - (paddle.height / 2) * 1.1
  );
};

export const ballSetup = (state: State) => {
  const {
    renderList: { ball, paddle },
    app: { renderer },
  } = state;

  // Give the ball a velocity to be used in the game loop.
  ball.vx = 4;
  ball.vy = -4;

  // resize the ball and set ontop of the paddle
  ball.scale.set(0.05, 0.05);
  ball.anchor.set(0.5);
  ball.position.set(
    (renderer.view.width - ball.texture.width * 0.05) / 2,
    renderer.view.height - (paddle ? paddle.texture.height : 0) * 0.4
  );
};

export const bricksSetup = (state: State, textures: { brick: Texture }) => {
  const numberOfRows = 8;
  const bricksPerRow = 16;
  const brickSlotWidth = state.app.renderer.view.width / bricksPerRow;
  const brickSlotHeight = (state.app.renderer.view.height * 0.4) / numberOfRows;

  const bricksContainer = new Bricks();

  for (let i = 0; i < numberOfRows; i += 1) {
    for (let j = 0; j < bricksPerRow; j += 1) {
      const newBrick = new Brick(state, textures.brick);

      newBrick.width = brickSlotWidth - 10;
      newBrick.height = brickSlotHeight - 10;
      newBrick.anchor.set(0.5);
      newBrick.position.set(
        brickSlotWidth * j + brickSlotWidth / 2,
        brickSlotHeight * i + brickSlotHeight / 2
      );
      bricksContainer.addChild(newBrick);
    }
  }

  state.renderList.bricks = bricksContainer;
};
