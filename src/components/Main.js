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
  const gridRefs = useRef(blankRefs);

  useEffect(() => {
    setTheme(() => (isThemeDark ? themeDark : themeLight));
  }, [isThemeDark]);

  useEffect(() => {}, [blockedCells]);

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
          gridRefs={gridRefs}
          symmetry={symmetry}
        />
        <Clues />
      </MainWrapper>
    </ThemeContext.Provider>
  );
};

export default Main;
