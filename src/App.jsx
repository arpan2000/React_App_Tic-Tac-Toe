import { useState } from "react";
import Player from "./components/Player";
import GameBoard from "./components/GameBoard";
import Log from "./components/Log";
import { WINNING_COMBINATIONS } from "./WINNING_COMBINATIONS";
import GameOver from "./components/GameOver";

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

// function to get the SYMBOL of PLAYER in turn
function deriveActivePlayer(gameTurns) {
  let currentPlayer = "X";

  if (gameTurns.length > 0 && gameTurns[0].player === "X") {
    currentPlayer = "O";
  }
  return currentPlayer;
}

export default function App() {
  const [players, setPlayers] = useState({
    X: "Player 1",
    O: "Player 2"
  });
  const [gameTurns, setGameTurns] = useState([]); // details of player in turn
  const activePlayer = deriveActivePlayer(gameTurns); // which player is active now

  // this function adds player symbol in the board
  let gameBoard = [...initialGameBoard.map((array) => [...array])]; // here we are making a deep copy of initialGameBoard since objects/arrys are reference values

  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;

    gameBoard[row][col] = player;
  }

  // this function handle whose turn it is
  function handleSelectSquare(rowIndex, colIndex) {
    setGameTurns((prevTurns) => {
      const currentPlayer = deriveActivePlayer(prevTurns);

      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];
      return updatedTurns;
    });
  }

  // checks for winner
  let winner;

  for (const combinations of WINNING_COMBINATIONS) {
    const firstSqaureSymbol =
      gameBoard[combinations[0].row][combinations[0].column];
    const secondSqaureSymbol =
      gameBoard[combinations[1].row][combinations[1].column];
    const thirdSqaureSymbol =
      gameBoard[combinations[2].row][combinations[2].column];

    if (
      firstSqaureSymbol &&
      firstSqaureSymbol === secondSqaureSymbol &&
      firstSqaureSymbol === thirdSqaureSymbol
    ) {
      winner = players[firstSqaureSymbol];
    }
  }

  const drawMatch = gameTurns.length === 9 && !winner; // to check for draw

  // to restart
  function handleRestart() {
    setGameTurns([]);
  }

  // handle the new player name
  function handleChangePlayerName(symbol, newName) {
    setPlayers((prevPlayer) => {
      return {
        ...prevPlayer,
        [symbol]: newName,
      };
    });
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName="Player 1"
            symbol="X"
            isActive={activePlayer === "X"}
            onChangeName={handleChangePlayerName}
          />
          <Player
            initialName="Player 2"
            symbol="O"
            isActive={activePlayer === "O"}
            onChangeName={handleChangePlayerName}
          />
        </ol>
        {(winner || drawMatch) && (
          <GameOver winner={winner} onRestart={handleRestart} />
        )}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} />
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}
