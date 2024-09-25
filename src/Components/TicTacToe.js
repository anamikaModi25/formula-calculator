import { useMemo, useState } from 'react';

import { Button, Stack } from '@mui/material';

import './styles.css';

function OXButton({ value, onButtonClick }) {
  return (
    <Button
      sx={{
        border: '1px solid black',
        borderRadius: '0',
        width: '25px',
        height: '45px',
      }}
      onClick={onButtonClick}
    >
      {value}
    </Button>
  );
}

const nullArray = Array(9).fill(null);

const calculateWinner = (squareValues) => {
  const filterData = squareValues.filter((value) => value != null);
  const winnerIndexes = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ];
  if (filterData.length === 9) {
    return 'OX';
  }
  if (filterData.length > 4) {
    for (let i = 0; i < winnerIndexes.length; i++) {
      const [a, b, c] = winnerIndexes[i];
      if (
        squareValues[a] &&
        squareValues[a] === squareValues[b] &&
        squareValues[b] === squareValues[c] &&
        squareValues[c]
      ) {
        return squareValues[a];
      }
    }
    return null;
  }
};

export default function App() {
  const [squareValues, setSquareValue] = useState(nullArray);
  const [currMove, setCurrMove] = useState(0);
  const [message, setMessage] = useState();

  const nextIsX = useMemo(() => currMove % 2, [currMove]);

  const handleClick = (index) => {
    if (calculateWinner(squareValues)) {
      return null;
    }
    const temp = [...squareValues];
    if (!temp[index]) {
      if (nextIsX) {
        temp[index] = 'X';
      } else {
        temp[index] = 'O';
      }
      setCurrMove((prev) => prev + 1);
      setSquareValue(temp);
    }

    const winner = calculateWinner(temp);
    if (winner) {
      if (winner === 'OX') {
        setMessage(`It's a draw`);
      } else {
        setMessage(`${winner} is winner`);
      }
    }
  };

  return (
    <div className="App">
      <h3>Tic-Tac-Toe</h3>
      <Button
        onClick={() => {
          setSquareValue(nullArray);
          setMessage(null);
          setCurrMove(0);
        }}
      >
        Reset
      </Button>
      <Stack sx={{ justifyContent: 'center' }}>
        <Stack direction="row">
          <OXButton value={squareValues[0]} onButtonClick={() => handleClick(0)} />
          <OXButton value={squareValues[1]} onButtonClick={() => handleClick(1)} />
          <OXButton value={squareValues[2]} onButtonClick={() => handleClick(2)} />
        </Stack>
        <Stack direction="row">
          <OXButton value={squareValues[3]} onButtonClick={() => handleClick(3)} />
          <OXButton value={squareValues[4]} onButtonClick={() => handleClick(4)} />
          <OXButton value={squareValues[5]} onButtonClick={() => handleClick(5)} />
        </Stack>
        <Stack direction="row">
          <OXButton value={squareValues[6]} onButtonClick={() => handleClick(6)} />
          <OXButton value={squareValues[7]} onButtonClick={() => handleClick(7)} />
          <OXButton value={squareValues[8]} onButtonClick={() => handleClick(8)} />
        </Stack>
      </Stack>
      {message && <p>{message}</p>}
    </div>
  );
}
