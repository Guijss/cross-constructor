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
  grid-template-rows: repeat(15, auto);
  grid-auto-flow: column;
`;

const Grid = ({
  grid,
  setGrid,
  blockedCells,
  setBlockedCells,
  clues,
  gridRefs,
  symmetry,
}) => {
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
        let newGrid = [...prev];
        newGrid[selectedCell.i][selectedCell.j] = key.toUpperCase();
        return newGrid;
      });
    };
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedCell, setGrid]);

  const handleClick = (e, i, j) => {
    if (e.ctrlKey) {
      if (blockedCells[i][j]) {
        setBlockedCells((prev) => {
          let newBlockedCells = [...prev];
          newBlockedCells[i][j] = false;
          switch (symmetry) {
            case 0:
              newBlockedCells[14 - i][14 - j] = false;
              break;
            case 1:
              newBlockedCells[14 - i][j] = false;
              break;
            default:
              break;
          }

          return newBlockedCells;
        });
      } else {
        setBlockedCells((prev) => {
          const newBlockedCells = [...prev];
          newBlockedCells[i][j] = true;
          switch (symmetry) {
            case 0:
              newBlockedCells[14 - i][14 - j] = true;
              break;
            case 1:
              newBlockedCells[14 - i][j] = true;
              break;
            default:
              break;
          }
          return newBlockedCells;
        });
      }
      return;
    }
    if (grid[i][j] === '#') {
      return;
    }
    setSelectedCell({ i: i, j: j });
    //console.log(gridRefs.current[i][j].getBoundingClientRect());
  };

  return (
    <GridWrapper>
      <GridBoard>
        {grid.map((row, i) => {
          return row.map((el, j) => {
            const clueArr = clues.filter(
              (obj) => obj.pos.i === i && obj.pos.j === j
            );
            const clueNum = clueArr.length > 0 ? clueArr[0].count : null;
            return (
              <Cell
                key={`${i}${j}`}
                pos={{ i: i, j: j }}
                handleClick={handleClick}
                isSelected={
                  selectedCell.i === i && selectedCell.j === j ? true : false
                }
                isBlocked={blockedCells[i][j]}
                clueNum={clueNum}
                gridRefs={gridRefs}
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
