import React, {useState, useEffect, useMemo} from 'react';
import styled, {keyframes} from 'styled-components';

import useSocket from '../socket';

const pulse  = keyframes`
  0% {
    box-shadow: 0 0 10px #84DCC6;
  }

  100% {
    box-shadow: 0 0 0 #84DCC6;
  }
`;

const Rover = styled.div`
  display: block;
  background: #84DCC6;
  width: 20px;
  height: 20px;
  background: #84DCC6;
  clip-path: polygon(0 100%, 50% 0, 100% 100%);
  transition: transform 300ms ease-in-out;
  transform: rotate(${props => props.direction*90}deg);
`;

const Circle= styled.div`
  display: block;
  width: 20px;
  height: 20px;
  background: #84DCC6;
  border-radius: 100%;
  animation: ${pulse} infinite 1000ms;
`;

const useRover = () => {
  const socket = useSocket();
  const [pos, setPos] = useState(null);
  useEffect(() => {
    socket.emit('position', (data) => {
      setPos(data);
    });
    socket.on('position_update', (data) => {
      setPos(data);
    })
  },[])

  const render = useMemo(() => pos ? <Rover direction={pos.direction} /> : <Circle /> ,[pos])

  return {pos, render}
}

export default useRover;