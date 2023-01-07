import { useState } from 'react';
import * as st from './GameWindow.styled';
import type State from '../game-logic/models/state';

interface ControlsProps {
  gameState: State | null;
}

const Controls = (props: ControlsProps) => {
  const { gameState } = props;
  const [paused, setPaused] = useState(false);

  const handlePause = () => {
    gameState?.togglePause();
    setPaused(!gameState?.app.ticker.started);
  };

  const handlePlayAgain = () => {
    gameState?.replay();
  };

  return (
    <st.ControlBox>
      <st.Button type="button" onClick={(e) => handlePause()}>
        {!gameState?.app.ticker.started ? 'Play' : 'Pause'}
      </st.Button>
      <st.Button type="button" onClick={(e) => handlePlayAgain()}>
        Play Again
      </st.Button>
    </st.ControlBox>
  );
};

export default Controls;
