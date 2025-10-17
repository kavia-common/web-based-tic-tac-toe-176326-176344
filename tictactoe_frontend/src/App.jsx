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

// Map game values to chess symbols and CSS classes
const markToSymbol = (value) => (value === 'X' ? '♞' : value === 'O' ? '♛' : '')
const markToClass = (value) =>
  value === 'X' ? 'mark-x' : value === 'O' ? 'mark-o' : ''

// PUBLIC_INTERFACE
export default function App() {
  /** Main TicTacToe application component. Renders the header, board, status, and controls. */
  const [board, setBoard] = useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)

  const winner = useMemo(() => calculateWinner(board), [board])
  const draw = useMemo(() => !winner && isBoardFull(board), [winner, board])

  const statusText = useMemo(() => {
    const nextSymbol = xIsNext ? '♞' : '♛'
    if (winner) {
      const winnerSymbol = markToSymbol(winner)
      const winnerName = winner === 'X' ? 'Knight' : 'Queen'
      return `${winnerSymbol} ${winnerName} wins!`
    }
    if (draw) return 'Draw!'
    const nextName = xIsNext ? 'Knight' : 'Queen'
    return `Player ${nextName} (${nextSymbol}) turn`
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

  // Determine winning line to optionally highlight cells
  const winningLine = useMemo(() => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]
    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return [a, b, c]
      }
    }
    return null
  }, [board])

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
              const isWinningCell =
                Array.isArray(winningLine) && winningLine.includes(i)
              const ariaCellContent = value
                ? (value === 'X' ? 'Knight' : 'Queen')
                : (xIsNext ? 'Knight' : 'Queen')

              return (
                <button
                  key={i}
                  type="button"
                  role="gridcell"
                  className={`cell ${value ? 'filled' : ''} ${isWinningCell ? 'cell-win' : ''}`}
                  aria-label={
                    value
                      ? `Cell ${i + 1}, ${ariaCellContent}`
                      : `Cell ${i + 1}, empty. Place ${ariaCellContent}`
                  }
                  onClick={() => handleCellClick(i)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  disabled={!isInteractive}
                >
                  <span className={`mark ${markToClass(value)} ${isWinningCell ? 'mark-win' : ''}`}>
                    {markToSymbol(value)}
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
