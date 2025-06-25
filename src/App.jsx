
import { BrowserRouter as Router , Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';

// import { useState } from 'react'

export default function App(){
  return (
    <>


 <Router>
        <Routes>
            <Route path='/' element={<Homepage/>}></Route>
            

        </Routes>

    </Router>
    </>
    );
}