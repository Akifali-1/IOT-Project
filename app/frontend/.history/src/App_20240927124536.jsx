import { useState } from 'react'

import './App.css'
import Navbar from './Components/Navbar'
function App() {
  const [count, setCount] = useState(0)

  return (
    <><div className="bg-violet-200 wid">
      <Navbar/>
      hello
      </div>
    </>
  )
}

export default App
