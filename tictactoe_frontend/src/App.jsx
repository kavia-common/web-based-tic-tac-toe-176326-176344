import React, { useMemo, useState } from 'react'

/**
 * Calculate the winner for a given 3x3 board.
 * Returns 'X', 'O', or null when no winner.
 */
function calculateWinner(board) {
  const lines = [
    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Cols
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonals
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]
    }
  }
  return null
}

/**
 * Determine if the board is full (draw condition if no winner).
 */
function isBoardFull(board) {
  return board.every((c) => c !== null && c !== '')
}

// PUBLIC_INTERFACE
export default function App() {
  /** Main TicTacToe application component. Renders the header, board, status, and controls. */
  const [board, setBoard] = useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)

  const winner = useMemo(() => calculateWinner(board), [board])
  const draw = useMemo(() => !winner && isBoardFull(board), [winner, board])

  const statusText = useMemo(() => {
    if (winner) return `${winner} wins!`
    if (draw) return 'Draw!'
    return `Player ${xIsNext ? 'X' : 'O'} turn`
  }, [winner, draw, xIsNext])

  function handleCellClick(index) {
    // Ignore clicks when cell is filled or game is over
    if (board[index] || winner) return
    const next = [...board]
    next[index] = xIsNext ? 'X' : 'O'
    setBoard(next)
    setXIsNext((prev) => !prev)
  }

  function handleKeyDown(index, e) {
    // Allow Enter/Space to activate a move for keyboard users
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleCellClick(index)
    }
  }

  function resetGame() {
    setBoard(Array(9).fill(null))
    setXIsNext(true)
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="header-inner">
          <h1 className="header-title">TicTacToe</h1>
        </div>
      </header>

      <main className="app-main">
        <section className="game-card" aria-label="TicTacToe game">
          <div
            className={`status ${winner ? 'status-win' : draw ? 'status-draw' : 'status-turn'}`}
            aria-live="polite"
            aria-atomic="true"
          >
            {statusText}
          </div>

          <div className="board" role="grid" aria-label="TicTacToe board">
            {board.map((value, i) => {
              const isInteractive = !value && !winner
              return (
                <button
                  key={i}
                  type="button"
                  role="gridcell"
                  className={`cell ${value ? 'filled' : ''}`}
                  aria-label={
                    value
                      ? `Cell ${i + 1}, ${value}`
                      : `Cell ${i + 1}, empty. Place ${xIsNext ? 'X' : 'O'}`
                  }
                  onClick={() => handleCellClick(i)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  disabled={!isInteractive}
                >
                  <span className={`mark ${value === 'X' ? 'mark-x' : value === 'O' ? 'mark-o' : ''}`}>
                    {value ?? ''}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="controls">
            <button
              type="button"
              className="btn btn-accent"
              onClick={resetGame}
              aria-label="Start a new game"
            >
              New Game
            </button>
          </div>
        </section>
      </main>

      <footer className="app-footer" aria-label="Footer">
        <p className="footnote">Enjoy the game.</p>
      </footer>
    </div>
  )
}
