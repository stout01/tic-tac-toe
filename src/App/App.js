import React, { Component } from 'react';

import './App.css';
import Board from './Board/Board';
import BoardSettings from './BoardSettings/BoardSettings';

class App extends Component {
  constructor() {
    super();

    this.state = {
      size: 3,
    };
  }

  setBoardSize = size => {
    this.setState({ size });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Tic-Tac-Toe</h1>
        </header>
        <div className="d-flex justify-content-center mt-5">
          <BoardSettings
            boardSize={this.state.size}
            updateBoardSize={this.setBoardSize}
          />
        </div>
        <div className="d-flex justify-content-center mt-5">
          <Board boardSize={this.state.size} />
        </div>
      </div>
    );
  }
}

export default App;
