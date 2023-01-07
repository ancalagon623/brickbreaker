import styled from 'styled-components';

export const ControlBox = styled.div`
  width: max-content;
  margin: 0 auto;
`;

export const Button = styled.button`
  all: unset;
  background-color: green;
  border: none;
  margin: 5px;
  padding: 0.5rem 1rem;
  font-size: 1.5rem;
  font-family: 'Kanit', sans-serif;
  &:hover {
    background-color: #085508;
    cursor: pointer;
  }
  &:active {
    transform: scale(0.9);
  }
  border-radius: 5px;
`;
