import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { ThemeContext } from './Main';

const WordBorder = styled.div`
  position: absolute;
  pointer-events: none;
  box-sizing: border-box;
`;

const FloatingWord = ({
  selectedCell,
  isSelectionAcross,
  clues,
  gridRefs,
  boardPos,
}) => {
  const [wordRect, setWordRect] = useState({});
  const theme = useContext(ThemeContext);
  useEffect(() => {
    const findClue = () => {
      for (let i = 0; i < clues.length; i++) {
        for (let j = 0; j < clues[i].cells.length; j++) {
          if (
            gridRefs.current[selectedCell.i][selectedCell.j] ===
            clues[i].cells[j]
          ) {
            //found word containing selected cell!
            if (
              (isSelectionAcross && clues[i].direction === 'across') ||
              (!isSelectionAcross && clues[i].direction === 'down')
            ) {
              return clues[i];
            }
          }
        }
      }
      return null;
    };
    const selectedClue = findClue();
    if (selectedClue === null) {
      return;
    }
    const firstCell = selectedClue.cells[0];
    const left = firstCell.getBoundingClientRect().left;
    const top = firstCell.getBoundingClientRect().top;
    const cellWidth = firstCell.getBoundingClientRect().width;
    const width =
      selectedClue.direction === 'across'
        ? cellWidth * selectedClue.cells.length
        : cellWidth;

    const height =
      selectedClue.direction === 'down'
        ? cellWidth * selectedClue.cells.length
        : cellWidth;
    setWordRect({
      top: top - boardPos.top,
      left: left - boardPos.left,
      width: width,
      height: height,
    });
  }, [selectedCell, clues, gridRefs, setWordRect, boardPos, isSelectionAcross]);

  return (
    <WordBorder
      style={{
        border: `3px solid ${theme.textCol}`,
        top: wordRect.top,
        left: wordRect.left,
        width: wordRect.width,
        height: wordRect.height,
      }}
    />
  );
};

export default FloatingWord;
