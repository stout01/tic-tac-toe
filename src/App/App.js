import React, { Component } from 'react';

import './App.css';
import Board from './Board/Board';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Tic-Tac-Toe</h1>
        </header>
        <div className="d-flex justify-content-center mt-5">
          <Board boardSize={3} />
        </div>
      </div>
    );
  }
}

export default App;
