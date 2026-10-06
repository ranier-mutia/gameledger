import React, { useEffect, useState, useRef, useContext } from 'react'
import axios from 'axios'
import { useSearchParams } from "react-router-dom";
import { useUserContext } from '../hooks/UserContext';
import LoginContext from '../hooks/LoginContext.jsx'
import UserCard from "../components/UserCard"

const serverURL = import.meta.env.VITE_REACT_APP_SERVER_BASEURL;

const Users = (props) => {

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [hasResults, setHasResults] = useState(true);

  const controllerRef = useRef();

  const sessionUser = useUserContext();
  const showLoginMenu = useContext(LoginContext);

  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('search') || "";

  const isLoggedIn = () => {
    if (sessionUser.loggedIn) {
      return true
    } else {
      showLoginMenu();
      return false
    }
  }

  const getUsers = async (signal, state, currentOffset = offset) => {
    if (!hasNext && state !== "initial") return;

    setIsLoading(true);

    // Determine request offset reliably
    const requestOffset = state === "initial" ? 0 : currentOffset;

    try {
      const response = await axios.post(
        "http://localhost:3000/users/searchAllUsers",
        { offset: requestOffset, query, userID: sessionUser.id },
        { signal }
      );

      const result = response.data.slice(0, 24);

      if (requestOffset === 0 && response.data.length === 0) {
        setHasResults(false);
        setUsers([]);
      } else if (state === "initial") {
        setUsers(result);
        setOffset(24); // Prepare offset for next page
        setHasResults(true);
      } else {
        setUsers((prevUsers) => [...prevUsers, ...result]);
        setOffset((prevOffset) => prevOffset + 24);
      }

      if (response.data.length < 24) {
        setHasNext(false);
      }
    } catch (error) {
      if (error.name !== "CanceledError" && error.code !== "ERR_CANCELED") {
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadingCard = (count) => {

    return Array.from({ length: count }, (_, i) => {
      return <UserCard key={i} isLoading={true} />;
    })

  }

  const onFollowClickHandler = async (e, userID, followID) => {

    e.stopPropagation();
    if (!isLoggedIn()) return

    if (followID) {
      await axios.post('http://localhost:3000/follows/unfollowUser', { id: userID, followID: followID })
        .then((response) => {
          setUsers((prev) => 
            prev.map((user) => 
              user.id == userID ? {...user, followID: null} : user
            )
          )
        })
        .catch((error) => {
          if (error.code != "ERR_CANCELED") {
            console.log(error);
          }
        });

    } else {
      await axios.post('http://localhost:3000/follows/followUser', { id: userID, userID: sessionUser.id })
        .then((response) => {
          const followData = response.data;
          setUsers((prev) => 
            prev.map((user) => 
              user.id == followData.following_id ? {...user, followID: followData.id} : user
            )
          )
        })
        .catch((error) => {
          if (error.code != "ERR_CANCELED") {
            console.log(error);
          }
        });

    }
  }


  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;

    // 1. Reset pagination guard so new search isn't blocked
    setHasNext(true);

    // 2. Pass 0 explicitly as the initial offset argument
    getUsers(signal, "initial", 0);

    return () => controllerRef.current?.abort();
  }, [query, sessionUser]); // Runs whenever the search query changes


  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

      // 1. Check if bottom is reached AND we aren't currently fetching AND more items exist
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        if (isLoading || !hasNext) return; // Prevent double-fetching / abort loops!

        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        // 2. Pass offset directly to avoid stale closure issues
        getUsers(signal, "loadMore", offset);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading, hasNext, offset]);


  return (
    <div className='flex justify-center h-full w-full pt-20 pb-20 xl:ps-[18rem] overflow-x-hidden'>
      <div className='px-3 w-full sm:w-auto sm:max-w-3xl xl:max-w-none xl:w-full xl:ps-8 xl:px-8 xl:py-2'>

        <div>
          <h1 className='text-white text-xl font-medium'><span>Search results for <span className="text-blue-400"> "{query}"</span></span></h1>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 mt-10'>

            {users?.map((item) => (
              <UserCard
                key={item.id}
                id={item.id}
                username={item.username}
                topGenres={(item.top_genres || []).slice(0, 2)}
                img={`${serverURL}uploads/profile_pictures/${item.profile_picture}`}
                followID={item.followID}
                isLoading={false}
                onFollowClickHandler={onFollowClickHandler}
              />
            ))}

            {isLoading && (users.length === 0 ? loadingCard(24) : loadingCard(6))}


          </div>

          {!hasResults && !isLoading &&
            <div className='flex-col w-full text-white text-center mt-40 justify-items-center px-5'>
              <div className="p-3 mb-3 rounded-full bg-slate-800/60 border border-slate-700/50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-12 h-12 text-slate-300"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg></div>

              <h3 className="text-2xl font-semibold text-slate-200">No users found {query && <span>for<span className="text-blue-400"> "{query}"</span></span>}</h3>
              {query && <p className="mt-1 text-base text-slate-400">Check your spelling, or try searching with different filters.</p>}
            </div>
          }

        </div>

      </div>
    </div >

  )
}

export default Users

