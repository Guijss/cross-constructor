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

const ClueNum = styled.span`
  position: absolute;
  font-size: 0.8rem;
  top: 0;
  left: 0;
`;

const Cell = ({
  pos,
  handleClick,
  isSelected,
  isBlocked,
  clueNum,
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
      {clueNum !== null ? <ClueNum>{clueNum}</ClueNum> : null}
    </CellWrapper>
  );
};

export default Cell;
