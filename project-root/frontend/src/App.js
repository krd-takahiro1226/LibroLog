// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Top from './components/Top';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './assets/styles/styles.css';
import AchievementsSettings from './components/AchievementsSettings';
import Login from './components/Login';
import Menu from './components/Menu';
import NewUserRegister from './components/NewUserRegister';
import './assets/styles/styles.css';
import SearchResult from './components/SearchResult';
import ReadingAchievements from './components/ReadingAchievements';
import SetReadingGoals from './components/SetReadingGoals';
import AchievementsSettings from './components/AchievementsSettings';
import NotFound from './components/NotFound';

import OtpVerification from './components/OtpVerification';
import ReadingAchievements from './components/ReadingAchievements';
import ReadingHistory from './components/ReadingHistory';
import ReadingRecord from './components/ReadingRecord';
import Register from './components/Register';
import Search from './components/Search';
import SearchResult from './components/SearchResult';
import SetReadingGoals from './components/SetReadingGoals';
import ShowRecords from './components/ShowRecords';
import UserSettings from './components/UserSettings';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Top />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/reading-record" element={<ReadingRecord />} />
                <Route path="/reading-history" element={<ReadingHistory />} />
                <Route path="/reading-achievements" element={<ReadingAchievements />} />
                <Route path="/searchBooks" element={<Search />} />
                <Route path="/searchBooksResult" element={<SearchResult />}></Route>
                <Route path="/showRecords" element={<ShowRecords />} />
                <Route path="/userRegistration" element={<NewUserRegister />} />
                <Route path="/otpVerification" element={<OtpVerification />} />
                <Route path="/achievements" element={<ReadingAchievements />} />
                <Route path="/myPage" element={<UserSettings />} />
                <Route path="/setReadingGoals" element={<SetReadingGoals />}></Route>
                <Route path="/achievementsSettings" element={<AchievementsSettings />}></Route>
                <Route path="*" element={<NotFound />} ></Route>
            </Routes>
        </Router>
    );
}

export default App;
