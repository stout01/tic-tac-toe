import produce from 'immer';
import React, { Component } from 'react';

import BoardSettings from './BoardSettings/BoardSettings';
import Square from './Square/Square';

class Board extends Component {
  constructor(props) {
    super(props);

    this.state = {
      squares: this.getInitialSquareState(3),
      gameStatus: 'Game in progress...',
      xIsNext: true,
      isWinner: false,
      isTie: false,
      boardSize: 3,
      computerPlayers: 0,
    };
  }

  componentDidMount() {
    if (this.isComputerTurn()) {
      this.performComputerTurn();
    }
  }

  componentDidUpdate() {
    if (this.isComputerTurn()) {
      this.performComputerTurn();
    }
  }

  isComputerTurn = () => {
    const { computerPlayers, xIsNext } = this.state;
    return (
      !this.isGameOver() &&
      (computerPlayers === 2 || (computerPlayers === 1 && !xIsNext))
    );
  };

  performComputerTurn = () => {
    const emptySquares = this.getEmptySquares();
    const randomSquare =
      emptySquares[Math.floor(Math.random() * emptySquares.length)];

    this.onSquareUpdate(
      randomSquare.location.row,
      randomSquare.location.column,
    );
  };

  setBoardSize = boardSize => {
    this.setState({
      boardSize,
      squares: this.getInitialSquareState(boardSize),
      isWinner: false,
      isTie: false,
      xIsNext: true,
    });
  };

  setComputerPlayers = computerPlayers => {
    this.setState({
      computerPlayers,
      squares: this.getInitialSquareState(this.state.boardSize),
      isWinner: false,
      isTie: false,
      xIsNext: true,
    });
  };

  isGameOver = () => this.state.isTie || this.state.isWinner;

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

  onSquareUpdate = (row, column) => {
    const square = this.getSquare(row, column, this.state.squares);

    if (this.state.isWinner || square.marker) {
      return;
    }

    this.setState(
      produce(draft => {
        draft.squares[row][column].marker = draft.xIsNext ? 'X' : 'O';
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

  getSquare = (row, column, squares) => squares[row][column];

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
    for (let x = 0; x < this.state.boardSize; x++) {
      if (this.checkRow(getColumn(squares, x))) {
        return true;
      }
    }

    return false;
  };

  checkRows = squares => {
    for (let row = 0; row < squares.length; row++) {
      if (this.checkRow(squares[row])) {
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

    return Math.abs(rowValue) === this.state.boardSize;
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
      <div>
        <div className="d-flex justify-content-center my-5">
          <BoardSettings
            boardSize={this.state.boardSize}
            updateBoardSize={this.setBoardSize}
            computerCount={this.state.computerPlayers}
            updateComputerCount={this.setComputerPlayers}
          />
        </div>
        <div className="d-flex justify-content-center">
          <table>
            <thead>
              <tr>
                <th colSpan={this.state.boardSize}>{this.state.gameStatus}</th>
              </tr>
            </thead>
            <tbody>{this.generateRows()}</tbody>
          </table>
        </div>
      </div>
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
  for (
    let row = 0, column = matrix.length - 1;
    row < matrix.length;
    column--, row++
  ) {
    diagonal.push(matrix[row][column]);
  }
  return diagonal;
}

export default Board;
