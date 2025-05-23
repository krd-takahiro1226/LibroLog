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
import MyPage from './components/MyPage';
import UserPassChange from './components/UserPassChange';
import UsernameChange from './components/UsernameChange';
import UserEmailChange from './components/UserEmailChange';
import SetReadingGoals from './components/SetReadingGoals';
import AchievementsSettings from './components/AchievementsSettings';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/searchBooks" element={<Search />} />
                <Route path="/searchBooksResult" element={<SearchResult />}></Route>
                <Route path="/showRecords" element={<ShowRecords />} />
                <Route path="/userRegistration" element={<NewUserRegister />} />
                <Route path="/achievements" element={<ReadingAchievements />} />
                <Route path="/myPage" element={<MyPage />} />
                <Route path="/userPassChange" element={<UserPassChange />} />
                <Route path="/usernameChange" element={<UsernameChange />} />
                <Route path="/userEmailChange" element={<UserEmailChange />} />
                <Route path="/setReadingGoals" element={<SetReadingGoals />}></Route>
                <Route path="/achievementsSettings" element={<AchievementsSettings />}></Route>
            </Routes>
        </Router>
    );
}

export default App;
