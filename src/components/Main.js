//This could all sit in App.js but I prefer App to remain as clean as possible.

import React, { createContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import ThemeSwitch from './ThemeSwitch';
import Grid from './Grid';
import { motion, AnimatePresence } from 'framer-motion';
import Banner from './Banner';

export const ThemeContext = createContext();

const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s ease;
  font-family: 'Roboto', sans-serif;
  overflow: hidden;
`;

const MainWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 92%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s ease;
`;

const SetupWindow = styled(motion.div)`
  position: relative;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  border-radius: 10px;
  padding: 50px;
`;

const SetupItem = styled.div`
  position: relative;
  transition: all 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const ItemSelect = styled.select`
  font-size: 0.8rem;
  border-radius: 5px;
  cursor: pointer;
`;

const Button = styled.button`
  margin-top: 50px;
  width: 100%;
  height: 1.5rem;
  border-radius: 5px;
  border: none;
  cursor: pointer;
`;

const themeDark = {
  bgCol: 'rgb(17, 17, 21)',
  bannerCol: 'rgb(14, 14, 18)',
  cellCol: 'rgb(28, 29, 35)',
  unselectedCol: 'rgb(28, 29, 35)',
  selectedCellCol: 'rgb(51, 52, 58)',
  cellBorderCol: 'rgb(100, 100, 100)',
  textCol: 'rgb(150, 150, 150)',
};

const themeLight = {
  bgCol: 'rgb(230, 230, 230)',
  bannerCol: 'rgb(225, 225, 225)',
  cellCol: 'rgb(255, 255, 255)',
  unselectedCol: 'rgb(200, 200, 200)',
  selectedCellCol: 'rgb(180, 181, 189)',
  cellBorderCol: 'rgb(0, 0, 0)',
  textCol: 'rgb(0, 0, 0)',
};

const Main = () => {
  const [theme, setTheme] = useState({});
  const [isThemeDark, setIsThemeDark] = useState(true);
  const [isBoardInitiated, setIsBoardInitiated] = useState(false);
  const [data, setData] = useState({
    settings: { symmetry: 'rotational', size: 15 },
    grid: [],
  });

  useEffect(() => {
    setTheme(() => (isThemeDark ? themeDark : themeLight));
  }, [isThemeDark]);

  const handleThemeClick = () => {
    setIsThemeDark((prev) => !prev);
  };

  const handleSymmetryChange = (e) => {
    setData((prev) => {
      const localData = { ...prev };
      localData.settings = { ...localData.settings };
      localData.settings.symmetry = e.target.value;
      return localData;
    });
  };

  const handleSizeChange = (e) => {
    setData((prev) => {
      const localData = { ...prev };
      localData.settings = { ...localData.settings };
      localData.settings.size = e.target.value;
      return localData;
    });
  };

  return (
    <ThemeContext.Provider value={theme}>
      <Container>
        <Banner>
          <ThemeSwitch
            handleClick={handleThemeClick}
            isThemeDark={isThemeDark}
          />
        </Banner>
        <MainWrapper style={{ backgroundColor: theme.bgCol }}>
          <AnimatePresence mode="wait">
            {!isBoardInitiated ? (
              <SetupWindow
                style={{
                  color: theme.textCol,
                  border: `2px solid ${theme.textCol}`,
                }}
                exit={{ opacity: 0 }}
                initial={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                key="setup"
              >
                <SetupItem>
                  <span>Symmetry</span>
                  <ItemSelect
                    value={data.settings.symmetry}
                    onChange={handleSymmetryChange}
                    style={{
                      backgroundColor: theme.textCol,
                      color: theme.bgCol,
                    }}
                  >
                    <option value="rotational">Rotational</option>
                    <option value="mirrored">Mirrored</option>
                    <option value="none">None</option>
                  </ItemSelect>
                </SetupItem>

                <SetupItem>
                  <span>Board Size</span>
                  <ItemSelect
                    value={data.settings.size}
                    onChange={handleSizeChange}
                    style={{
                      backgroundColor: theme.textCol,
                      color: theme.bgCol,
                    }}
                  >
                    <option value={15}>15x15</option>
                    <option value={21}>21x21</option>
                  </ItemSelect>
                </SetupItem>
                <Button
                  style={{ backgroundColor: theme.textCol, color: theme.bgCol }}
                  onClick={() => setIsBoardInitiated(true)}
                >
                  Start
                </Button>
              </SetupWindow>
            ) : (
              <div key="board" style={{ width: '100%', height: '100%' }}>
                <Grid data={data} setData={setData} />
                {/* <Clues /> */}
              </div>
            )}
          </AnimatePresence>
        </MainWrapper>
      </Container>
    </ThemeContext.Provider>
  );
};

export default Main;
