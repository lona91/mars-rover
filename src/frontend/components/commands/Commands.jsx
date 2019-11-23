import React, {useState} from 'react';
import styled from 'styled-components'

import useSocket from '../socket';

const Command = styled.button`
  background: #63ADF2;
  color: white;
  outline: 0;
  cursor: pointer;
  border: 0;
  padding: 10px;
  border-radius: 5px;
  transition: box-shadow 300ms ease-in-out, transform 300ms ease-in-out;
  &:hover {
    box-shadow: 0 0 10px #63ADF2;
    transform: scale(1.05);
  }
`;
const Send = styled.button`
  background: #87C38F;
  color: white;
  outline: 0;
  cursor: pointer;
  border: 0;
  padding: 10px;
  border-radius: 5px;
  transition: box-shadow 300ms ease-in-out, transform 300ms ease-in-out;
  &:hover {
    box-shadow: 0 0 10px #87C38F;
    transform: scale(1.05);
  }
`;
const List = styled.ul`
  list-style: none;
  padding: 0;
  li {
    display: inline-block;
    margin-right: 8px;
  }
`;
const Input = styled.input`
border: 1px solid #d7d7d7;
border-radius: 5px;
padding: 10px 15px;
margin-right: 10px;
`;

const Container = styled.div`
  display: flex;
  justify-content:space-between;
  align-items: center;
`;


const Commands = () => {
  const socket = useSocket();
  const [command, setCommand] = useState('')

  return <div>
    <List>
      <li>
    <Command onClick={e => setCommand(`${command}r`)}>Rotate Right</Command></li>
      <li>
    <Command onClick={e => setCommand(`${command}l`)}>Rotate Left</Command></li>
      <li>
    <Command onClick={e => setCommand(`${command}f`)}>Move forward</Command></li>
      <li>
    <Command onClick={e => setCommand(`${command}b`)}>Move Backward</Command></li>
    </List>
    <Container>
      <Input type="text" value={command} onChange={(e) => setCommand(e.target.value)} />
      <Send onClick={() => {
        socket.emit('move', command);
        setCommand('');
      }}>Invia comandi</Send>
    </Container>
  </div>
};

export default Commands;