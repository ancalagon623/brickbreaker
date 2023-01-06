import styled from 'styled-components';
import './index.css';
import Header from './components/Header';
import Content from './components/Content';

function App() {
  return (
    <AppContainer className="App">
      <Header />
      <Content />
    </AppContainer>
  );
}

const AppContainer = styled.div`
  height: 100vh;
  width: 100vw;
`;

export default App;
