//This could all sit in App.js but I prefer App to remain as clean as possible.

import React, { createContext, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ThemeSwitch from './ThemeSwitch';
import Settings from './Settings';
import Grid from './Grid';
import Clues from './Clues';

const MainWrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s ease;
  font-family: 'Roboto', sans-serif;
`;

export const ThemeContext = createContext();

const themeDark = {
  bgCol: 'rgb(17, 17, 21)',
  cellCol: 'rgb(28, 29, 35)',
  unselectedCol: 'rgb(28, 29, 35)',
  selectedCellCol: 'rgb(51, 52, 58)',
  cellBorderCol: 'rgb(100, 100, 100)',
  textCol: 'rgb(150, 150, 150)',
};

const themeLight = {
  bgCol: 'rgb(230, 230, 230)',
  cellCol: 'rgb(255, 255, 255)',
  unselectedCol: 'rgb(200, 200, 200)',
  selectedCellCol: 'rgb(180, 181, 189)',
  cellBorderCol: 'rgb(0, 0, 0)',
  textCol: 'rgb(0, 0, 0)',
};

//const blankGrid = Array.from(Array(15), () => Array(15).fill(''));
const blankGrid = Array.from(Array(15), () => Array(15).fill(''));
const blankBlockedCells = Array.from(Array(15), () => Array(15).fill(false));
const blankRefs = Array.from(Array(15), () => Array(15).fill(null));

const Main = () => {
  const [theme, setTheme] = useState({});
  const [isThemeDark, setIsThemeDark] = useState(true);
  const [symmetry, setSymmetry] = useState(0); //0 - rotational, 1 - mirrored, 2 - none
  const [grid, setGrid] = useState(blankGrid);
  const [blockedCells, setBlockedCells] = useState(blankBlockedCells);
  const [clues, setClues] = useState([]);
  const [selectedCell, setSelectedCell] = useState({ i: 0, j: 0 });
  const [isSelectionAcross, setIsSelectionAcross] = useState(true);
  const gridRefs = useRef(blankRefs);

  useEffect(() => {
    setTheme(() => (isThemeDark ? themeDark : themeLight));
  }, [isThemeDark]);

  useEffect(() => {
    let clueCount = 1;
    let cluesArr = [];
    for (let j = 0; j < blockedCells[0].length; j++) {
      for (let i = 0; i < blockedCells.length; i++) {
        let wasClueAdded = false;
        if (blockedCells[i][j] !== true) {
          if (i === 0 || (i > 0 && blockedCells[i - 1][j] === true)) {
            let wordCells = [];
            for (let wordI = i; wordI <= 14; wordI++) {
              if (blockedCells[wordI][j] === true) {
                break;
              }
              wordCells.push(gridRefs.current[wordI][j]);
            }
            cluesArr.push({
              direction: 'across',
              count: clueCount,
              cells: wordCells,
              pos: { i: i, j: j },
            });
            wasClueAdded = true;
          }
          if (j === 0 || (j > 0 && blockedCells[i][j - 1] === true)) {
            let wordCells = [];
            for (let wordJ = j; wordJ <= 14; wordJ++) {
              if (blockedCells[i][wordJ] === true) {
                break;
              }
              wordCells.push(gridRefs.current[i][wordJ]);
            }
            cluesArr.push({
              direction: 'down',
              count: clueCount,
              cells: wordCells,
              pos: { i: i, j: j },
            });
            wasClueAdded = true;
          }
        }
        if (wasClueAdded) {
          clueCount++;
        }
      }
    }
    setClues(cluesArr);
  }, [blockedCells]);

  const handleThemeClick = () => {
    setIsThemeDark((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={theme}>
      <MainWrapper style={{ backgroundColor: theme.bgCol }}>
        <ThemeSwitch handleClick={handleThemeClick} isThemeDark={isThemeDark} />
        <Settings symmetry={symmetry} setSymmetry={setSymmetry} />
        <Grid
          grid={grid}
          setGrid={setGrid}
          blockedCells={blockedCells}
          setBlockedCells={setBlockedCells}
          selectedCell={selectedCell}
          setSelectedCell={setSelectedCell}
          isSelectionAcross={isSelectionAcross}
          setIsSelectionAcross={setIsSelectionAcross}
          clues={clues}
          gridRefs={gridRefs}
          symmetry={symmetry}
        />

        {/*This component <Grid /> is very bloated, Not sure how to clean it up for now. */}
        <Clues />
      </MainWrapper>
    </ThemeContext.Provider>
  );
};

export default Main;
