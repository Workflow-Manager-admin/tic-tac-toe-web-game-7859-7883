import React, { useState } from 'react';
import './App.css';

/**
 * Color Theme:
 *  - Primary:   #1976D2
 *  - Secondary: #424242
 *  - Accent:    #FFC107
 */

// Helper: Checks for a win and returns indices or null
const calculateWinner = (squares) => {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6],         // diagonals
  ];
  for (let [a,b,c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) return {player: squares[a], line: [a, b, c]};
  }
  return null;
};

// PUBLIC_INTERFACE
function App() {
  // X always goes first
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winnerInfo, setWinnerInfo] = useState(null);
  const [score, setScore] = useState({X: 0, O: 0});
  const [drawCount, setDrawCount] = useState(0);

  // Handle square click
  // PUBLIC_INTERFACE
  const handleSquareClick = (idx) => {
    if (gameOver || squares[idx]) return;
    const ns = squares.slice();
    ns[idx] = xIsNext ? 'X' : 'O';
    const win = calculateWinner(ns);
    let draw = false;
    if (win) {
      setScore((s) => ({
        ...s,
        [win.player]: s[win.player] + 1,
      }));
      setGameOver(true);
      setWinnerInfo(win);
    } else if (ns.every(Boolean)) {
      setDrawCount((d) => d + 1);
      setGameOver(true);
      setWinnerInfo(null);
      draw = true;
    }
    setSquares(ns);
    setXIsNext(!win && !draw ? !xIsNext : xIsNext);
  };

  // PUBLIC_INTERFACE
  const handleRestart = () => {
    setSquares(Array(9).fill(null));
    setGameOver(false);
    setWinnerInfo(null);
    setXIsNext(true);
  };

  // UI rendering helpers
  const getStatus = () => {
    if (winnerInfo && winnerInfo.player) {
      return (
        <span style={{ color: 'var(--accent)' }}>
          Player {winnerInfo.player} wins!
        </span>
      );
    }
    if (gameOver && !winnerInfo) {
      return <span style={{ color: 'var(--secondary)' }}>It{"'"}s a draw!</span>;
    }
    return (
      <span style={{ color: xIsNext ? 'var(--primary)' : 'var(--secondary)' }}>
        Next: Player {xIsNext ? 'X' : 'O'}
      </span>
    );
  };

  // Render a single square (cell)
  const renderSquare = (i) => {
    const highlight = winnerInfo && winnerInfo.line.includes(i);
    return (
      <button
        key={i}
        className={`ttt-square${highlight ? " ttt-win" : ""}`}
        onClick={() => handleSquareClick(i)}
        aria-label={`Board cell ${i + 1}, ${squares[i] ? squares[i] : "empty"}`}
        disabled={!!squares[i] || gameOver}
      >
        {squares[i]}
      </button>
    );
  };

  // Scoreboard above the board
  const Scoreboard = () => (
    <div className="ttt-scoreboard">
      <div className="score-label" style={{color:"var(--primary)"}}>Player X</div>
      <div className="score-label" style={{color:"var(--secondary)"}}>Draw</div>
      <div className="score-label" style={{color:"var(--secondary)"}}>Player O</div>
      <div className="score">{score.X}</div>
      <div className="score">{drawCount}</div>
      <div className="score">{score.O}</div>
    </div>
  );

  return (
    <div className="App" style={{
      background: 'var(--bg-primary)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="ttt-container">
        <h1 className="ttt-title">
          Tic Tac Toe
        </h1>
        <Scoreboard />
        <div className="ttt-status">
          {getStatus()}
        </div>
        <div className="ttt-board">
          {[0,1,2].map(r =>
            <div key={r} className="ttt-row">
              {[0,1,2].map(c => renderSquare(3*r+c))}
            </div>
          )}
        </div>
        <div className="ttt-controls">
          <button className="ttt-btn" onClick={handleRestart} aria-label="Restart Game">
            Restart
          </button>
        </div>
        <div className="ttt-footer">
          <span>Two Player Mode · Modern Minimal UI</span>
        </div>
      </div>
    </div>
  );
}

export default App;
