// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Menu from './components/Menu';
import Search from './components/Search';
import ShowRecords from './components/ShowRecords';
import NewUserRegister from './components/NewUserRegister';
import './assets/styles/styles.css';
import SearchResult from './components/SearchResult';
import ReadingAchievements from './components/ReadingAchievements';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/searchBooks" element={<Search />} />
                <Route path = "/searchBooksResult" element={<SearchResult/>}></Route>
                <Route path="/showRecords" element={<ShowRecords />} />
                <Route path="/userRegistration" element={<NewUserRegister />} />
                <Route path="/achievements" element={<ReadingAchievements />} />
            </Routes>
        </Router>
    );
}

export default App;
