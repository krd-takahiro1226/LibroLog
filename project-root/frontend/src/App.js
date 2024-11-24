// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Menu from './components/Menu';
import Search from './components/Search';
import ShowRecords from './components/ShowRecords';
import './assets/styles/styles.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/searchBooks" element={<Search />} />
                <Route path="/showRecords" element={<ShowRecords />} />
            </Routes>
        </Router>
    );
}

export default App;
