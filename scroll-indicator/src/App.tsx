import React from 'react'
import { ScrollView } from './components/scroll-view/index'
import logo from './logo.svg'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <ScrollView />
      </header>
    </div>
  )
}

export default App
