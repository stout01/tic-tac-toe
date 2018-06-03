import produce from 'immer';
import React, { Component } from 'react';

import Square from './Square/Square';

class Board extends Component {
  constructor(props) {
    super(props);

    this.state = {
      squares: this.getInitialSquareState(),
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
        draft.squares[x][y].marker = 'x';
      }),
    );
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
        <tbody>{this.generateRows()}</tbody>
      </table>
    );
  }
}

export default Board;
