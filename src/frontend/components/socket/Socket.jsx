import io from 'socket.io-client';
import React, {createContext, useContext} from 'react';

const SocketContext = createContext(null);

export const SocketProvider = (props) => {
  const socket = io(props.url);
  return <SocketContext.Provider value={socket}>
    {props.children}
  </SocketContext.Provider>
}

export default () => useContext(SocketContext)
