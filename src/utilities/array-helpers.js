export function getColumn(matrix, col) {
  let column = [];
  for (let i = 0; i < matrix.length; i++) {
    column.push(matrix[i][col]);
  }
  return column;
}

export function getLeftDiagonal(matrix) {
  let diagonal = [];
  for (let i = 0; i < matrix.length; i++) {
    diagonal.push(matrix[i][i]);
  }
  return diagonal;
}

export function getRightDiagonal(matrix) {
  let diagonal = [];
  for (
    let row = 0, column = matrix.length - 1;
    row < matrix.length;
    column--, row++
  ) {
    diagonal.push(matrix[row][column]);
  }
  return diagonal;
}
