import produce from 'immer';
import React, { Component } from 'react';

import Square from './Square/Square';

class Board extends Component {
  constructor(props) {
    super(props);

    this.state = {
      squares: this.getInitialSquareState(),
      xIsNext: true,
    };
  }

  getInitialSquareState = () => {
    const squares = [];
    for (let x = 0; x < this.props.boardSize; x++) {
      const squareRow = [];
      for (let y = 0; y < this.props.boardSize; y++) {
        squareRow.push({ marker: '' });
      }
      squares.push(squareRow);
    }
    return squares;
  };

  onSquareUpdate = (x, y) => {
    this.setState(
      produce(draft => {
        draft.squares[x][y].marker = draft.xIsNext ? 'X' : 'O';
        draft.xIsNext = !draft.xIsNext;
      }),
    );
  };

  checkForWinner = () => {
    return this.checkRows(this.state.squares);
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
      } else if (square.marker === 'Y') {
        value = -1;
      }

      return total + value;
    }, 0);

    return Math.abs(rowValue) === 3;
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
        <thead>{this.checkForWinner() ? 'Winner!' : ''}</thead>
        <tbody>{this.generateRows()}</tbody>
      </table>
    );
  }
}

export default Board;
