import React, { useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from './Main';

const CellWrapper = styled.div`
  position: relative;
  width: 3rem;
  height: 3rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CellContent = styled.span`
  position: relative;
  font-size: 2rem;
`;

const Cell = ({
  pos,
  handleClick,
  isSelected,
  isBlocked,
  gridRefs,
  children,
}) => {
  const theme = useContext(ThemeContext);
  return (
    <CellWrapper
      style={{
        backgroundColor: isBlocked
          ? theme.textCol
          : isSelected
          ? theme.selectedCellCol
          : theme.cellCol,
        border: `1px solid ${theme.cellBorderCol}`,
        color: theme.textCol,
      }}
      onClick={(e) => handleClick(e, pos.i, pos.j)}
      ref={(e) => (gridRefs.current[pos.i][pos.j] = e)}
    >
      <CellContent>{isBlocked ? null : children}</CellContent>
    </CellWrapper>
  );
};

export default Cell;
