import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import useSocket from '../socket';

const Select = styled.select`
  display:block;
  background: #fafafa;
  margin-bottom: 10px;
  min-width: 200px;
`;
const History = () => {
  const socket = useSocket();
  const [hist, setHist] = useState([]);
  const [selected, setSelected] = useState('');
  
  useEffect(() => {
    socket.emit('history', (data) => {
      
      setHist(data || []);
    })

    socket.on('history_update', (data) => {
      setHist(data);
    })
  }, [])
  
  return <div><Select size={10} value={selected} onChange={e => setSelected(e.target.value)}>
    {hist.map((h,i) => <option value={i} key={`hist-${i}`}>{h}</option>)}
  </Select>
  <button disabled={!selected} onClick={(e) => {
    socket.emit('undo', hist.length - selected);
  }}>Undo to</button>
  </div>
}

export default History;