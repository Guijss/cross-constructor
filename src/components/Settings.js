import React, { useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from './Main';
import { GiClockwiseRotation } from 'react-icons/gi';
import { FaArrowRightArrowLeft } from 'react-icons/fa6';
import { RiProhibitedLine } from 'react-icons/ri';

const SettingsWrapper = styled.div`
  position: relative;
  height: 80%;
  width: 10%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const Symmetry = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1rem;
`;

const SymmetryTitle = styled.span`
  position: absolute;
  top: 0.5rem;
`;

const SymmetryItem = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 3rem 0.6rem 2rem 0.6rem;
  cursor: pointer;
`;

const ItemTitle = styled.span`
  position: relative;
  margin-bottom: 1rem;
  font-size: 12px;
  transition: all 0.3s ease;
`;

const Settings = ({ symmetry, setSymmetry }) => {
  const theme = useContext(ThemeContext);

  const handleClick = (symSelection) => {
    setSymmetry(symSelection);
  };
  return (
    <SettingsWrapper>
      <Symmetry>
        <SymmetryTitle style={{ color: theme.textCol }}>Symmetry</SymmetryTitle>
        <SymmetryItem onClick={() => handleClick(0)}>
          <ItemTitle
            style={{ color: symmetry === 0 ? theme.textCol : theme.cellCol }}
          >
            Rotational
          </ItemTitle>
          <GiClockwiseRotation
            style={{ transition: 'all 0.3s ease' }}
            size={40}
            color={symmetry === 0 ? theme.textCol : theme.cellCol}
          />
        </SymmetryItem>
        <SymmetryItem onClick={() => handleClick(1)}>
          <ItemTitle
            style={{ color: symmetry === 1 ? theme.textCol : theme.cellCol }}
          >
            Mirrored
          </ItemTitle>
          <FaArrowRightArrowLeft
            style={{ transition: 'all 0.3s ease' }}
            size={40}
            color={symmetry === 1 ? theme.textCol : theme.cellCol}
          />
        </SymmetryItem>
        <SymmetryItem onClick={() => handleClick(2)}>
          <ItemTitle
            style={{ color: symmetry === 2 ? theme.textCol : theme.cellCol }}
          >
            None
          </ItemTitle>
          <RiProhibitedLine
            style={{ transition: 'all 0.3s ease' }}
            size={40}
            color={symmetry === 2 ? theme.textCol : theme.cellCol}
          />
        </SymmetryItem>
      </Symmetry>
    </SettingsWrapper>
  );
};

export default Settings;
