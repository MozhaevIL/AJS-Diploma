export function calcTileType(index, boardSize) {
  if (index === 0) {
    return 'top-left';
  }
  if ((index > 0) && (index < boardSize - 1)) {
    return 'top';
  }
  if (index === boardSize - 1) {
    return 'top-right';
  }
  if (index === (boardSize ** 2) - 1) {
    return 'bottom-right';
  }
  if ((index + 1) % boardSize === 0) {
    return 'right';
  }
  if (index === (boardSize ** 2) - boardSize) {
    return 'bottom-left';
  }
  if ((index) % boardSize === 0) {
    return 'left';
  }
  if ((index > (boardSize ** 2) - boardSize) && (index < boardSize ** 2)) {
    return 'bottom';
  }
  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}

export function getPlayerColumns(boardSize) {
  const playerCells = [];
  for (let i = 0; i < boardSize; i += 1) {
    playerCells.push(i * boardSize);
  }
  for (let i = 0; i < boardSize; i += 1) {
    playerCells.push(1 + i * boardSize);
  }
  return playerCells;
}

export function getComputerColumns(boardSize) {
  const computerCells = [];
  for (let i = 0; i < boardSize; i += 1) {
    computerCells.push(6 + i * boardSize);
  }
  for (let i = 0; i < boardSize; i += 1) {
    computerCells.push(7 + i * boardSize);
  }
  return computerCells;
}

export function getAllPositions(boardSize) {
  const allPositions = [];
  for (let i = 0; i < boardSize ** 2; i += 1) {
    allPositions.push(i);
  }
  return allPositions;
}

export function getFreePositions(positions, characters) {
  const occupiedPositions = [];
  characters.forEach((character) => {
    occupiedPositions.push(character.position);
  });
  return positions.filter((position) => !occupiedPositions.includes(position));
}

export function calculateRange(characterRange, position, boardSize) {
  const availibleRange = [];
  const rowNumber = Math.floor(position / boardSize);
  const columnNumber = position % boardSize;
  // движение по-горизонтали
  const row = [];
  for (let i = boardSize * rowNumber; i < boardSize * (rowNumber + 1); i += 1) {
    row.push(i);
  }
  let horizontalLeft = row.indexOf(position) - characterRange;
  if (horizontalLeft < 0) { horizontalLeft = 0; }
  let horizontalRight = row.indexOf(position) + characterRange;
  if (horizontalRight > row.length - 1) { horizontalRight = row.length - 1; }

  availibleRange.push(row.slice(horizontalLeft, horizontalRight + 1));
  // движение по-вертикали
  const column = [];
  for (let i = columnNumber; i < boardSize * (boardSize - 1) + columnNumber + 1; i += boardSize) {
    column.push(i);
  }
  let verticalTop = column.indexOf(position) - characterRange;
  if (verticalTop < 0) { verticalTop = 0; }
  let verticalBottom = column.indexOf(position) + characterRange;
  if (verticalBottom > column.length - 1) { verticalBottom = column.length - 1; }

  availibleRange.push(column.slice(verticalTop, verticalBottom + 1));

  // движение по первой диагонали
  const diag1 = [];
  let x = columnNumber;
  let y = rowNumber;
  for (let i = position; i < boardSize ** 2; i += boardSize + 1) {
    if ((x <= boardSize - 1) && (y <= boardSize - 1)) {
      diag1.push(i);
      x += 1;
      y += 1;
    }
  }
  x = columnNumber;
  y = rowNumber;
  for (let i = position; i >= 0; i -= (boardSize + 1)) {
    if ((x >= 0) && (y >= 0)) {
      diag1.push(i);
      x -= 1;
      y -= 1;
    }
  }
  diag1.sort((a, b) => a - b);
  let topLeft = diag1.indexOf(position) - characterRange;
  if (topLeft < 0) { topLeft = 0; }
  let bottomRight = diag1.indexOf(position) + characterRange;
  if (bottomRight > diag1.length - 1) { bottomRight = diag1.length - 1; }

  availibleRange.push(diag1.slice(topLeft, bottomRight + 2));

  // движение по второй диагонали
  const diag2 = [];
  x = columnNumber;
  y = rowNumber;
  for (let i = position; i < boardSize ** 2; i += boardSize - 1) {
    if ((x >= 0) && (y <= boardSize - 1)) {
      diag2.push(i);
      x -= 1;
      y += 1;
    }
  }
  x = columnNumber;
  y = rowNumber;
  for (let i = position; i >= 0; i -= (boardSize - 1)) {
    if ((x <= boardSize - 1) && (y >= 0)) {
      diag2.push(i);
      x += 1;
      y -= 1;
    }
  }
  diag2.sort((a, b) => a - b);
  let topRight = diag2.indexOf(position) - characterRange;
  if (topRight < 0) { topRight = 0; }
  let bottomLeft = diag2.indexOf(position) + characterRange;
  if (bottomLeft > diag2.length - 1) { bottomLeft = diag2.length - 1; }

  availibleRange.push(diag2.slice(topRight, bottomLeft + 2));

  return availibleRange.flat(1);
}
