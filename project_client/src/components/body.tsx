import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Index from '../pages/index';
import Ask from '../pages/ask';
import Answer from '../pages/answer';
import Login from '../pages/login';


const Body = () => {
  return (
    <Routes> {/* The Switch decides which component to show based on the current URL.*/}
      <Route path='/' element={<Index/>}></Route>
      <Route path='/ask' element={<Ask/>}></Route>
      <Route path='/answer' element={<Answer/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
    </Routes>
  );
}

export default Body;