import React, { useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from './Main';
import { CiDark, CiLight } from 'react-icons/ci';

const ThemeSwitchWrapper = styled.div`
  position: absolute;
  right: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  z-index: 99;
`;

const ThemeSwitchbar = styled.div`
  position: relative;
  width: 1.5rem;
  height: 0.7rem;
  border-radius: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const ThemeSwitchKnob = styled.div`
  position: relative;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  pointer-events: none;
`;

const ThemeSwitch = ({ handleClick, isThemeDark }) => {
  const theme = useContext(ThemeContext);
  return (
    <ThemeSwitchWrapper>
      <CiDark color={theme.textCol} />
      <ThemeSwitchbar
        style={{ backgroundColor: theme.textCol }}
        onClick={handleClick}
      >
        <ThemeSwitchKnob
          style={{
            backgroundColor: theme.cellCol,
            translate: isThemeDark ? '-0.35rem' : '0.35rem',
          }}
        />
      </ThemeSwitchbar>
      <CiLight color={theme.textCol} />
    </ThemeSwitchWrapper>
  );
};

export default ThemeSwitch;
