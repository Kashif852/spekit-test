import React, { useState } from "react";

import "./Game.css";

import {
  Grid,
  ChoiceBoard,
  Button,
  NoSolutionFoundModal,
  GameDetails,
  DifficultySelectionModal,
} from "../../components/index.js";

import {
  animateElement,
  arrayDeepCopy,
  checkBoard,
  checkPlayerWon,
  createSudokuGrid,
  solveSudoku,
} from "../../utility";

import useLocalStorage from "../../hooks/useLocalStorage";
import getHint from "../../utility/getHint";

const easyMaxEmptyCells = 30;
const mediumMaxEmptyCells = 40;
const hardMaxEmptyCells = 50;

const Game = () => {
  const [grid, setGrid] = useLocalStorage("currentGrid", null);
  const [startingGrid, setStartingGrid] = useLocalStorage("startingGrid", null);
  const [clickValue, setClickValue] = useLocalStorage("clickValue", 1);

  // Game Score logic
  const [gameMode, setGameMode] = useLocalStorage(
    "gameMode",
    mediumMaxEmptyCells
  );
  const [movesTaken, setMovesTaken] = useLocalStorage("movesTaken", 0);
  const [hintsTaken, setHintsTaken] = useLocalStorage("hintsTaken", 0);
  const [isPlayerWon, setIsPlayerWon] = useLocalStorage("playerWon", false);
  const [pressedSolve, setPressedSolve] = useLocalStorage(
    "pressedSolve",
    false
  );

  const [startTime, setStartTime] = useLocalStorage("startTime", () =>
    Date().toLocaleString()
  );

  // Logic for modal
  const [showNoSolutionFoundModal, setShowNoSolutionFoundModal] =
    useState(false);

  const handleSolve = () => {
    let solvedBoard = arrayDeepCopy(grid);
    let solvedStatus = solveSudoku(solvedBoard);
    if (solvedStatus === false) {
      setShowNoSolutionFoundModal((show) => !show);
      return;
    }

    let newHints = 0;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (grid[i][j].value === 0) {
          newHints++;
          solvedBoard[i][j].isHinted = true;
          solvedBoard[i][j].isModifiable = false;
        }
      }
    }

    setHintsTaken((hints) => hints + newHints);
    setIsPlayerWon(true);
    setPressedSolve(true);
    setGrid(solvedBoard);
  };

  const handleHint = () => {
    // Checking if player has won
    if (isPlayerWon) return;

    // Getting hint
    let hintResponse = getHint(grid);

    // Checking if the grid cannot be solved
    if (hintResponse.solvedStatus === false) {
      setShowNoSolutionFoundModal((show) => !show);
      return;
    }

    // setting the result board
    setGrid(hintResponse.board);

    // Adding hint count
    setHintsTaken((hints) => hints + 1);

    // Checking if the player has won
    let playerWon = checkPlayerWon(hintResponse.board);
    if (playerWon) {
      setIsPlayerWon(true);
    }
  };

  const handleNewGame = (maxEmptyCellsCount) => {
    // Waiting for the function to return the grid
    let newSudokuGrid = createSudokuGrid(maxEmptyCellsCount);

    setStartingGrid(arrayDeepCopy(newSudokuGrid));
    setGrid(arrayDeepCopy(newSudokuGrid));

    // Setting the game mode with maxEmptyCellsCount
    setGameMode(maxEmptyCellsCount);

    // Reseting the values
    setMovesTaken(0);
    setHintsTaken(0);
    setIsPlayerWon(false);
    setPressedSolve(false);
    setStartTime(() => Date().toLocaleString());

  };

  const handleClearBoard = () => {
    setIsPlayerWon(false);
    setGrid(arrayDeepCopy(startingGrid));
  };

  const handleCellClick = (row, column, isModifiable) => {
    if (!isModifiable) {
      animateElement(".grid-table", "headShake");
      return;
    }

    // moves registered when the value is not 0
    if (clickValue !== 0) setMovesTaken((moves) => moves + 1);

    let newGrid = arrayDeepCopy(grid);
    newGrid[row][column].value = clickValue;

    // Marking the node valid or invalid depending on the grid
    checkBoard(newGrid);

    // Checking if the player has won
    let playerWon = checkPlayerWon(newGrid);
    if (playerWon) {
      setIsPlayerWon(true);
    }

    // setting the value to the grid and also to the local storage
    setGrid(newGrid);
  };

  console.log("....");

  // If we donot have anything in the local storage
  if (grid == null && startingGrid == null) handleNewGame(gameMode);

  return (
    <div className="Game">
      
      {/* Title */}
      <h1
        className="main-title"
      >
        Sudoku Game
      </h1>

      {/* No solution found Modal */}
      {showNoSolutionFoundModal && (
        <NoSolutionFoundModal
          closeModal={() => setShowNoSolutionFoundModal((show) => !show)}
        />
      )}


      
      <GameDetails
          movesTaken={movesTaken}
          hintsTaken={hintsTaken}
          startTime={startTime}
          isPlayerWon={isPlayerWon}
          pressedSolve={pressedSolve}
          gameMode={gameMode}
          mediumMaxEmptyCells={mediumMaxEmptyCells}
          hardMaxEmptyCells={hardMaxEmptyCells}
        />

      {/* Game Grid */}
      <Grid handleCellClick={handleCellClick} grid={grid} />
      
      {/* choose numbers 1,2,3,4,5,6,7,8,9 */}
      <ChoiceBoard setClickValue={setClickValue} selected={clickValue} />

      {/* Clear, Solve, Hint, New game Buttons */}
      <div className="action-container">
        <Button
          onClick={handleClearBoard}
          buttonStyle="btn--primary--solid"
          text="Clear"
        />
        <Button
          onClick={handleSolve}
          buttonStyle="btn--primary--solid"
          text="Solve"
        />
        <Button
          onClick={handleHint}
          buttonStyle="btn--primary--solid"
          text="Hint"
        />

        <DifficultySelectionModal
          handleNewGame={handleNewGame}
          easyMaxEmptyCells={easyMaxEmptyCells}
          mediumMaxEmptyCells={mediumMaxEmptyCells}
          hardMaxEmptyCells={hardMaxEmptyCells}
        />
      </div>
    </div>
  );
};

export default Game;
