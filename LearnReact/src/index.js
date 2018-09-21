import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {

//     constructor(props){
//       super(props);
//       this.state = {
//         value : null,
//       };
//     }

//     render() {
//       return (
//         <button className="square" 
//         onClick={() => this.props.onClick()}
//         >
//           {this.props.value}
//         </button>
//       );
//     }
//   }

  function Square(props){
    return (
      <button className = "square" onClick = {props.onClick}>
        {props.value}
      </button>
    );
  }

  function calculateWinner(squares) {
    const combination2win = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < combination2win.length; i++){
      const [a, b, c] = combination2win[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
        return squares[a];
      }
    }
    if (!squares.includes(null)) {
      return 'Tie';
    }
    return null;
  }

  
  class Board extends React.Component {

    renderSquare(i) {
      return (
      <Square 
      value={this.props.squares[i]} 
      onClick={() => this.props.onClick(i)}
      />
      );
    }
  
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [
          {squares: Array(9).fill(null),}
        ],
        stepNumber: 0,
        xIsNext: true,
      };
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1)
      const current = history[history.length - 1];
      const squares = current.squares.slice();

      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }

    jumpTo(step) {
      this.setState({
        stepNumber : step,
        xIsNext: (step % 2) === 0,
      });
    }

    compare2Arrays(array1, array2){
      for (let i = 0; i < array2.length; i++){
        let location, player, row, col;
        if (String(array2[i]) !== String(array1[i])) {
          player = array2[i];
          col = (i+1)%3 ? (i+1)%3 : 3
          row = (i+1)%3 ? Math.floor((i+1)/3) + 1 : Math.floor((i+1)/3)
          location = [row, col];
          return [player, location];
        }
      }
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      let desc;
      const moves = history.map((move, index) => {
        if (index > 0 && history.length > 1) {
          const change = this.compare2Arrays(history[index - 1].squares, history[index].squares)
          desc = 'Go to move #' + index + ' Player: ' + change[0] + ' move: (' + change[1] + ')';
        }else{
          desc = 'Go to game start';
        }
        
        
        return (
          <li key={index}> 
            <button onClick={() => this.jumpTo(index)}>{desc}</button>
          </li>
        );
      });


      let status;
      if (winner) {
        if (winner !== 'Tie'){
          status = 'Winner: ' + winner
        } else {
          status = 'This is a tie game.'
        }
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );