import React, {useState, useEffect, useCallback} from 'react';
import styled from 'styled-components';

import useSocket from '../socket';
import useRover from '../rover';


const GridComponent = styled.div`
  display:grid;
  grid-template-columns: repeat(${props => props.cols}, 1fr);
  grid-template-rows: repeat(${props => props.rows}, 1fr);
  width: ${props => props.rows * 42}px;
  margin-right: 10px;
`;

const Tile = styled.div`
  border: 1px solid #d7d7d7;
  background:#fafafa;
  display: flex;
  align-items:center;
  justify-content:center;
  width: 40px;
  height: 40px;
`;

const Obstacle = styled.div`
border: 1px solid #d7d7d7;
  background:#333;
  display: block;
  width: 40px;
  height: 40px;
`;


const Grid = (props) => {
  const socket = useSocket();
  const [g, setG] = useState(null);

  const {pos, render} = useRover();
  useEffect(() => {
    socket.emit('grid', (data) => {
      setG(data);
    })
  }, [])

  const getTileType = useCallback((x, y) => {
    if (pos && pos.x === x && pos.y === y) {
    return <Tile>{render}</Tile>;
    } else if (g && g.obstacles.findIndex(v => v[0]===x && v[1]===y) !== -1) {
      return <Obstacle />
    } else {
      return <Tile />
    }
    

  } ,[pos, g])

  if (!g) {
    return 'Loading...'
  }
  return <GridComponent cols={g.cols} rows={g.rows}>
    {
      [...Array(g.rows)].map((_,r) => {
        return [...Array(g.cols)].map((_, c) => {
          return getTileType(c,r)
        })
      })
    }
  </GridComponent>

};

export default Grid;