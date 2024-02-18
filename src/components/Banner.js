import styled from 'styled-components';
import { useContext } from 'react';
import { ThemeContext } from './Main';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 8%;
  min-height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
`;

const Number = styled.div`
  position: absolute;
  font-size: 8px;
  font-weight: bold;
  top: 2px;
  left: 2px;
`;

const Letter = styled.div`
  position: relative;
  height: 100%;
  font-size: 7vh;
  aspect-ratio: 1/1;
  text-align: center;
  box-sizing: border-box;
`;

const title = ' Cross Constructor '.split('');

const Banner = ({ children }) => {
  const theme = useContext(ThemeContext);
  return (
    <Container style={{ backgroundColor: theme.bgCol }}>
      {title.map((e, i) => (
        <Letter
          style={{
            backgroundColor:
              i === 0 || i === 6 || i === 18 ? 'black' : theme.cellCol,
            color: theme.textCol,
            border: `1px solid ${theme.cellBorderCol}`,
          }}
          key={i}
        >
          {e}
          <Number
            style={{
              color: theme.textCol,
            }}
          >
            {i === 1 && 1}
            {i === 7 && 2}
          </Number>
        </Letter>
      ))}
      {children}
    </Container>
  );
};

export default Banner;
