import React from 'react';
import styled from 'styled-components';
import GameWindow from './GameWindow';

const rules = ['rule 1', 'rule 2', 'rule 3'];

const Content: React.FC = () => (
  <Main>
    <GameRules>
      {rules.map((rule, i) => (
        <p key={i}>{rule}</p>
      ))}
    </GameRules>
    <GameWindow />
  </Main>
);

export default Content;

const Main = styled.div`
  margin: 0 auto;
  width: 100%;
  display: flex;
`;

const GameRules = styled.section`
  background-color: cornsilk;
`;

const RulesList = styled.article``;
