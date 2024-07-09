import React, { useEffect, useState } from 'react'
import Header from "./pages/layouts/Header.jsx"
import Sidebar from "./pages/layouts/Sidebar.jsx"
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from "./pages/Home.jsx"
import Games from './pages/Games.jsx'
import Game from './pages/Game.jsx'
import Events from './pages/Events.jsx'

const App = () => {

  const [isHidden, setIsHidden] = useState(true);
  const location = useLocation();

  const onClickHandler = () => {
    setIsHidden(!isHidden);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      <Header onClickHandler={onClickHandler} />

      <div className='flex bg-gray-700 h-full min-h-screen'>

        <Sidebar onClickHandler={onClickHandler} isHidden={isHidden} />

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/games' element={<Games key="games" type='GAMES' />} />
          <Route path='/games/hyped' element={<Games key="hyped" type='HYPED' />} />
          <Route path='/games/new' element={<Games key="new" type='NEW' />} />
          <Route path='/games/upcoming' element={<Games key="upcoming" type='UPCOMING' />} />
          <Route path='/games/best' element={<Games key="best" type='BEST' />} />
          <Route path='/events' element={<Events />} />

          <Route path='/game/:slug' element={<Game />} />
        </Routes>

      </div >
    </>

  )
}

export default App