import { FaInfoCircle } from 'react-icons/fa';
import { useState, useContext } from 'react';
import { ThemeContext } from './Main';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  right: -30px;
  top: 0;
  cursor: pointer;
`;

const Modal = styled.div`
  position: absolute;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 200px;
  top: -2px;
  right: -2px;
  border-radius: 10px;
  border: 2px solid #8d8776;
  font-weight: bold;

  padding: 1rem;
  z-index: 99;
`;

const Text = styled.span`
  font-size: 1rem;
  white-space: pre-line;
`;

const Info = ({ text }) => {
  const theme = useContext(ThemeContext);
  const [isHover, setIsHover] = useState(false);
  return (
    <>
      {isHover && (
        <Modal style={{ backgroundColor: theme.bgCol }}>
          <Text style={{ color: theme.textCol }}>{text}</Text>
        </Modal>
      )}
      <Container
        style={{ color: theme.textCol }}
        onMouseOver={() => setIsHover(true)}
        onMouseOut={() => setIsHover(false)}
      >
        <FaInfoCircle size={25} />
      </Container>
    </>
  );
};

export default Info;
