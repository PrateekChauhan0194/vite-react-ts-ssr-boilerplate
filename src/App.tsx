import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useIsClient } from './utils/clientUtils'

function App() {
  const [count, setCount] = useState(0)
  const isClient = useIsClient()

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + SSR</h1>
      <div className="card">
        {/* Only enable click handlers on the client */}
        <button onClick={isClient ? () => setCount((count) => count + 1) : undefined}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <p className="ssr-indicator">
        {isClient ? '⚡ Client Hydrated' : '🔄 Server Rendered'}
      </p>
    </>
  )
}

export default App
