import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

/**
 * @param {("O" | "X" | null)[]} squares
 * @returns "O" | "X" | null
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

/**
 * @param {number | null} i
 * @return {{col: number, row: number} | null} on board position
 */
function calculatePosition(i) {
  if (i == null) {
    return null;
  }
  const col = Math.floor(i / 3) + 1;
  const row = i % 3 + 1;
  return { col, row };
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={"cell-" + i}
      />
    );
  }

  renderSquareRow(begin, length) {
    return [...Array(length)].map((_, i) => this.renderSquare(begin + i));
  }

  render() {
    return (
      <div>
        {[...Array(3)].map((_, i) => (
          <div className="board-row" key={"row-" + i}>
            {this.renderSquareRow(i * 3, 3)}
          </div>
        ))}
      </div>
    );
  }
}

class Game2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        position: null,
        step: 0,
      }],
      stepNumber: 0,
      xIsNext: true,
      isSortAsc: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{
        squares: squares,
        position: i,
        step: history.length,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  reverseHistory() {
    this.setState({
      isSortAsc: !this.state.isSortAsc,
    });
  }

  render() {
    const history = this.state.history;
    const current = history.find((h) => this.state.stepNumber === h.step);
    const winner = calculateWinner(current.squares);

    const moves = history.map((step) => {
      const move = step.step;
      const pos = calculatePosition(step.position);
      const desc = move ? "Go to move #" + move : "Go to game start";
      const isCurrent = this.state.stepNumber === move ? "is-current" : "";
      return (
        <li key={move} className={isCurrent}>
          {pos == null ? " " : `pos: (${pos.col}, ${pos.row}) `}
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
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
          <div>
            <button onClick={() => this.reverseHistory()}>
              toggle history sort (asc/desc)
            </button>
          </div>
          <ol>{this.state.isSortAsc ? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.hydrateRoot(document.getElementById("root"));
root.render(<Game2 />);
