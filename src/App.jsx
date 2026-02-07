import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ChessClock from './components/chessClock'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ChessClock></ChessClock>
    </>
  )
}

export default App
