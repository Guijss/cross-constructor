import React from 'react';
import styled from 'styled-components';
import Cell from './Cell';

const GridWrapper = styled.div`
  position: relative;
  height: 80%;
  width: 70%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const Grid = () => {
  return <GridWrapper></GridWrapper>;
};

export default Grid;
