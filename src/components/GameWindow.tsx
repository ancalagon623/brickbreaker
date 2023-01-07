import React, { useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import { Application } from 'pixi.js';
import WebFont from 'webfontloader';
import State from '../game-logic/models/state';
import { play } from '../game-logic';
import Controls from './Controls';

const getCSSVariable = (varname: string) => {
  const root = document.querySelector(':root');

  if (root) {
    return getComputedStyle(root).getPropertyValue(varname);
  }
  return null;
};

const GameWindow = () => {
  const [app, init] = useState<Application | null>(null);
  const [gameState, setGameState] = useState<State | null>(null);

  useEffect(() => {
    const widthString = getCSSVariable('--app-width')?.slice(0, -2);
    const heightString = getCSSVariable('--app-height')?.slice(0, -2);
    const APP = new PIXI.Application({
      width: widthString ? parseInt(widthString) : 800,
      height: heightString ? parseInt(heightString) : 400,
      backgroundColor: 0x000000,
    });

    PIXI.Ticker.system.autoStart = false;
    PIXI.Ticker.system.stop();
    PIXI.Ticker.shared.autoStart = false;
    PIXI.Ticker.shared.stop();

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
      WebFont.load({
        google: { families: ['Kanit'] },
      });
      loader.load((ldr, resources) => {
        const gameUtils = play(app, resources);
        cleanup = gameUtils.cleanup;
        setGameState(gameUtils.state);
      });
      return cleanup;
    }
  }, [app]);

  return (
    <>
      <div id="game-window" />
      <Controls gameState={gameState} />
    </>
  );
};

export default GameWindow;
