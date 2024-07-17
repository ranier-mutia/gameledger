import React, { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Login from './pages/layouts/Login.jsx'
import Header from "./pages/layouts/Header.jsx"
import Sidebar from "./pages/layouts/Sidebar.jsx"
import Home from "./pages/Home.jsx"
import Games from './pages/Games.jsx'
import Game from './pages/Game.jsx'
import Events from './pages/Events.jsx'
import Event from './pages/Event.jsx'

const App = () => {

  const [isLoginShown, setIsLoginShown] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const location = useLocation();

  const onLoginClickHandler = () => {
    setIsLoginShown(!isLoginShown);
  }

  const onMenuClickHandler = () => {
    setIsHidden(!isHidden);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      <Header onMenuClickHandler={onMenuClickHandler} onLoginClickHandler={onLoginClickHandler} />

      <Login isShown={isLoginShown} onLoginClickHandler={onLoginClickHandler} />

      <div className='flex bg-gray-700 h-full min-h-screen'>

        <Sidebar onMenuClickHandler={onMenuClickHandler} isHidden={isHidden} />

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/games' element={<Games key="games" type='GAMES' />} />
          <Route path='/games/hyped' element={<Games key="hyped" type='HYPED' />} />
          <Route path='/games/new' element={<Games key="new" type='NEW' />} />
          <Route path='/games/upcoming' element={<Games key="upcoming" type='UPCOMING' />} />
          <Route path='/games/best' element={<Games key="best" type='BEST' />} />
          <Route path='/game/:slug' element={<Game />} />

          <Route path='/events' element={<Events />} />
          <Route path='/event/:slug' element={<Event />} />

        </Routes>

      </div >
    </>

  )
}

export default App