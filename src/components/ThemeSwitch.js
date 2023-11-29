import React, { useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from './Main';
import { CiDark, CiLight } from 'react-icons/ci';

const ThemeSwitchWrapper = styled.div`
  position: absolute;
  margin-top: 1rem;
  margin-right: 2rem;
  right: 0;
  top: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const ThemeSwitchbar = styled.div`
  position: relative;
  width: 40px;
  height: 1rem;
  border-radius: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin: 0.5rem;
`;

const ThemeSwitchKnob = styled.div`
  position: relative;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  pointer-events: none;
`;

const ThemeSwitch = ({ handleClick, isThemeDark }) => {
  const theme = useContext(ThemeContext);
  return (
    <ThemeSwitchWrapper>
      <CiDark size={32} color={theme.textCol} />
      <ThemeSwitchbar
        style={{ backgroundColor: theme.textCol }}
        onClick={handleClick}
      >
        <ThemeSwitchKnob
          style={{
            backgroundColor: theme.cellCol,
            translate: isThemeDark ? '-10px' : '10px',
          }}
        />
      </ThemeSwitchbar>
      <CiLight size={32} color={theme.textCol} />
    </ThemeSwitchWrapper>
  );
};

export default ThemeSwitch;
