import { FaInfoCircle } from 'react-icons/fa';
import { useState, useContext } from 'react';
import { ThemeContext } from './Main';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  right: -20px;
  top: 0;
  cursor: pointer;
`;

const Modal = styled.div`
  position: absolute;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 150px;
  top: -2px;
  right: -2px;
  border-radius: 10px;
  border: 2px solid #8d8776;
  background-color: rgb(18, 19, 24);
  font-weight: bold;
  line-height: 50%;
  padding: 0.7rem;
  z-index: 10;
`;

const Text = styled.span`
  font-size: 0.5rem;
  white-space: pre-line;
`;

const Info = ({ text }) => {
  const theme = useContext(ThemeContext);
  const [isHover, setIsHover] = useState(false);
  return (
    <>
      {isHover && (
        <Modal>
          <Text style={{ color: theme.textCol }}>{text}</Text>
        </Modal>
      )}
      <Container
        style={{ color: theme.textCol }}
        onMouseOver={() => setIsHover(true)}
        onMouseOut={() => setIsHover(false)}
      >
        <FaInfoCircle size={14} />
      </Container>
    </>
  );
};

export default Info;
