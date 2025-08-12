import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'

import Home from './pages/Home';
import AddBook from './pages/AddBook';
import Borrow from './pages/Borrow';
import Records from './pages/Records';
import ReturnBook from './pages/ReturnBook';
import Landing from './pages/Landing';


function UiRoutes() {
  return (
    <div className="app-shell" style={{position:'relative', zIndex:1}}>
      <header className="header" style={{position:'relative',display:'flex',justifyContent:'center',alignItems:'center', zIndex:10}}>
        <Link to="/" style = {{textDecoration:'none'}}><h1 style={{color:'white', fontSize:'6vh',fontWeight:'bolder', marginBottom: 4}}>Library Management System</h1></Link>
        <nav className="nav">
          <Link className="btn" to="/ui/">Home</Link>
          <Link className="btn" to="/ui/add">Add Book</Link>
          <Link className="btn" to="/ui/borrow">Borrow Book</Link>
          <Link className="btn" to="/ui/records">Borrow Records</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="add" element={<AddBook/>} />
          <Route path="borrow" element={<Borrow/>} />
          <Route path="records" element={<Records/>} />
          <Route path="return" element={<ReturnBook/>} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing/>} />
      <Route path="/ui/*" element={<UiRoutes />} />
    </Routes>
  );
}
