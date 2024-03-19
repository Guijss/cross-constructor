import styled from 'styled-components';
import { ThemeContext } from './Main';
import { useContext } from 'react';

const Frame = styled.div`
  position: absolute;
  z-index: 10;
  pointer-events: none;
  box-sizing: border-box;
`;
const Selection = ({ rect }) => {
  const theme = useContext(ThemeContext);
  return (
    <Frame
      style={{
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.right - rect.left}px`,
        height: `${rect.bottom - rect.top}px`,
        border: `2px solid ${theme.frameCol}`,
      }}
    ></Frame>
  );
};

export default Selection;
