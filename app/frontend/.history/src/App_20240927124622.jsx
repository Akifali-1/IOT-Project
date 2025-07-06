import { useState } from 'react'

import './App.css'
import Navbar from './Components/Navbar'
function App() {
  const [count, setCount] = useState(0)

  return (
    <><div className="bg-violet-40 w-screen min-h-screen">
      <Navbar/>
      hello
      </div>
    </>
  )
}

export default App
