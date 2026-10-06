import React, { useState, useEffect, useRef, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Summary from '../components/Summary.jsx';
import Activities from '../components/Activities.jsx';
import Reviews from '../components/Reviews.jsx'
import Favorites from '../components/Favorites.jsx';
import Socials from '../components/Socials.jsx';
import Lists from '../components/Lists.jsx';
import axios from 'axios';
import { Transition } from '@headlessui/react'
import { useUserContext } from '../hooks/UserContext';
import LoginContext from '../hooks/LoginContext.jsx'

const User = (props) => {

    const { state } = useLocation();

    let id;
    if (state) {
        ({ id } = state);
    }

    const [user, setUser] = useState();
    const [followData, setFollowData] = useState();
    const [selected, setSelected] = useState(() => { return sessionStorage.getItem('selected') || "summary" });
    const [isShown, setIsShown] = useState(false);

    const controllerRef = useRef();
    const menuRef = useRef();

    const sessionUser = useUserContext();
    const showLoginMenu = useContext(LoginContext);

    const navigate = useNavigate();

    const serverURL = import.meta.env.VITE_REACT_APP_SERVER_BASEURL;



    const isLoggedIn = () => {
        if (sessionUser.loggedIn) {
            return true
        } else {
            showLoginMenu();
            return false
        }
    }

    const onNavClickHandler = (e) => {
        setSelected(e.target.id);
        sessionStorage.setItem('selected', e.target.id);
    }

    const changeSelected = (e) => {
        setSelected(e.target.value);
        sessionStorage.setItem('selected', e.target.value);
        window.scrollTo(0, 0);
    }

    const resetSelected = () => {
        setSelected("summary");
        sessionStorage.setItem('selected', "summary");
        window.scrollTo(0, 0);
    }

    const onDownClickHandler = () => {
        setIsShown(true);
    }

    const onUpClickHandler = () => {
        setIsShown(false);
    }

    const onUnFollowClickHandler = async () => {
        await axios.post('http://localhost:3000/follows/unfollowUser', { id: id, followID: followData.id })
            .then((response) => {
                setFollowData(response.data);
            })
            .catch((error) => {
                if (error.code != "ERR_CANCELED") {
                    console.log(error);
                }
            });
    }

    const onFollowClickHandler = async () => {
        if (!isLoggedIn()) return

        await axios.post('http://localhost:3000/follows/followUser', { id: id, userID: sessionUser.id })
            .then((response) => {
                setFollowData(response.data);
            })
            .catch((error) => {
                if (error.code != "ERR_CANCELED") {
                    console.log(error);
                }
            });


    }

    function outsideClickHandler(e) {
        if (isShown && !menuRef.current?.contains(e.target)) {

            setIsShown(false);

        }
    }


    const renderContent = (selected) => {
        switch (selected) {
            case 'summary':
                return <Summary text={"summary"} user={user} sessionUser={sessionUser} followData={followData} changeSelected={changeSelected} isLoggedIn={isLoggedIn} isShown={isShown} onUpClickHandler={onUpClickHandler} onDownClickHandler={onDownClickHandler} onFollowClickHandler={onFollowClickHandler} onUnFollowClickHandler={onUnFollowClickHandler} menuRef={menuRef} />;
            case 'list':
                return <Lists text={"list"} user={user} isLoggedIn={isLoggedIn} />;
            case 'favorites':
                return <Favorites text={"favorites"} user={user} />;
            case 'reviews':
                return <Reviews text={"reviews"} user={user} />;
            case 'socials':
                return <Socials text={"socials"} user={user} resetSelected={resetSelected} />;
            case 'activities':
                return <Activities text={"activities"} user={user} sessionUser={sessionUser} isLoggedIn={isLoggedIn} />;
            default:
                return null;
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', outsideClickHandler);
        return () => {
            document.removeEventListener('mousedown', outsideClickHandler);
        };
    }, [isShown]);

    useEffect(() => {
        const getFollowData = async (signal) => {

            await axios.post('http://localhost:3000/follows/getFollowData', { id: id, userID: sessionUser.id }, { signal })
                .then((response) => {
                    setFollowData(response.data);
                })
                .catch((error) => {
                    if (error.code != "ERR_CANCELED") {
                        console.log(error);
                    }
                });
        }

        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        getFollowData(signal);

        return () => controllerRef.current.abort();
    }, [user]);

    useEffect(() => {

        const getUser = async (signal) => {

            await axios.post('http://localhost:3000/users/getUser', { id: id }, { signal })
                .then((response) => {
                    if (!response.data.id) return navigate("/")
                    setUser(response.data);
                })
                .catch((error) => {
                    if (error.code != "ERR_CANCELED") {
                        console.log(error);
                    }
                });
        }

        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        getUser(signal);

        return () => {
            controllerRef.current.abort()

        };

    }, [id]);

    return (
        <div className='h-full w-full relative'>
            {/* Background Image */}
            {user &&
                <div className='flex absolute w-full xl:ps-[17rem]'>
                    <div className='relative flex h-auto min-h-80 w-full mx-auto bg-gray-900'>



                        {/* Profile Picture */}
                        <div className='absolute top-36 left-6 sm:top-40 lg:left-20 flex justify-center'>

                            <div className="relative flex justify-center align-middle h-24 w-24 sm:h-40 sm:w-40 bg-gray-600 rounded-full border border-gray-800 shadow-xl">
                                <img className="rounded-full h-full w-full z-20" src={`${serverURL}uploads/profile_pictures/${user.profile_picture}`} alt="profile_picture" draggable="false" onError={(e) => {
                                    e.currentTarget.onerror = null; // Prevents infinite loops if default image is also missing
                                    e.currentTarget.src = '/profile_pictures/default.png';
                                }}
                                />
                                <div className='text-white text-sm sm:text-base z-10 bg-gray-900 absolute py-2 px-3 rounded-xl shadow-xl bottom-2 left-1/2 ps-14 sm:ps-20 border border-black'>{user.username}</div>
                            </div>

                        </div>

                        <div className='hidden sm:absolute sm:right-6 sm:top-64 lg:right-20 sm:flex sm:justify-end'>

                            <div className="relative rounded-lg shadow-sm text-gray-300 select-none mt-4" role="group">

                                {followData && followData.id ?
                                    <div>
                                        {!isShown &&
                                            <button type='button' className="z-10 w-full h-10 bg-blue-500 hover:bg-blue-700 focus:outline-none py-1 px-5 font-medium rounded-lg text-white items-center flex space-x-2" onClick={onDownClickHandler}>
                                                <div>Following</div>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                                                    <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        }
                                        {isShown &&
                                            <button type='button' className="z-10 w-full h-10 bg-blue-500 hover:bg-blue-700 focus:outline-none py-1 px-5 font-medium rounded-lg text-white items-center flex space-x-2" onClick={onUpClickHandler}>
                                                <div>Following</div>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 scale-y-[-1]">
                                                    <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        }

                                        <Transition show={isShown}
                                            enter='transition-all origin-top duration-250 '
                                            enterFrom='scale-y-0'
                                            enterTo="scale-y-full"
                                            leave="transition-all origin-top duration-250 "
                                            leaveFrom="scale-y-full "
                                            leaveTo="scale-y-0"
                                        >

                                            <div className='z-30 top-10 absolute w-full bg-gray-900 rounded-b-lg pt-1 shadow-xl divide-y divide-gray-400' ref={menuRef}>

                                                <ul className='text-gray-300 text-center divide-y divide-gray-700 select-none w-full h-auto p-1' onClick={onUnFollowClickHandler}>
                                                    <li id='plan' className={`hover:bg-gray-800 p-2`}>Unfollow</li>

                                                </ul>

                                            </div>

                                        </Transition>
                                    </div>
                                    :
                                    <button type='button' className="z-10 w-full h-10 bg-blue-500 hover:bg-blue-700 focus:outline-none py-1 px-5 font-medium rounded-lg text-white items-center flex" onClick={onFollowClickHandler}>
                                        <div>Follow</div>
                                    </button>

                                }

                            </div>


                        </div>

                    </div>
                    <div className='absolute bg-gray-700 h-full w-full top-60 sm:top-80 left-0'>
                        <div className='bg-gray-800 h-12 flex text-white z-30 w-full justify-center items-center xl:ps-[17rem]'>
                            <ul className='flex items-center h-full overflow-x-auto select-none' onClick={onNavClickHandler}>
                                <li id="summary" className={`${selected == 'summary' ? 'text-blue-400 hover:text-blue-400' : 'hover:text-blue-300'} px-4 sm:px-8 content-center h-full cursor-pointer`}>Summary</li>
                                <li id="list" className={`${selected == 'list' ? 'text-blue-400 hover:text-blue-400' : 'hover:text-blue-300'} px-4 sm:px-8 content-center h-full cursor-pointer`}>List</li>
                                <li id="favorites" className={`${selected == 'favorites' ? 'text-blue-400 hover:text-blue-400' : 'hover:text-blue-300'} px-4 sm:px-8 content-center h-full cursor-pointer`}>Favorites</li>
                                <li id="reviews" className={`${selected == 'reviews' ? 'text-blue-400 hover:text-blue-400' : 'hover:text-blue-300'} px-4 sm:px-8 content-center h-full cursor-pointer`}>Reviews</li>
                                <li id="activities" className={`${selected == 'activities' ? 'text-blue-400 hover:text-blue-400' : 'hover:text-blue-300'} px-4 sm:px-8 content-center h-full cursor-pointer`}>Activities</li>
                                <li id="socials" className={`${selected == 'socials' ? 'text-blue-400 hover:text-blue-400' : 'hover:text-blue-300'} px-4 sm:px-8 content-center h-full cursor-pointer `}>Socials</li>
                            </ul>
                        </div>
                    </div>
                </div>
            }

            <div className='flex justify-center h-full w-full pb-20 pt-2 sm:pt-20 xl:ps-[17rem] overflow-x-hidden'>

                <div className='px-3 mt-72 w-full sm:max-w-3xl xl:max-w-none xl:w-full xl:ps-20 xl:px-20 xl:py-2 z-20'>
                    {renderContent(selected)}
                </div>

            </div>
        </div>


    )
}

export default User