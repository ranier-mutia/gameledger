import React, { useEffect, useState } from 'react'
import { Route, Routes, useLocation, Navigate } from 'react-router-dom'
import { UserContext } from './hooks/UserContext.jsx'
import LoginContext from './hooks/LoginContext.jsx'
import axios from "axios"
import Login from './pages/layouts/Login.jsx'
import Header from "./pages/layouts/Header.jsx"
import Sidebar from "./pages/layouts/Sidebar.jsx"
import Home from "./pages/Home.jsx"
import User from './pages/User.jsx'
import Users from './pages/Users.jsx'
import Settings from './pages/Settings.jsx'
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
          setUser({ id: authUser.id, username: authUser.username, email: authUser.email, profile_picture: authUser.profile_picture, loggedIn: true });
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

  const searchWithoutOffset = (() => {
    const params = new URLSearchParams(location.search);
    params.delete('offset');
    return params.toString();
  })();

  // 2. Combine path + non-offset filters into a single key
  const filterRouteKey = `${location.pathname}?${searchWithoutOffset}`;

  useEffect(() => {
    // Only runs when path OR actual filters change (ignores offset updates!)
    window.scrollTo(0, 0);
  }, [filterRouteKey]);

  useEffect(() => {
    authenticateUser();
  }, []);

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

              <Route path='/settings' element={<Settings />} />

              <Route path='/users' element={<Users />} />
              <Route path='/user/:username' element={<User />} />

              <Route path='/games' element={<Games />} />
              <Route path='/game/:slug' element={<Game />} />

              <Route path='/events' element={<Events />} />
              <Route path='/event/:slug' element={<Event />} />

              <Route path='/reviews' element={<Reviews />} />
              <Route path='/reviews/:slug' element={<GameReviews />} />
              <Route path='/review/:id' element={<Review />} />
              <Route path='/review/new/:slug' element={<ReviewEditor key="new" />} />
              <Route path='/review/edit/:id' element={<ReviewEditor key="edit" />} />

              <Route path='*' element={<Navigate to='/' />} />
            </Routes>

          </LoginContext.Provider>

        </div >

      </UserContext.Provider>
    </>

  )
}

export default App