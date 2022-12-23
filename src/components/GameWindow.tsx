import React, { useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import { Application } from 'pixi.js';
import { play } from '../game-logic';

const GameWindow = () => {
  const [app, init] = useState<Application | null>(null);

  useEffect(() => {
    const APP = new PIXI.Application({
      width: 800,
      height: 800,
      backgroundColor: 0x000000,
    });

    init(APP);
  }, []);

  useEffect(() => {
    if (app) {
      // pull out the DOM element directly and add the app view as a child
      const frame = document.getElementById('game-window');
      if (frame) {
        frame.appendChild(app.view);
      }

      // GAME SETUP --- Setup the game once all texture data is loaded and accessible.
      // Load image resources.
      let cleanup;
      const loader = new PIXI.Loader();
      loader.add('paddle', 'images/paddle-bg-removed.png');
      loader.add('ball', 'images/test-ball.png');
      loader.add('brick1', 'images/wood-brick.png');
      loader.add('brick2', 'images/brick-brick.png');
      loader.add('brick2_stage1', 'images/brick-brick-stage2.png');
      loader.load((ldr, resources) => {
        cleanup = play(app, resources);
      });
      return cleanup;
    }
  }, [app]);

  return <div id="game-window" />;
};

export default GameWindow;
