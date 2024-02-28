import React from 'react';
import styled from 'styled-components';
import { ThemeContext } from './Main';
import { useContext } from 'react';

const Container = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const List = styled.div`
  flex: 1;
  height: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 0.6rem;
  border-radius: 5px;
  gap: 0.1rem;
  overflow-x: hidden;
  overflow-y: scroll;
`;

const Title = styled.div`
  font-size: 1rem;
  font-weight: bold;
`;

const Item = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ItemNumber = styled.div`
  width: 18%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ItemText = styled.textarea`
  width: 82%;

  background-color: transparent;
  border: none;
  resize: none;
`;

const Clues = ({ data, setData }) => {
  const theme = useContext(ThemeContext);

  const handleTextChange = (e, i, dir) => {
    const str = e.target.value.toString();
    const newData = { ...data };
    if (dir === 'across') {
      newData.words.across[i].clue = str;
    } else if (dir === 'down') {
      newData.words.down[i].clue = str;
    }
    setData(newData);
  };

  const handleTextFocus = (i, dir) => {
    const newData = { ...data };
    if (dir === 'across') {
      newData.selectedCell = newData.words.across[i].wordCells[0];
      newData.isWordHorizontal = true;
    } else if (dir === 'down') {
      newData.selectedCell = newData.words.down[i].wordCells[0];
      newData.isWordHorizontal = false;
    }
    newData.ifGridOnFocus = false;
    setData(newData);
  };

  const handleTextBlur = () => {
    const newData = { ...data };
    newData.ifGridOnFocus = true;
    setData(newData);
  };

  return (
    <Container>
      <List style={{ border: `1px solid ${theme.cellBorderCol}` }}>
        <Title style={{ color: theme.textCol }}>Across</Title>
        {data.words.across.map((e, i) => (
          <Item
            key={i}
            style={{
              color: theme.textCol,
              borderBottom:
                i < data.words.across.length - 1
                  ? `1px solid ${theme.cellBorderCol}`
                  : 'none',
            }}
          >
            <ItemNumber
              style={{ borderRight: `1px solid ${theme.cellBorderCol}` }}
            >
              {data.grid[e.wordCells[0]].number}
            </ItemNumber>
            <ItemText
              style={{ color: theme.textCol }}
              onChange={(e) => handleTextChange(e, i, 'across')}
              onFocus={() => handleTextFocus(i, 'across')}
              onBlur={handleTextBlur}
              value={e.clue}
            ></ItemText>
          </Item>
        ))}
      </List>
      <List style={{ border: `1px solid ${theme.cellBorderCol}` }}>
        <Title style={{ color: theme.textCol }}>Down</Title>
        {data.words.down.map((e, i) => (
          <Item
            key={i}
            style={{
              color: theme.textCol,
              borderBottom:
                i < data.words.down.length - 1
                  ? `1px solid ${theme.cellBorderCol}`
                  : 'none',
            }}
          >
            <ItemNumber
              style={{ borderRight: `1px solid ${theme.cellBorderCol}` }}
            >
              {data.grid[e.wordCells[0]].number}
            </ItemNumber>
            <ItemText
              style={{ color: theme.textCol }}
              onChange={(e) => handleTextChange(e, i, 'down')}
              onFocus={() => handleTextFocus(i, 'down')}
              value={e.clue}
            ></ItemText>
          </Item>
        ))}
      </List>
    </Container>
  );
};

export default Clues;
