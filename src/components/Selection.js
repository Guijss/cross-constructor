import styled from 'styled-components';

const Frame = styled.div`
  position: absolute;
  z-index: 99;
  pointer-events: none;
  box-sizing: border-box;
`;
const Selection = ({ rect }) => {
  return (
    <Frame
      style={{
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.right - rect.left}px`,
        height: `${rect.bottom - rect.top}px`,
        border: `2px solid red`,
      }}
    ></Frame>
  );
};

export default Selection;
