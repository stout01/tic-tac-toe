import produce from 'immer';
import React, { Component } from 'react';

import * as arrayHelpers from '../../utilities/array-helpers';

import './Board.css';
import BoardSettings from './BoardSettings/BoardSettings';
import Square from './Square/Square';

const defaultGameStatus = 'Game in progress...';

class Board extends Component {
  constructor(props) {
    super(props);

    this.state = this.getInitialState();
  }

  getInitialState = (boardSize = 3) => {
    return {
      squares: this.getInitialSquares(boardSize),
      gameStatus: defaultGameStatus,
      isXTurn: true,
      isWinner: false,
      isTie: false,
      boardSize: boardSize,
      computerPlayers: 0,
    };
  };

  componentDidMount() {
    this.takeComputerTurn();
  }

  componentDidUpdate() {
    this.takeComputerTurn();
  }

  takeComputerTurn = () => {
    if (this.isComputerTurn()) {
      this.performComputerTurn();
    }
  };

  isComputerTurn = () => {
    const { computerPlayers, isXTurn } = this.state;
    return (
      !this.isGameOver() &&
      (computerPlayers === 2 || (computerPlayers === 1 && !isXTurn))
    );
  };

  performComputerTurn = () => {
    const emptySquares = arrayHelpers.getEmptyCellsByProperty(
      this.state.squares,
      'marker',
    );

    const randomSquare =
      emptySquares[Math.floor(Math.random() * emptySquares.length)];

    this.updateSquare(randomSquare.location.row, randomSquare.location.column);
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

  updateSquare = (row, column) => {
    const square = arrayHelpers.getCell(row, column, this.state.squares);

    if (this.state.isWinner || square.marker) {
      return;
    }

    this.setState(
      produce(draft => {
        draft.squares[row][column].marker = draft.isXTurn ? 'X' : 'O';
        draft.isWinner = this.checkBoardForWinner(draft.squares);
        draft.isTie = this.calculateTie(draft.squares);

        draft.gameStatus = this.getGameStatus(
          draft.isWinner,
          draft.isTie,
          draft.isXTurn,
        );

        draft.isXTurn = !draft.isXTurn;
      }),
    );
  };

  getGameStatus(isWinner, isTie, isXTurn) {
    if (isWinner) {
      return `${isXTurn ? 'X' : 'O'} Wins!`;
    } else if (isTie) {
      return 'Tie!';
    }
    return defaultGameStatus;
  }

  calculateTie = squares => {
    if (this.state.isWinner) {
      return false;
    }
    return !arrayHelpers.getEmptyCellsByProperty(squares, 'marker').length;
  };

  checkBoardForWinner = squares => {
    return (
      this.checkArrayForWinner(arrayHelpers.getLeftDiagonal(squares)) ||
      this.checkArrayForWinner(arrayHelpers.getRightDiagonal(squares)) ||
      this.checkRowsForWinner(squares) ||
      this.checkColumnsForWinner(squares)
    );
  };

  checkColumnsForWinner = squares => {
    for (let x = 0; x < this.state.boardSize; x++) {
      if (this.checkArrayForWinner(arrayHelpers.getColumn(squares, x))) {
        return true;
      }
    }

    return false;
  };

  checkRowsForWinner = squares => {
    for (let row = 0; row < squares.length; row++) {
      if (this.checkArrayForWinner(squares[row])) {
        return true;
      }
    }

    return false;
  };

  checkArrayForWinner = row => {
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
        <div className="d-flex m-auto table-container">
          <table>
            <thead>
              <tr>
                <th colSpan={boardSize}>{gameStatus}</th>
              </tr>
            </thead>
            <tbody>
              <BoardRows squares={squares} updateSquare={this.updateSquare} />
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

function BoardRows({ squares, updateSquare }) {
  return squares.map((row, index) => (
    <tr key={`row-${index}`}>
      <SquareRow row={row} updateSquare={updateSquare} />
    </tr>
  ));
}

function SquareRow({ row, updateSquare }) {
  return row.map(square => (
    <Square
      key={`${square.location.row}, ${square.location.column}`}
      marker={square.marker}
      onUpdate={() => updateSquare(square.location.row, square.location.column)}
    />
  ));
}

export default Board;
