import produce from 'immer';
import React, { Component } from 'react';

import * as arrayHelpers from '../../utilities/array-helpers';

import BoardSettings from './BoardSettings/BoardSettings';
import Square from './Square/Square';

class Board extends Component {
  constructor(props) {
    super(props);

    this.state = this.getInitialState();
  }

  getInitialState = (boardSize = 3) => {
    return {
      squares: this.getInitialSquares(boardSize),
      gameStatus: 'Game in progress...',
      xIsNext: true,
      isWinner: false,
      isTie: false,
      boardSize: boardSize,
      computerPlayers: 0,
    };
  };

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
    const emptySquares = arrayHelpers.getEmptyCellsByProperty(
      this.state.squares,
      'marker',
    );
    const randomSquare =
      emptySquares[Math.floor(Math.random() * emptySquares.length)];

    this.onSquareUpdate(
      randomSquare.location.row,
      randomSquare.location.column,
    );
  };

  setBoardSize = boardSize => {
    this.setState({
      ...this.getInitialState(boardSize),
      computerPlayers: this.state.computerPlayers,
    });
  };

  setComputerPlayers = computerPlayers => {
    this.setState({
      ...this.getInitialState(this.state.boardSize),
      computerPlayers,
    });
  };

  resetBoard = () => {
    this.setState(this.getInitialState());
  };

  isGameOver = () => this.state.isTie || this.state.isWinner;

  getInitialSquares = boardSize => {
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
    const square = arrayHelpers.getCell(row, column, this.state.squares);

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

  checkForWinner = squares => {
    return (
      this.checkRow(arrayHelpers.getLeftDiagonal(squares)) ||
      this.checkRow(arrayHelpers.getRightDiagonal(squares)) ||
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
      if (this.checkRow(arrayHelpers.getColumn(squares, x))) {
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

  render() {
    const { boardSize, gameStatus, computerPlayers, squares } = this.state;

    return (
      <div>
        <div className="d-flex justify-content-center my-5">
          <BoardSettings
            boardSize={boardSize}
            updateBoardSize={this.setBoardSize}
            computerCount={computerPlayers}
            updateComputerCount={this.setComputerPlayers}
            resetBoard={this.resetBoard}
          />
        </div>
        <div className="d-flex justify-content-center">
          <table>
            <thead>
              <tr>
                <th colSpan={boardSize}>{gameStatus}</th>
              </tr>
            </thead>
            <tbody>
              <BoardRows
                squares={squares}
                onSquareUpdate={this.onSquareUpdate}
              />
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

function BoardRows({ squares, onSquareUpdate }) {
  return squares.map((row, index) => (
    <tr key={`row-${index}`}>
      <SquareRow row={row} onSquareUpdate={onSquareUpdate} />
    </tr>
  ));
}

function SquareRow({ row, onSquareUpdate }) {
  return row.map(square => (
    <Square
      key={`${square.location.row}, ${square.location.column}`}
      marker={square.marker}
      onUpdate={() =>
        onSquareUpdate(square.location.row, square.location.column)
      }
    />
  ));
}

export default Board;
