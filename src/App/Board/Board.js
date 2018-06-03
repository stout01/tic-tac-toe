import produce from 'immer';
import React, { Component } from 'react';

import Square from './Square/Square';

class Board extends Component {
  constructor(props) {
    super(props);

    this.state = {
      squares: this.getInitialSquareState(props.boardSize),
      gameStatus: 'Game in progress...',
      xIsNext: true,
      isWinner: false,
      isTie: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ squares: this.getInitialSquareState(nextProps.boardSize) });
  }

  getInitialSquareState = boardSize => {
    const squares = [];
    for (let row = 0; row < boardSize; row++) {
      const squareRow = [];
      for (let column = 0; column < boardSize; column++) {
        squareRow.push({ marker: '', location: { row, column } });
      }
      squares.push(squareRow);
    }
    return squares;
  };

  onSquareUpdate = (y, x) => {
    const square = this.getSquare(y, x, this.state.squares);

    if (this.state.isWinner || square.marker) {
      return;
    }

    this.setState(
      produce(draft => {
        draft.squares[y][x].marker = draft.xIsNext ? 'X' : 'O';
        draft.xIsNext = !draft.xIsNext;
        draft.isWinner = this.checkForWinner(draft.squares);
        draft.isTie = draft.isWinner ? false : this.checkForTie(draft.squares);

        if (draft.isWinner) {
          draft.gameStatus = 'Winner!';
        } else if (draft.isTie) {
          draft.gameStatus = 'Tie!';
        }
      }),
    );
  };

  getSquare = (y, x, squares) => squares[y][x];

  getEmptySquares = () => {
    return this.state.squares.reduce(
      (flatSquares, row, rowIndex) =>
        flatSquares.concat(row.filter(square => !square.marker)),
      [],
    );
  };

  checkForWinner = squares => {
    return (
      this.checkRow(getLeftDiagonal(squares)) ||
      this.checkRow(getRightDiagonal(squares)) ||
      this.checkRows(squares) ||
      this.checkColumns(squares)
    );
  };

  checkForTie = squares => {
    const flatSquares = squares.reduce(
      (flatSquares, row) => flatSquares.concat(row),
      [],
    );

    return flatSquares.every(square => square.marker !== '');
  };

  checkColumns = squares => {
    for (let x = 0; x < this.props.boardSize; x++) {
      if (this.checkRow(getColumn(squares, x))) {
        return true;
      }
    }

    return false;
  };

  checkRows = squares => {
    for (let x = 0; x < squares.length; x++) {
      if (this.checkRow(squares[x])) {
        return true;
      }
    }

    return false;
  };

  checkRow = row => {
    const rowValue = row.reduce((total, square, index) => {
      let value = 0;
      if (square.marker === 'X') {
        value = 1;
      } else if (square.marker === 'O') {
        value = -1;
      }

      return total + value;
    }, 0);

    return Math.abs(rowValue) === this.props.boardSize;
  };

  generateSquares = (rowIndex, row) => {
    return row.map((square, index) => (
      <Square
        key={[rowIndex, index]}
        marker={square.marker}
        onUpdate={() => this.onSquareUpdate(rowIndex, index)}
      />
    ));
  };

  generateRows = () => {
    return this.state.squares.map((row, index) => (
      <tr key={`row-${index}`}>{this.generateSquares(index, row)}</tr>
    ));
  };

  render() {
    return (
      <table>
        <thead>
          <tr>
            <th colSpan={this.props.boardSize}>{this.state.gameStatus}</th>
          </tr>
        </thead>
        <tbody>{this.generateRows()}</tbody>
      </table>
    );
  }
}

function getColumn(matrix, col) {
  let column = [];
  for (let i = 0; i < matrix.length; i++) {
    column.push(matrix[i][col]);
  }
  return column;
}

function getLeftDiagonal(matrix) {
  let diagonal = [];
  for (let i = 0; i < matrix.length; i++) {
    diagonal.push(matrix[i][i]);
  }
  return diagonal;
}

function getRightDiagonal(matrix) {
  let diagonal = [];
  for (let y = 0, x = matrix.length - 1; y < matrix.length; x--, y++) {
    diagonal.push(matrix[y][x]);
  }
  return diagonal;
}

export default Board;
