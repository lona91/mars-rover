import React from 'react';
import styled from 'styled-components';

import {SocketProvider} from '../socket'
import Grid from '../grid';
import Toast from '../toast';
import Commands from '../commands';
import History from '../history';

const Container = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  height: 100vh;
  width: 100vw;
`
const Content = styled.div`
  display: flex;
  flex-direction: column;
  
`;

const Flexbox = styled.div`
  display:flex;
`;

const App = () => <SocketProvider url="http://localhost:3000">
  <Toast/>
  <Container>
    <Content>
      <Flexbox>
        <Grid />
        <div>
          <h2>History</h2>

          <History />
        </div>
      </Flexbox>
      <Commands />
    </Content>
  </Container>
</SocketProvider>

export default App;