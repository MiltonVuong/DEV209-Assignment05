import React, { useState, useEffect } from 'react';
import GameBoard from './GameBoard';
import './App.css';

const App = () => {
  const [difficulty, setDifficulty] = useState(2);
  const [theme, setTheme] = useState('blue');
  const [totalMoves, setTotalMoves] = useState(0);

  useEffect(() => {
    const savedDifficulty = sessionStorage.getItem('selectedDifficulty') || 2;
    const savedTheme = sessionStorage.getItem('selectedTheme') || 'blue';
    const savedTotalMoves = parseInt(localStorage.getItem('totalMoves'), 10) || 0;
    setDifficulty(parseInt(savedDifficulty));
    setTheme(savedTheme);
    setTotalMoves(savedTotalMoves);

    const handleStorageChange = (event) => {
      if (event.key === 'totalMoves') {
        setTotalMoves(parseInt(event.newValue, 10) || 0);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleDifficultyChange = (e) => {
    setDifficulty(parseInt(e.target.value));
    sessionStorage.setItem('selectedDifficulty', e.target.value);
  };

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
    sessionStorage.setItem('selectedTheme', e.target.value);
  };

  const updateTotalMoves = (moves) => {
    const newTotalMoves = totalMoves + moves;
    setTotalMoves(newTotalMoves);
    localStorage.setItem('totalMoves', newTotalMoves);
  };

  const resetGame = () => {
    window.location.reload(); // Simple way to reset the game for now
  };

  return (
    <div className={`app theme-color-${theme}`}>
      <h1>Memory Game</h1>
      <div className="options">
        <div>
          <label htmlFor="difficulty">Difficulty:</label>
          <select id="difficulty" value={difficulty} onChange={handleDifficultyChange}>
            <option value="2">Easy (2x2)</option>
            <option value="4">Medium (4x4)</option>
            <option value="6">Hard (6x6)</option>
          </select>
        </div>
        <div>
          <label htmlFor="color-theme">Color Theme:</label>
          <select id="color-theme" value={theme} onChange={handleThemeChange}>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="purple">Purple</option>
          </select>
        </div>
        <button id="new-game" className="btn" onClick={resetGame}>New Game</button>
      </div>
      <GameBoard difficulty={difficulty} updateTotalMoves={updateTotalMoves} />
      <div className="status">
        <div className="status-row">
          <p>Total Moves: {totalMoves}</p>
        </div>
      </div>
    </div>
  );
};

export default App;