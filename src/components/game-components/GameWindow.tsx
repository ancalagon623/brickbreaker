import React, { useEffect } from 'react';
import * as PIXI from 'pixi.js';
// eslint-disable-next-line
import { Sprite } from '@pixi/sprite';
import app, { appDimensions } from '../../game-logic';

const GameWindow = () => {
  useEffect(() => {
    // eslint-disable-next-line
    document.getElementById('game-window')!.appendChild(app.view);

    const frame = new PIXI.Graphics();
    frame.beginFill(0xff22ff).lineStyle({ color: 0x005555, width: 5 });
    frame.drawRect(0, 0, 100, 50);
    frame.position.set(0, 0);
    frame.endFill();

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

    const sprites: { [key: string]: Sprite } = {};

    const loader = new PIXI.Loader();
    loader.add('paddle', 'paddle-bg-removed.png');
    loader.load((ldr, resources) => {
      // Setup happens once all texture data is loaded and accessible.
      sprites.paddle = new PIXI.Sprite(resources.paddle.texture);
      sprites.paddle.scale.set(0.4, 0.4);
      sprites.paddle.position.set(
        (appDimensions.w - sprites.paddle.texture.width * 0.4) / 2,
        appDimensions.h - sprites.paddle.texture.height * 0.4 * 0.8
      );
      sprites.paddle.interactive = true;
      console.log(sprites.paddle);
      app.stage.addChild(sprites.paddle);
    });

    app.stage.addChild(frame);
  }, []);

  return <div id="game-window" />;
};

export default GameWindow;
