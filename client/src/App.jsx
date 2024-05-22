import React, { useEffect, useState } from 'react'
import Header from "./pages/layouts/Header.jsx"
import Sidebar from "./pages/layouts/Sidebar.jsx"
import { Route, Routes } from 'react-router-dom'
import Home from "./pages/Home.jsx"
import Games from './pages/Games.jsx'

const App = () => {

  const [isHidden, setIsHidden] = useState(true);

  const onClickHandler = () => {
    setIsHidden(!isHidden);
  }


  return (
    <>
      <Header onClickHandler={onClickHandler} />

      <div className='flex bg-gray-700 h-full min-h-screen'>

        <Sidebar onClickHandler={onClickHandler} isHidden={isHidden} />

        <div className='flex justify-center h-full w-full pt-20 pb-20 xl:ps-[18rem] overflow-x-hidden'>
          <div className='px-3 w-full sm:w-auto sm:max-w-3xl xl:max-w-none xl:w-full xl:ps-8 xl:px-8 xl:py-2'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/games' element={<Games key="games" type='GAMES' />} />
              <Route path='/games/hyped' element={<Games key="hyped" type='HYPED' />} />
              <Route path='/games/new' element={<Games key="new" type='NEW' />} />
              <Route path='/games/upcoming' element={<Games key="upcoming" type='UPCOMING' />} />
              <Route path='/games/best' element={<Games key="best" type='BEST' />} />
            </Routes>
          </div>
        </div>

      </div>
    </>

  )
}

export default App