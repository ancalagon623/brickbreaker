import React, { EventHandler, useEffect } from 'react';
import * as PIXI from 'pixi.js';
// eslint-disable-next-line
import { Sprite } from '@pixi/sprite';
import app, { appDimensions } from '../../game-logic';

const GameWindow = () => {
  useEffect(() => {
    // eslint-disable-next-line
    document.getElementById('game-window')!.appendChild(app.view);

    /* 
    const frame = new PIXI.Graphics();
    frame.beginFill(0xff22ff).lineStyle({ color: 0x005555, width: 5 });
    frame.drawRect(0, 0, 100, 50);
    frame.position.set(0, 0);
    frame.endFill();
    */

    /* MASK TESTING
    const mask = new PIXI.Graphics();
    mask.beginFill(0xffffff);
    mask.drawRect(0, 0, 200, 200);
    mask.endFill();

    // Add container that will hold our masked content
    const maskContainer = new PIXI.Container();
    // Set the mask to use our graphics object from above
    maskContainer.mask = mask;
    // Add the mask as a child, so that the mask is positioned relative to its parent
    maskContainer.addChild(mask);
    // Offset by the window's frame width
    maskContainer.position.set(4, 4);
    // And add the container to the window!
    frame.addChild(maskContainer);

    // Create contents for the masked container
    const text = new PIXI.Text(
      'This text will scroll up and be masked, so you can see how masking works.  Lorem ipsum and all that.\n\n' +
        'You can put anything in the container and it will be masked!',
      {
        fontSize: 24,
        fill: 0x1010ff,
        wordWrap: true,
        wordWrapWidth: 180,
      }
    );
    text.x = 10;
    maskContainer.addChild(text);
    */

    interface SpriteWithVelocity extends Sprite {
      vx?: number;
      vy?: number;
      borders?: {
        left: boolean;
        right: boolean;
        top: boolean;
        bottom: boolean;
      };
    }

    const sprites: { [key: string]: SpriteWithVelocity } = {};

    // Creating input listeners for each key.
    interface KeyObject {
      value: string;
      [key: string]: any;
      press: undefined | (() => void);
      release: undefined | (() => void);
      downHandler?: (event: KeyboardEvent) => void;
      upHandler?: (event: KeyboardEvent) => void;
    }

    // Function that adds a listener for a key and creates a settings object for that key to which you can add callbacks for when a press or release event occurs on a key.
    function keyboard(value: string) {
      const key: KeyObject = {
        value,
        isDown: false,
        isUp: true,
        press: undefined,
        release: undefined,
      };

      // The `downHandler`
      key.downHandler = (event) => {
        if (event.key === key.value) {
          if (key.isUp && key.press) {
            key.press();
          }
          key.isDown = true;
          key.isUp = false;
          event.preventDefault();
        }
      };

      // The `upHandler`
      key.upHandler = (event) => {
        if (event.key === key.value) {
          if (key.isDown && key.release) {
            key.release();
          }
          key.isDown = false;
          key.isUp = true;
          event.preventDefault();
        }
      };

      // Attach event listeners
      const downListener = key.downHandler.bind(key);
      const upListener = key.upHandler.bind(key);

      window.addEventListener('keydown', downListener, false);
      window.addEventListener('keyup', upListener, false);

      // Detach event listeners
      key.unsubscribe = () => {
        window.removeEventListener('keydown', downListener);
        window.removeEventListener('keyup', upListener);
      };

      return key;
    }

    const borderCollisionTest = (sprite: SpriteWithVelocity) => {
      // clear old borders collision check
      sprite.borders = {
        left: false,
        right: false,
        top: false,
        bottom: false,
      };

      if (
        sprite.borders &&
        sprite.x + sprite.texture.width * appDimensions.scale >= appDimensions.w
      ) {
        sprite.borders.right = true;
      }
      if (sprite.borders && sprite.x <= 0) {
        sprite.borders.left = true;
      }
      // check vertical sides
      if (
        sprite.borders &&
        sprite.y + sprite.texture.height * appDimensions.scale >=
          appDimensions.h
      ) {
        sprite.borders.bottom = true;
      }
      if (sprite.borders && sprite.y <= 0) {
        sprite.borders.top = true;
      }

      return sprite;
    };

    // GAME SETUP --- Load Resources and setup once all texture data is loaded and accessible.
    // Load image resources.
    const loader = new PIXI.Loader();
    loader.add('paddle', 'paddle-bg-removed.png');
    loader.load((ldr, resources) => {
      // Create the paddle.
      sprites.paddle = new PIXI.Sprite(resources.paddle.texture);
      // Give the paddle a velocity to be used in the game loop.
      sprites.paddle.vx = 0;
      sprites.paddle.borders = {
        left: false,
        right: false,
        top: false,
        bottom: false,
      };
      sprites.paddle.scale.set(0.4, 0.4);
      sprites.paddle.position.set(
        (appDimensions.w - sprites.paddle.texture.width * 0.4) / 2,
        appDimensions.h - sprites.paddle.texture.height * 0.4 * 0.8
      );

      // NOTE Get the side arrows ready to receive input
      const animate = (paddle: SpriteWithVelocity, direction: string) => {
        if (direction === 'left') {
          paddle.vx = -5;
        }
        if (direction === 'right') {
          paddle.vx = 5;
        }
      };

      const endAnimation = (paddle: SpriteWithVelocity) => {
        paddle.vx = 0;
      };

      const leftKeySettings = keyboard('ArrowLeft');
      const rightKeySettings = keyboard('ArrowRight');
      leftKeySettings.press = () => {
        animate(sprites.paddle, 'left');
      };
      leftKeySettings.release = () => {
        if (sprites.paddle.vx && sprites.paddle.vx < 0) {
          endAnimation(sprites.paddle);
        }
      };
      rightKeySettings.press = () => {
        animate(sprites.paddle, 'right');
      };
      rightKeySettings.release = () => {
        if (sprites.paddle.vx && sprites.paddle.vx > 0) {
          endAnimation(sprites.paddle);
        }
      };

      // add and render the paddle sprite to the stage
      app.stage.addChild(sprites.paddle);

      // start the game loop
      app.ticker.add((delta) => {
        // check whether the paddle is touching the edge or going beyond it.
        const { borders } = borderCollisionTest(sprites.paddle);
        if (
          typeof sprites.paddle.vx === 'number' &&
          borders?.left &&
          sprites.paddle.vx < 0
        ) {
          endAnimation(sprites.paddle);
        } else if (
          typeof sprites.paddle.vx === 'number' &&
          borders?.right &&
          sprites.paddle.vx > 0
        ) {
          endAnimation(sprites.paddle);
        }

        // change the paddles position based on the vx property, which is updated by the callback on our key listeners.
        if (sprites.paddle.vx) {
          sprites.paddle.x += delta * sprites.paddle.vx;
        }
      });
    });
  }, []);

  return <div id="game-window" />;
};

export default GameWindow;
