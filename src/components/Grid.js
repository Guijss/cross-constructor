import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ThemeContext } from './Main';
import { useContext, useState, useEffect, useRef, useCallback } from 'react';
import Info from './Info';
import Selection from './Selection';

const Container = styled(motion.div)`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GridBounds = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;
const Cell = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;
`;

const CellNum = styled.div`
  position: absolute;
  font-size: 8px;
  font-weight: bold;
  top: 1px;
  left: 1px;
`;

const infoText =
  'Right click toggles a cell between light and dark.\n\nLeft click selects a cell and allows for keyboard inputs on that cell.';

const Grid = ({ data, setData }) => {
  const theme = useContext(ThemeContext);
  const containerRef = useRef();
  const gridRef = useRef();
  const [gridSize, setGridSize] = useState(0);
  const [cellSize, setCellSize] = useState(0);
  const [selectedWord, setSelectedWord] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });
  const [selectedWordCells, setSelectedWordCells] = useState([]);

  const xyToIndex = useCallback(
    (x, y) => {
      return x + y * data.settings.size;
    },
    [data.settings.size]
  );

  const indexToX = useCallback(
    (index) => {
      return index % data.settings.size;
    },
    [data.settings.size]
  );

  const indexToY = useCallback(
    (index) => {
      return Math.floor(index / data.settings.size);
    },
    [data.settings.size]
  );

  useEffect(() => {
    const handleResize = () => {
      setGridSize(Math.max(containerRef.current.clientHeight * 0.95, 200));
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (
        (e.keyCode < 65 &&
          e.keyCode !== 32 &&
          e.keyCode !== 9 &&
          e.keyCode !== 8) ||
        e.keyCode > 90
      ) {
        //not a letter or not space not tab not backspace.
        return;
      }
      setData((prev) => {
        const localData = { ...prev };
        if (localData.selectedCell === -1 || !localData.ifGridOnFocus) {
          return localData;
        }
        if (e.keyCode === 32) {
          //space
          localData.isWordHorizontal = !localData.isWordHorizontal;
          return localData;
        }
        if (e.keyCode === 8) {
          //backspace
          localData.grid = [...localData.grid];
          localData.grid[localData.selectedCell] = {
            ...localData.grid[localData.selectedCell],
            content: '',
          };
          //retreat selected cell.
          const i = selectedWordCells.indexOf(localData.selectedCell);
          if (i > 0) {
            localData.selectedCell = selectedWordCells[i - 1];
          }
          return localData;
        }
        if (e.keyCode === 9) {
          e.preventDefault();
          //tab
          localData.selectedWord++;
          if (localData.isWordHorizontal) {
            if (localData.selectedWord >= localData.words.across.length) {
              localData.selectedWord = 0;
              localData.isWordHorizontal = false;
              localData.selectedCell = localData.words.down[0][0];
              return localData;
            }
            localData.selectedCell =
              localData.words.across[localData.selectedWord][0];
            return localData;
          } else {
            if (localData.selectedWord >= localData.words.down.length) {
              localData.selectedWord = 0;
              localData.isWordHorizontal = true;
              localData.selectedCell = localData.words.across[0][0];
              return localData;
            }
            localData.selectedCell =
              localData.words.down[localData.selectedWord][0];
            return localData;
          }
        }

        localData.grid = [...localData.grid];
        localData.grid[localData.selectedCell] = {
          ...localData.grid[localData.selectedCell],
          content: e.key.toUpperCase(),
        };
        //advance selected cell.
        const i = selectedWordCells.indexOf(localData.selectedCell);
        if (i < selectedWordCells.length - 1) {
          localData.selectedCell = selectedWordCells[i + 1];
        }
        return localData;
      });
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, [setData, selectedWordCells]);

  useEffect(() => {
    //this is to setup the initial grid numbers and words state. TODO: refactor to not have repeated code (code is repeated on right click after grid changes.)
    setData((prev) => {
      const localData = { ...prev };
      localData.grid = [];
      let num = 1;
      for (let i = 0; i < localData.settings.size; i++) {
        for (let j = 0; j < localData.settings.size; j++) {
          localData.grid.push({
            content: '',
            number: i === 0 || j === 0 ? `${num++}` : '',
          });
        }
      }
      //wipe words to rebuild.
      localData.words = { ...localData.words };
      for (let i = 0; i < localData.grid.length; i++) {
        if (localData.grid[i].content === '0') {
          //we don't ever add a clue number on a black cell.
          continue;
        }
        const x = indexToX(i);
        const y = indexToY(i);
        const leftCellIndex = x > 0 ? xyToIndex(x - 1, y) : -1;
        const upCellIndex = y > 0 ? xyToIndex(x, y - 1) : -1;
        if (
          x === 0 ||
          y === 0 ||
          localData.grid[leftCellIndex].content === '0' ||
          localData.grid[upCellIndex].content === '0'
        ) {
          //first column, first row or after a black square.
          const across = [];
          const down = [];
          let localX = x;
          if (x === 0 || localData.grid[leftCellIndex].content === '0') {
            //across word
            while (localData.grid[xyToIndex(localX, y)].content !== '0') {
              across.push(xyToIndex(localX, y));
              localX++;
              if (localX >= localData.settings.size) {
                break;
              }
            }
            localData.words.across = [
              ...localData.words.across,
              { wordCells: across, clue: '' },
            ];
          }

          let localY = y;
          if (y === 0 || localData.grid[upCellIndex].content === '0') {
            //down word
            while (localData.grid[xyToIndex(x, localY)].content !== '0') {
              down.push(xyToIndex(x, localY));
              localY++;
              if (localY >= localData.settings.size) {
                break;
              }
            }
            localData.words.down = [
              ...localData.words.down,
              { wordCells: down, clue: '' },
            ];
          }
        }
      }
      return localData;
    });
  }, [setData, data.settings.size, indexToX, indexToY, xyToIndex]);

  useEffect(() => {
    setCellSize(gridSize / data.settings.size);
  }, [gridSize, data.settings.size]);

  useEffect(() => {
    const getWordCells = (i) => {
      if (data.isWordHorizontal) {
        const x = indexToX(i);
        const y = indexToY(i);
        const cells = [i];
        let lower = x - 1;
        let upper = x + 1;
        let foundLower = false;
        let foundUpper = false;
        while (!foundLower) {
          const index = xyToIndex(lower, y);
          if (lower < 0 || data.grid[index].content === '0') {
            foundLower = true;
          } else {
            cells.push(index);
            lower--;
          }
        }
        while (!foundUpper) {
          const index = xyToIndex(upper, y);
          if (
            upper > data.settings.size - 1 ||
            data.grid[index].content === '0'
          ) {
            foundUpper = true;
          } else {
            cells.push(index);
            upper++;
          }
        }
        return cells;
      } else {
        const x = indexToX(i);
        const y = indexToY(i);
        const cells = [i];
        let lower = y - 1;
        let upper = y + 1;
        let foundLower = false;
        let foundUpper = false;
        while (!foundLower) {
          const index = xyToIndex(x, lower);
          if (lower < 0 || data.grid[index].content === '0') {
            foundLower = true;
          } else {
            cells.push(index);
            lower--;
          }
        }
        while (!foundUpper) {
          const index = xyToIndex(x, upper);
          if (
            upper > data.settings.size - 1 ||
            data.grid[index].content === '0'
          ) {
            foundUpper = true;
          } else {
            cells.push(index);
            upper++;
          }
        }
        return cells;
      }
    };

    if (data.selectedCell === -1) {
      return;
    }
    const cells = getWordCells(data.selectedCell);
    setSelectedWord(() => {
      const firstCell = Math.min(...cells);
      const lastCell = Math.max(...cells);
      const top = indexToY(firstCell) * cellSize;
      const bottom = indexToY(lastCell) * cellSize + cellSize;
      const left = indexToX(firstCell) * cellSize;
      const right = indexToX(lastCell) * cellSize + cellSize;
      return { top: top, right: right, bottom: bottom, left: left };
    });
    setSelectedWordCells(cells.sort((a, b) => a - b));
  }, [
    setData,
    cellSize,
    data.isWordHorizontal,
    data.grid,
    data.selectedCell,
    data.settings.size,
    indexToX,
    indexToY,
    xyToIndex,
  ]);

  const handleClick = (e, button, index) => {
    if (button === 'leftClick') {
      if (data.grid[index].content === '0') {
        //can't select.
        return;
      }
      setData((prev) => {
        const localData = { ...prev };
        if (localData.selectedCell === index) {
          localData.isWordHorizontal = !localData.isWordHorizontal;
        }
        localData.selectedCell = index;
        if (localData.isWordHorizontal) {
          for (let i = 0; i < localData.words.across.length; i++) {
            if (localData.words.across[i].wordCells.includes(index)) {
              localData.selectedWord = i;
              break;
            }
          }
        } else {
          for (let i = 0; i < localData.words.down.length; i++) {
            if (localData.words.down[i].wordCells.includes(index)) {
              localData.selectedWord = i;
              break;
            }
          }
        }
        return localData;
      });
      return;
    }

    if (button === 'rightClick') {
      e.preventDefault();
      //first we change clicked cell content to "0". that indicates the cell should be black.
      const newData = { ...data };
      const isCellBlack = newData.grid[index].content === '0';
      newData.grid = [...newData.grid];
      newData.grid[index] = { ...newData.grid[index] };
      if (isCellBlack) {
        newData.grid[index].content = '';
      } else {
        newData.grid[index].content = '0';
        if (newData.selectedCell === index) {
          newData.selectedCell = -1;
        }
      }
      //now we change equivalent cell to "0" according to symmetry option.
      let symIndex = -1;
      if (newData.settings.symmetry === 'rotational') {
        const x = indexToX(index);
        const y = indexToY(index);
        const symX = newData.settings.size - 1 - x;
        const symY = newData.settings.size - 1 - y;
        symIndex = xyToIndex(symX, symY);
      } else if (newData.settings.symmetry === 'mirrored') {
        const x = indexToX(index);
        const y = indexToY(index);
        const symX = newData.settings.size - 1 - x;
        symIndex = xyToIndex(symX, y);
      }
      if (symIndex !== index && symIndex !== -1) {
        //only change if it's not the same as clicked cell and the symmetry is set to NOT "none".
        newData.grid[symIndex] = { ...newData.grid[symIndex] };
        if (newData.grid[symIndex].content === '0') {
          newData.grid[symIndex].content = '';
        } else {
          newData.grid[symIndex].content = '0';
          if (newData.selectedCell === symIndex) {
            newData.selectedCell = -1;
          }
        }
      }
      //recalculate cell number to indicate which clue it is.
      let num = 1;
      //wipe words to rebuild.
      const previousAcross = [...newData.words.across];
      const previousDown = [...newData.words.down];
      newData.words = { ...newData.words, across: [], down: [] };

      for (let i = 0; i < newData.grid.length; i++) {
        //first we wipe every cell`s number and then recalculate.
        newData.grid[i] = { ...newData.grid[i], number: '' };
        if (newData.grid[i].content === '0') {
          //we don't ever add a clue number on a black cell.
          continue;
        }
        const x = indexToX(i);
        const y = indexToY(i);
        const leftCellIndex = x > 0 ? xyToIndex(x - 1, y) : -1;
        const upCellIndex = y > 0 ? xyToIndex(x, y - 1) : -1;
        if (
          x === 0 ||
          y === 0 ||
          newData.grid[leftCellIndex].content === '0' ||
          newData.grid[upCellIndex].content === '0'
        ) {
          //first column, first row or after a black square.
          const across = [];
          const down = [];
          let localX = x;
          if (x === 0 || newData.grid[leftCellIndex].content === '0') {
            let clue = '';
            const word = previousAcross.find((e) => e.wordCells[0] === i);
            if (word !== undefined) {
              clue = word.clue;
            }
            //across word
            while (newData.grid[xyToIndex(localX, y)].content !== '0') {
              across.push(xyToIndex(localX, y));
              localX++;
              if (localX >= newData.settings.size) {
                break;
              }
            }
            newData.words.across = [
              ...newData.words.across,
              { wordCells: across, clue: clue },
            ];
          }

          let localY = y;
          if (y === 0 || newData.grid[upCellIndex].content === '0') {
            let clue = '';
            const word = previousDown.find((e) => e.wordCells[0] === i);
            if (word !== undefined) {
              clue = word.clue;
            }
            //down word
            while (newData.grid[xyToIndex(x, localY)].content !== '0') {
              down.push(xyToIndex(x, localY));
              localY++;
              if (localY >= newData.settings.size) {
                break;
              }
            }
            newData.words.down = [
              ...newData.words.down,
              { wordCells: down, clue: clue },
            ];
          }
          newData.grid[i] = { ...newData.grid[i], number: num++ };
        }
      }
      setData(newData);
      // setData((prev) => {
      // //first we change clicked cell content to "0". that indicates the cell should be black.
      // const localData = { ...prev };
      // const isCellBlack = localData.grid[index].content === '0';
      // localData.grid = [...localData.grid];
      // localData.grid[index] = { ...localData.grid[index] };
      // if (isCellBlack) {
      //   localData.grid[index].content = '';
      // } else {
      //   localData.grid[index].content = '0';
      //   if (localData.selectedCell === index) {
      //     localData.selectedCell = -1;
      //   }
      // }
      // //now we change equivalent cell to "0" according to symmetry option.
      // let symIndex = -1;
      // if (localData.settings.symmetry === 'rotational') {
      //   const x = indexToX(index);
      //   const y = indexToY(index);
      //   const symX = localData.settings.size - 1 - x;
      //   const symY = localData.settings.size - 1 - y;
      //   symIndex = xyToIndex(symX, symY);
      // } else if (localData.settings.symmetry === 'mirrored') {
      //   const x = indexToX(index);
      //   const y = indexToY(index);
      //   const symX = localData.settings.size - 1 - x;
      //   symIndex = xyToIndex(symX, y);
      // }
      // if (symIndex !== index && symIndex !== -1) {
      //   //only change if it's not the same as clicked cell and the symmetry is set to NOT "none".
      //   localData.grid[symIndex] = { ...localData.grid[symIndex] };
      //   if (localData.grid[symIndex].content === '0') {
      //     localData.grid[symIndex].content = '';
      //   } else {
      //     localData.grid[symIndex].content = '0';
      //     if (localData.selectedCell === symIndex) {
      //       localData.selectedCell = -1;
      //     }
      //   }
      // }
      // //recalculate cell number to indicate which clue it is.
      // let num = 1;
      // //wipe words to rebuild.
      // const previousAcross = [...localData.words.across];
      // const previousDown = [...localData.words.down];
      // localData.words = { ...localData.words, across: [], down: [] };
      // for (let i = 0; i < localData.grid.length; i++) {
      //   //first we wipe every cell`s number and then recalculate.
      //   localData.grid[i] = { ...localData.grid[i], number: '' };
      //   if (localData.grid[i].content === '0') {
      //     //we don't ever add a clue number on a black cell.
      //     continue;
      //   }
      //   const x = indexToX(i);
      //   const y = indexToY(i);
      //   const leftCellIndex = x > 0 ? xyToIndex(x - 1, y) : -1;
      //   const upCellIndex = y > 0 ? xyToIndex(x, y - 1) : -1;
      //   if (
      //     x === 0 ||
      //     y === 0 ||
      //     localData.grid[leftCellIndex].content === '0' ||
      //     localData.grid[upCellIndex].content === '0'
      //   ) {
      //     //first column, first row or after a black square.
      //     const across = [];
      //     const down = [];
      //     let localX = x;
      //     if (x === 0 || localData.grid[leftCellIndex].content === '0') {
      //       let clue = '';
      //       const word = previousAcross.find((e) => e.wordCells[0] === i);
      //       if (word !== undefined) {
      //         clue = word.clue;
      //       }
      //       //across word
      //       while (localData.grid[xyToIndex(localX, y)].content !== '0') {
      //         across.push(xyToIndex(localX, y));
      //         localX++;
      //         if (localX >= localData.settings.size) {
      //           break;
      //         }
      //       }
      //       localData.words.across = [
      //         ...localData.words.across,
      //         { wordCells: across, clue: clue },
      //       ];
      //     }
      //     let localY = y;
      //     if (y === 0 || localData.grid[upCellIndex].content === '0') {
      //       let clue = '';
      //       const word = previousDown.find((e) => e.wordCells[0] === i);
      //       if (word !== undefined) {
      //         clue = word.clue;
      //       }
      //       //down word
      //       while (localData.grid[xyToIndex(x, localY)].content !== '0') {
      //         down.push(xyToIndex(x, localY));
      //         localY++;
      //         if (localY >= localData.settings.size) {
      //           break;
      //         }
      //       }
      //       localData.words.down = [
      //         ...localData.words.down,
      //         { wordCells: down, clue: clue },
      //       ];
      //     }
      //     localData.grid[i] = { ...localData.grid[i], number: num++ };
      //   }
      // }
      // return localData;
      // });
    }
  };

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      ref={containerRef}
    >
      <GridBounds
        ref={gridRef}
        style={{
          width: gridSize,
          height: gridSize,
          border: `2px solid ${theme.textCol}`,
        }}
      >
        <Info text={infoText} />
        {data.selectedCell !== -1 && <Selection rect={selectedWord} />}
        {data.grid.map((cell, i) => (
          <Cell
            key={i}
            style={{
              width: cellSize,
              height: cellSize,
              backgroundColor:
                cell.content === '0'
                  ? 'black'
                  : data.selectedCell === i
                  ? theme.selectedCellCol
                  : theme.cellCol,
              color: theme.textCol,
              border: `1px solid ${theme.cellBorderCol}`,
            }}
            onContextMenu={(e) => handleClick(e, 'rightClick', i)}
            onClick={(e) => handleClick(e, 'leftClick', i)}
          >
            <CellNum style={{ fontSize: cellSize * 0.2 }}>
              {cell.number}
            </CellNum>
            <div style={{ fontSize: cellSize - 5 }}>
              {cell.content !== '0' && cell.content}
            </div>
          </Cell>
        ))}
      </GridBounds>
    </Container>
  );
};

export default Grid;
