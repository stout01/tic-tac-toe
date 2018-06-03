import React, { Component } from 'react';

import './App.css';
import Board from './Board/Board';
import BoardSettings from './BoardSettings/BoardSettings';

class App extends Component {
  constructor() {
    super();

    this.state = {
      boardSize: 3,
      computerPlayers: 0,
    };
  }

  setBoardSize = size => {
    this.setState({ size });
  };

  setComputerPlayers = computerPlayers => {
    this.setState({ computerPlayers });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Tic-Tac-Toe</h1>
        </header>
        <div className="d-flex justify-content-center mt-5">
          <BoardSettings
            boardSize={this.state.boardSize}
            updateBoardSize={this.setBoardSize}
            computerCount={this.state.computerPlayers}
            updateComputerCount={this.setComputerPlayers}
          />
        </div>
        <div className="d-flex justify-content-center mt-5">
          <Board
            boardSize={this.state.boardSize}
            computers={this.state.computerPlayers}
          />
        </div>
      </div>
    );
  }
}

export default App;
