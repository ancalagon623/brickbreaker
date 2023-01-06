import React from 'react';
import styled from 'styled-components';
import GameWindow from './GameWindow';

const rules = ['rule 1', 'rule 2', 'rule 3'];

const Content: React.FC = () => (
  <Main>
    <GameContainer>
      <GameWindow />
    </GameContainer>
  </Main>
);

export default Content;

const Main = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const GameContainer = styled.div`
  width: fit-content;
  position: absolute;
  top: calc(50% - var(--app-height) / 2);
  left: calc(50% - var(--app-width) / 2);
  margin: 0;
`;

const GameRules = styled.section`
  background-color: cornsilk;
`;

const RulesList = styled.article``;
