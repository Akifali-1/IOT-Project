import { useState } from 'react'

import './App.css'
import Navbar from './Components/Navbar'
function App() {
  const [count, setCount] = useState(0)

  return (
    <><div className="bg-violet-50 w-screen min-h-screen">
      <Navbar/>
      <div className="connect">
        <img src="url("https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.kindpng.com%2Fimgv%2FhTJJmRi_wifi-router-router-logo-hd-png-download%2F&psig=AOvVaw2lYOnuEJpZIlEo6eHd_A1v&ust=1727507934593000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMDtjezK4ogDFQAAAAAdAAAAABAE")" alt="" />
      </div>
      </div>
    </>
  )
}

export default App
