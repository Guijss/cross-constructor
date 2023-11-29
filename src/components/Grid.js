import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Cell from './Cell';

const GridWrapper = styled.div`
  position: relative;
  height: 80%;
  width: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GridBoard = styled.div`
  position: relative;
  display: grid;
  grid-gap: 0;
  grid-template-columns: repeat(15, auto);
`;

const Grid = ({ grid, setGrid }) => {
  const [selectedCell, setSelectedCell] = useState({ i: 0, j: 0 });

  useEffect(() => {
    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (key.length !== 1) {
        return;
      }
      if (key < 'a' || key > 'z') {
        return;
      }
      setGrid((prev) => {
        const newGrid = [...prev];
        newGrid[selectedCell.i][selectedCell.j] = key.toUpperCase();
        return newGrid;
      });
    };
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedCell, setGrid]);

  const handleClick = (i, j) => {
    setSelectedCell({ i: i, j: j });
  };

  return (
    <GridWrapper>
      <GridBoard>
        {grid.map((row, i) => {
          return row.map((el, j) => {
            return (
              <Cell
                key={`${i}${j}`}
                pos={{ i: i, j: j }}
                handleClick={handleClick}
                selected={
                  selectedCell.i === i && selectedCell.j === j ? true : false
                }
              >
                {el}
              </Cell>
            );
          });
        })}
      </GridBoard>
    </GridWrapper>
  );
};

export default Grid;
