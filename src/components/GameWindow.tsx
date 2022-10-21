import React, { useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import { Application } from 'pixi.js';
import { play } from '../game-logic';
import { Config } from '../game-logic/types';

const GameWindow = () => {
  const [app, init] = useState<Application | null>(null);
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    const c = {
      width: 600,
      height: 700,
    };
    const APP = new PIXI.Application({
      width: c.width,
      height: c.height,
      backgroundColor: 0x000000,
    });

    setConfig(c);
    init(APP);
  }, []);

  useEffect(() => {
    if (app && config) {
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
      loader.load((ldr, resources) => {
        cleanup = play(resources, app, config);
      });
      return cleanup;
    }
  }, [app]);

  return <div id="game-window" />;
};

export default GameWindow;
