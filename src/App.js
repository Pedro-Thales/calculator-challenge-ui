import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom"
import RecordList from "./pages/RecordList"
import RecordCreate from "./pages/RecordCreate"
import Login from "./pages/Login"
import ButtonAppBar from './components/Appbar'

function App() {
  const [balance, setBalance] = useState('0');


  return (
    <div className='App'>
      <BrowserRouter>
        <ButtonAppBar balance={balance}></ButtonAppBar>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/dashboard" element={<RecordList setBalance={setBalance} />} />
          <Route path="/create" element={<RecordCreate setBalance={setBalance}/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;