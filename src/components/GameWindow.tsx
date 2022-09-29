import React, { useEffect } from 'react';
import * as PIXI from 'pixi.js';
import useWindowHeight from '../hooks/useWindowHeight';
import useWindowWidth from '../hooks/useWindowWidth';
import { app, play } from '../game-logic';

const GameWindow = () => {
  const windowWidth = useWindowWidth();
  const windowHeight = useWindowHeight();

  useEffect(() => {
    const frame = document.getElementById('game-window');
    if (frame) {
      app.resizeTo = window;
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
      cleanup = play(resources);
    });
    return cleanup;
  }, []);

  return <div id="game-window" />;
};

export default GameWindow;
