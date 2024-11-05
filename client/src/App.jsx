import React, { useEffect, useState } from 'react'
import { Route, Routes, useLocation, Navigate } from 'react-router-dom'
import { UserContext } from './hooks/UserContext.jsx'
import LoginContext from './hooks/LoginContext.jsx'
import axios from "axios"
import Login from './pages/layouts/Login.jsx'
import Header from "./pages/layouts/Header.jsx"
import Sidebar from "./pages/layouts/Sidebar.jsx"
import Home from "./pages/Home.jsx"
import Games from './pages/Games.jsx'
import Game from './pages/Game.jsx'
import Events from './pages/Events.jsx'
import Event from './pages/Event.jsx'
import Reviews from './pages/Reviews.jsx'
import GameReviews from './pages/GameReviews.jsx'
import Review from './pages/Review.jsx'
import ReviewEditor from './pages/ReviewEditor.jsx'


const App = () => {

  const [isLoginShown, setIsLoginShown] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  const location = useLocation();

  const [user, setUser] = useState({
    loggedIn: false
  });

  const onLoginClickHandler = () => {
    setIsLoginShown(!isLoginShown);
  }

  const onMenuClickHandler = () => {
    setIsHidden(!isHidden);
  }

  const authenticateUser = async () => {

    await axios.post(import.meta.env.VITE_REACT_APP_SERVER_BASEURL + 'users/authUser', undefined, { withCredentials: true })
      .then((response) => {
        const authUser = response.data;

        if (authUser) {
          setUser({ username: authUser.username, email: authUser.email, loggedIn: true });
        } else {
          setUser({ loggedIn: false });
        }

      })
      .catch((error) => {
        console.log(error);
      });
  }

  const logout = async () => {

    await axios.post(import.meta.env.VITE_REACT_APP_SERVER_BASEURL + 'users/logout', undefined, { withCredentials: true })
      .then((response) => {

        window.location.reload();

      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {

    window.scrollTo(0, 0);
    authenticateUser();

  }, [location]);

  return (
    <>
      <UserContext.Provider value={user}>

        <Header onMenuClickHandler={onMenuClickHandler} onLoginClickHandler={onLoginClickHandler} logout={logout} />

        <Login isShown={isLoginShown} onLoginClickHandler={onLoginClickHandler} authenticateUser={authenticateUser} />

        <div className='flex bg-gray-700 h-full min-h-screen'>

          <LoginContext.Provider value={onLoginClickHandler}>

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

              <Route path='/reviews' element={<Reviews />} />
              <Route path='/reviews/:id' element={<GameReviews />} />
              <Route path='/review/:id' element={<Review />} />
              <Route path='/review/new/:id' element={<ReviewEditor key="new" type="new" />} />
              <Route path='/review/edit/:id' element={<ReviewEditor key="edit" type="edit" />} />

              <Route path='*' element={<Navigate to='/' />} />
            </Routes>

          </LoginContext.Provider>

        </div >

      </UserContext.Provider>
    </>

  )
}

export default App