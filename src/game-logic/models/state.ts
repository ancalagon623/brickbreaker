import { Application, Container } from 'pixi.js';
import * as PIXI from 'pixi.js';
import Bricks from './brick-container';
import Ball from './ball';
import Paddle from './paddle';

export default class State {
  constructor(
    app: Application,
    resources: PIXI.utils.Dict<PIXI.LoaderResource>
  ) {
    // create and position the game sprites
    this.app = app;
    // turn off the game over scene
    this.gameOverRenderList.root.visible = false;
    // create the sprites
    this.renderList.ball = new Ball(resources.ball.texture);
    this.renderList.paddle = new Paddle(resources.paddle.texture);
    this.gameOverRenderList.gameOverText.anchor.set(0.5);
    this.gameOverRenderList.gameOverText.position.set(
      app.renderer.view.width / 2,
      app.renderer.view.height / 2
    );

    this.renderList.scoreCounter.anchor.set(0.5);
    this.renderList.scoreCounter.position.set(
      app.renderer.view.width / 2,
      app.renderer.view.height * 0.8
    );
    this.renderList.scoreCounter.zIndex = 0;

    this.renderList.root.addChild(...Object.values(this.renderList));
    this.gameOverRenderList.root.addChild(this.gameOverRenderList.gameOverText);
  }

  app: Application;

  score = 0;

  increaseScore(num: number) {
    this.score += num;
    // anything that's supposed to happen when the score changes takes place here
    this.renderList.scoreCounter.text = `Score: ${this.score}`;
  }

  gameOverRenderList = {
    root: new Container(),
    gameOverText: new PIXI.Text(`Game Over!\nFinal Score: ${this.score}`, {
      fill: '#00FFFF',
      fontSize: 30,
      fontWeight: '700',
    }),
  };

  renderList = {
    root: new Container(),
    bricks: new Bricks(),
    ball: new Ball(),
    paddle: new Paddle(),
    scoreCounter: new PIXI.Text('Score: 0', { fill: '#005588' }),
  };
}
