
import { BrowserRouter as Router , Routes, Route } from 'react-router-dom';
import Homepage from './frontend/pages/Homepage';
import Login from './frontend/pages/Login';
import Register from './frontend/pages/Register';



// import { useState } from 'react'

export default function App(){
  return (
    <>


 <Router>
        <Routes>
            <Route path='/' element={<Homepage/>}></Route>
            <Route path='/login' element={<Login/>}></Route>
            <Route path='/register' element={<Register/>}></Route>
            

        </Routes>

    </Router>
    </>
    );
}