/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

export default function App() {
  const [startGame, setStartGame] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isPause, setPauseGame] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [boxPosition, setBoxPosition] = useState({
    top: 0,
    left: 0,
  });
  const [clickTime, setClickTime] = useState<string[]>([]);

  const handleBoxClick = () => {
    if (startGame) {
      const endTime = Date.now();
      const newTime = ((endTime - startTime) / 1000).toFixed(2);
      setClickTime((prev) => [...prev, newTime]);
    }
  };

  const handleStartGame = () => {
    setStartGame(true);
    setIsBlinking(true);
    const width = 580;
    const height = 380;
    const newTop = Math.floor(Math.random() * height);
    const newLeft = Math.floor(Math.random() * width);
    setBoxPosition({
      top: newTop,
      left: newLeft,
    });
    setStartTime(Date.now());
  };

  const handlePause = () => {
    setPauseGame(true);
    setIsBlinking(false);
    setStartGame(false);
  };

  const handleReset = () => {
    setStartGame(false);
    setIsBlinking(false);
    setPauseGame(false);
    setBoxPosition({
      top: 0,
      left: 0,
    });
    setClickTime([]);
  };

  useEffect(() => {
    let interval: any;
    if (isBlinking) {
      const width = 580;
      const height = 380;
      interval = setInterval(() => {
        const newTop = Math.floor(Math.random() * height);
        const newLeft = Math.floor(Math.random() * width);
        setStartTime(Date.now());
        setBoxPosition({
          top: newTop,
          left: newLeft,
        });
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [isBlinking]);

  return (
    <Stack mt="10px" gap={5}>
      <Typography
        sx={{ fontSize: '30px', fontWeight: 'bold', textAlign: 'center' }}
        component="h3"
      >
        Box Hunt
      </Typography>
      <Stack direction="row" justifyContent="center" gap="20px">
        <Button onClick={handleStartGame}>Start</Button>
        <Button onClick={handlePause}>Pause</Button>
        <Button onClick={handleReset}>Reset</Button>
      </Stack>
      <Stack
        width="600px"
        height="400px"
        border="1px solid black"
        justifyContent="center"
        position="relative"
        margin="auto"
      >
        <Box
          onClick={handleBoxClick}
          width="20px"
          height="20px"
          sx={{
            background: '#ff0000',
            cursor: 'pointer',
            position: 'absolute',
            top: `${boxPosition.top}px`,
            left: `${boxPosition.left}px`,
            display: isBlinking || isPause ? 'block' : 'none',
          }}
        />
      </Stack>
      {clickTime.length > 0 && (
        <Table sx={{ width: '600px', margin: 'auto' }}>
          <TableHead>
            <TableRow>
              <TableCell>Mouse Click Number</TableCell>
              <TableCell>Reaction Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clickTime.map((time, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Stack>
  );
}
