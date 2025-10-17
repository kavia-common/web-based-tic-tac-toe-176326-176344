import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// PUBLIC_INTERFACE
function bootstrap() {
  /** Mounts the React TicTacToe application into the DOM element with id "root". */
  const container = document.getElementById('root')
  const root = createRoot(container)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}

bootstrap()
