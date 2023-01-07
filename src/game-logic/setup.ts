import { utils } from 'pixi.js';
import Brick from './models/brick';
import Bricks from './models/brick-container';
import BrickTier2 from './models/brick-tier-2';
import type State from './models/state';

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

  ball.lost = false;

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

function sampleWithoutReplacement(choices: any[]) {
  const randIndex = Math.floor(Math.random() * (choices.length - 1));

  // remove the item
  const item = choices.splice(randIndex, 1);
  return item[0];
}

function createBrickFromType(state: State, type: number): Brick {
  switch (type) {
    case 1:
      return new Brick(state, utils.TextureCache.brick1);
    case 2:
      return new BrickTier2(state, utils.TextureCache.brick2);
    default:
      return new Brick(state, utils.TextureCache.brick1);
  }
}

function createBricks(state: State, ...amounts: number[]) {
  const result: Brick[] = [];

  amounts.forEach((num, index) => {
    for (let i = 0; i < num; i += 1) {
      result.push(createBrickFromType(state, index + 1));
    }
  });

  return result;
}

export const bricksSetup = (state: State) => {
  // populate the brick container
  const numberOfRows = 4;
  const bricksPerRow = 8;
  const brickSlotWidth = state.app.renderer.view.width / bricksPerRow;
  const brickSlotHeight = (state.app.renderer.view.height * 0.4) / numberOfRows;
  const typeRatio = { type1: 0.8, type2: 0.2 };
  const type1Amount = Math.floor(numberOfRows * bricksPerRow * typeRatio.type1);
  const type2Amount = Math.ceil(numberOfRows * bricksPerRow * typeRatio.type2);

  if (state.renderList.bricks.children.length) {
    state.renderList.bricks.children.forEach((b) => b.destroy());
    state.renderList.bricks.children = [];
  }

  const brickArray = createBricks(state, type1Amount, type2Amount);

  for (let i = 0; i < numberOfRows; i += 1) {
    for (let j = 0; j < bricksPerRow; j += 1) {
      const newBrick = sampleWithoutReplacement(brickArray);

      newBrick.width = brickSlotWidth - 10;
      newBrick.height = brickSlotHeight - 10;
      newBrick.anchor.set(0.5);
      newBrick.position.set(
        brickSlotWidth * j + brickSlotWidth / 2,
        brickSlotHeight * i + brickSlotHeight / 2
      );
      state.renderList.bricks.addChild(newBrick);
    }
  }
};
