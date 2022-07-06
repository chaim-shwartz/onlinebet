import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from './App';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import MySales from './components/MySales';
import Notifications, {notify} from 'react-notify-toast';
import Header from './components/Header';
import MyLikes from './components/MyLikes';
import SalePage from './components/SalePage';
import MyOffers from './components/MyOffers';
import EditProfile from './components/EditProfile';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
      <Header/>
      <Notifications />
      <Routes>
        <Route path='/' element={<App />}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/signin' element={<SignIn/>}/>
        <Route path='/mysales' element={<MySales/>}/>
        <Route path='/mylikes' element={<MyLikes/>}/>
        <Route path='/myoffers' element={<MyOffers/>}/>
        <Route path='/editprofile' element={<EditProfile/>}/>
        <Route path='/salepage/:id' element={<SalePage/>}/>
      </Routes>
    </Router>
);
