import { Application, Container } from 'pixi.js';
import * as PIXI from 'pixi.js';
// import { Listeners } from '../types';
import Bricks from './brick-container';
import Ball from './ball';
import Paddle from './paddle';
import * as su from '../setup';

export default class State {
  constructor(
    app: Application,
    resources: PIXI.utils.Dict<PIXI.LoaderResource>
  ) {
    this.app = app;
    // turn off the game over scene
    this.gameOverRenderList.root.visible = false;
    // create and position the game sprites
    this.renderList.ball = new Ball(resources.ball.texture);
    this.renderList.paddle = new Paddle(resources.paddle.texture);

    Object.values(this.gameOverRenderList).forEach((displayObj) => {
      if (displayObj instanceof PIXI.Text) {
        displayObj.anchor.set(0.5);
        displayObj.position.set(
          app.renderer.view.width / 2,
          app.renderer.view.height / 2
        );
      }
    });

    this.renderList.scoreCounter.anchor.set(0.5);
    this.renderList.scoreCounter.position.set(
      app.renderer.view.width / 2,
      app.renderer.view.height * 0.8
    );
    this.renderList.scoreCounter.zIndex = 0;

    this.renderList.root.addChild(...Object.values(this.renderList));
    this.gameOverRenderList.root.addChild(
      ...Object.values(this.gameOverRenderList)
    );
  }

  styles = {
    gameWonStyle: new PIXI.TextStyle({
      fontSize: 30,
      fontFamily: 'Kanit',
      fill: '#00FFFF',
    }),
    gameLostStyle: new PIXI.TextStyle({
      fontSize: 30,
      fontFamily: 'Kanit',
      fontWeight: '600',
      fill: '#FF0000',
      stroke: '#FFFFFF',
    }),
    inGame: new PIXI.TextStyle({
      fill: '#005588',
      fontFamily: 'Kanit',
    }),
  };

  app: Application;

  score = 0;

  private game = 'playing';

  togglePause = () => {
    if (this.app.ticker.started) {
      this.app.ticker.stop();
    } else {
      this.app.ticker.start();
    }
  };

  get gameStatus() {
    return this.game;
  }

  // listeners: Listeners = {};

  // reportStateChange() {
  //   for (const property in this.listeners) {
  //     if (this.listeners.isOwnProperty(property)) {
  //       this.listeners[property](this);
  //     }
  //   }
  // }

  replay() {
    this.setScore(0);
    this.game = 'playing';

    su.ballSetup(this);
    su.bricksSetup(this);
    su.paddleSetup(this);

    // this.reportStateChange();

    if (!this.app.ticker.started) {
      this.app.ticker.start();
    }
  }

  updateGameStatus() {
    if (this.renderList.ball.lost) {
      this.game = 'lost';
    }
    if (!this.renderList.ball.lost) {
      if (this.renderList.bricks.children.every((b) => b.visible === false)) {
        this.game = 'won';
      } else {
        this.game = 'playing';
      }
    }
  }

  increaseScore(num: number) {
    this.score += num;
    // anything that's supposed to happen when the score changes takes place here
    this.renderList.ball.increaseVelocityByScore(num);
    this.renderList.scoreCounter.text = `Score: ${this.score}`;
  }

  setScore(num: number) {
    if (num < 0) {
      return;
    }
    this.score = num;
    this.renderList.scoreCounter.text = `Score: ${this.score}`;
  }

  gameOverRenderList = {
    root: new Container(),
    gameWonText: new PIXI.Text(
      `You won!\nFinal Score: ${this.score}`,
      this.styles.gameWonStyle
    ),
    gameLostText: new PIXI.Text(
      `Game Over\nFinal Score: ${this.score}`,
      this.styles.gameLostStyle
    ),
  };

  renderList = {
    root: new Container(),
    bricks: new Bricks(),
    ball: new Ball(),
    paddle: new Paddle(),
    scoreCounter: new PIXI.Text(`Score: ${this.score}`, this.styles.inGame),
  };
}
