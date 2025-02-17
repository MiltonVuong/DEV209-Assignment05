import React, { useState, useEffect } from 'react';
import Card from './Card';

const GameBoard = ({ difficulty, updateTotalMoves }) => {
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [timer, setTimer] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    resetGame();
  }, [difficulty]);

  useEffect(() => {
    if (startTime) {
      const id = setInterval(() => {
        setTimer(Date.now() - startTime);
      }, 1000);
      setIntervalId(id);
      return () => clearInterval(id);
    }
  }, [startTime]);

  const resetGame = () => {
    const newCards = shuffle(generateCards(difficulty));
    setCards(newCards);
    setSelectedCards([]);
    setMoves(0);
    setStartTime(null);
    setTimer(0);
    setGameOver(false);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const shuffle = (array) => array.sort(() => Math.random() - 0.5);

  const generateCards = (size) => {
    const cards = [];
    const numPairs = (size * size) / 2;
    for (let i = 0; i < numPairs; i++) {
      cards.push({ value: String.fromCharCode(65 + i), matched: false });
      cards.push({ value: String.fromCharCode(65 + i), matched: false });
    }
    return cards;
  };

  const handleCardClick = (index) => {
    if (!startTime) {
      setStartTime(Date.now());
    }
    if (selectedCards.length < 2 && !cards[index].matched && !selectedCards.includes(index)) {
      const newSelectedCards = [...selectedCards, index];
      setSelectedCards(newSelectedCards);
      if (newSelectedCards.length === 2) {
        checkMatch(newSelectedCards);
      }
    }
  };

  const checkMatch = (selectedCards) => {
    const [firstIndex, secondIndex] = selectedCards;
    let newCards = cards;
    if (cards[firstIndex].value === cards[secondIndex].value) {
      newCards = cards.map((card, index) => {
        if (index === firstIndex || index === secondIndex) {
          return { ...card, matched: true };
        }
        return card;
      });
      setCards(newCards);
    }
    setTimeout(() => {
      setSelectedCards([]);
    }, 1000);
    setMoves(moves + 1);
    updateTotalMoves(1);
    checkGameOver(newCards);
  };

  const checkGameOver = (newCards) => {
    const allMatched = newCards.every(card => card.matched);
    if (allMatched) {
      clearInterval(intervalId);
      setGameOver(true);
    }
  };

  return (
    <div className="game-board-container">
      <div className="cards-container grid-container" style={{ gridTemplateColumns: `repeat(${difficulty}, 1fr)` }}>
        {cards.map((card, index) => (
          <Card
            key={index}
            value={card.value}
            matched={card.matched}
            shown={selectedCards.includes(index)}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>
      <div className="status">
        <div className="status-row">
          <p>Moves: {moves}</p>
          <p>Time: {Math.floor(timer / 60000)}m {Math.floor((timer % 60000) / 1000)}s</p>
        </div>
        {gameOver && <p id="game-over">Game Over!</p>}
      </div>
    </div>
  );
};

export default GameBoard;