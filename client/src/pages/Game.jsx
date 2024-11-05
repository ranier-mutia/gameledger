import React, { useRef, useEffect, useState, useContext } from 'react'
import { useParams } from "react-router-dom";
import { useUserContext } from '../hooks/UserContext.jsx'
import { Transition } from '@headlessui/react'
import LoginContext from '../hooks/LoginContext.jsx'
import axios from 'axios'
import VideoPlaylist from '../components/VideoPlaylist';
import StoryLine from '../components/StoryLine';
import GameInfo from '../components/GameInfo';
import Gallery from '../components/Gallery';
import Status from '../components/Status.jsx';
import SimilarGames from '../components/SimilarGames';
import ListMenu from '../components/ListMenu.jsx'
import { useNavigate } from 'react-router-dom'
import ReviewStack from '../components/ReviewStack.jsx';

const Game = () => {

    const [game, setGame] = useState();
    const [favoriteData, setFavoriteData] = useState("");
    const [listData, setListData] = useState("");
    const [reviewData, setReviewData] = useState("");
    const [isShown, setIsShown] = useState(false);
    const [isListShown, setIsListShown] = useState(false);
    const [isLoading, setIsLoading] = useState({
        setFavorite: false,
        getList: false,
        getReview: false
    });

    const controllerRef = useRef();
    const menuRef = useRef();

    const user = useUserContext();
    const showLoginMenu = useContext(LoginContext);

    const navigate = useNavigate();

    const params = useParams();
    const slug = params.slug;

    const isLoggedIn = () => {
        if (user.loggedIn) {
            return true
        } else {
            showLoginMenu();
            return false
        }
    }

    function outsideClickHandler(e) {
        if (isShown && !menuRef.current?.contains(e.target)) {
            setIsShown(!isShown);
        }
    }

    const onDownClickHandler = () => {
        setIsShown(true);
    }

    const onUpClickHandler = () => {
        setIsShown(false);
    }

    const onStatusSelectHandler = async (e) => {
        if (!isLoggedIn()) return

        const id = listData.id ? listData.id : "";
        const status = e.target.id;

        setIsShown(false);

        await axios.post('http://localhost:3000/lists/setStatus', { id: id, gameID: game.id, email: user.email, status: status })
            .then((response) => {
                setListData(response.data);
            })
            .catch((error) => {
                if (error.code != "ERR_CANCELED") {
                    console.log(error);
                }
            });
    }

    const onReviewClickHandler = () => {
        if (!isLoggedIn()) return

        reviewData ? navigate("/review/edit/" + reviewData.id) : navigate("/review/new/" + game.id);

    }

    const onHeartClickHandler = async () => {
        if (!isLoggedIn()) return

        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        const id = favoriteData.id ? favoriteData.id : "";

        setIsLoading((prev) => ({ ...prev, setFavorite: true }));

        await axios.post('http://localhost:3000/preferences/setFavorite', { id: id, email: user.email, gameID: game.id }, { signal })
            .then((response) => {
                setFavoriteData(response.data);
                setIsLoading((prev) => ({ ...prev, setFavorite: false }));
            })
            .catch((error) => {
                if (error.code != "ERR_CANCELED") {
                    console.log(error);
                }
            });

    }

    const onListClickHandler = () => {
        if (!isLoggedIn()) return

        setIsListShown(true);
    }

    const onListCloseHandler = () => {
        setIsListShown(false);
    }

    const updateDataHandler = () => {

        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        getFavoriteData(signal);
        getListData(signal);
    }

    const getFavoriteData = async (signal) => {

        setIsLoading((prev) => ({ ...prev, getFavorite: true }));

        await axios.post('http://localhost:3000/preferences/getFavoriteData', { email: user.email, id: game.id }, { signal })
            .then((response) => {
                setFavoriteData(response.data);
                setIsLoading((prev) => ({ ...prev, getFavorite: false }));
            })
            .catch((error) => {
                if (error.code != "ERR_CANCELED") {
                    console.log(error);
                }
            });
    }

    const getListData = async (signal) => {

        setIsLoading((prev) => ({ ...prev, getList: true }));

        await axios.post('http://localhost:3000/lists/getListData', { email: user.email, id: game.id }, { signal })
            .then((response) => {
                setListData(response.data);
                setIsLoading((prev) => ({ ...prev, getList: false }));
            })
            .catch((error) => {
                if (error.code != "ERR_CANCELED") {
                    console.log(error);
                }
            });

    }

    useEffect(() => {
        if (!game) return

        const getReviewData = async (signal) => {

            setIsLoading((prev) => ({ ...prev, getReview: true }));

            await axios.post('http://localhost:3000/reviews/getReviewData', { email: user.email, id: game.id }, { signal })
                .then((response) => {
                    setReviewData(response.data);
                    setIsLoading((prev) => ({ ...prev, getReview: false }));
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

        getFavoriteData(signal);
        getListData(signal);
        getReviewData(signal);

        return () => controllerRef.current.abort();

    }, [game])

    useEffect(() => {

        document.addEventListener('mousedown', outsideClickHandler);
        return () => {
            document.removeEventListener('mousedown', outsideClickHandler);

        };

    }, [isShown]);

    useEffect(() => {

        const getGame = async (signal) => {

            await axios.post('http://localhost:3000/games/getGame', { slug }, { signal })
                .then((response) => {
                    setGame(response.data);

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

        getGame(signal);


        return () => controllerRef.current.abort();

    }, [slug]);



    return (


        <div className='h-full w-full relative'>
            {/* Background Image */}
            {game &&
                <div className='flex absolute w-full xl:ps-[17rem]'>
                    <div className='flex h-auto min-h-80 w-full mx-auto bg-gray-600'>
                        {game.artwork ? <img src={game.artwork} alt={game.name} className="h-auto min-h-80 w-full" /> : game.screenshot ? <img src={game.screenshot} alt={game.name} className="h-auto min-h-80 w-full" /> : <div className='content-center  mx-auto text-white pt-12'>No Cover</div>}
                    </div>
                    <div className='absolute bg-gray-700 h-full w-full top-60 sm:top-80 left-0'>
                        <div className='bg-gray-800 h-60 sm:h-40'></div>
                        <div></div>
                    </div>
                </div>
            }

            <div className='flex justify-center h-full w-full pb-20 pt-5 sm:pt-20 xl:ps-[17rem] overflow-x-hidden'>
                {game &&
                    <div className='px-3 w-full sm:w-auto sm:max-w-3xl xl:max-w-none xl:w-full xl:ps-20 xl:px-20 xl:py-2 z-20'>

                        {/* Cover, Title, and Summary */}
                        <div className='flex justify-center w-full pt-16'>

                            <div className='flex flex-col items-center sm:me-5 h-[24rem] sm:h-[20rem]'>
                                <div className="flex justify-center align-middle h-64 w-60 bg-gray-600 rounded-xl border border-gray-800 shadow-xl -mt-2">
                                    {(game.cover ? <img className="object-fill h-full w-full rounded-xl " src={game.cover.urlBig} alt={game.name} />
                                        : <div className='content-center text-white'>No Cover</div>)}


                                </div>

                                <div className='w-60 sm:w-full sm:h-full flex justify-center items-center space-x-2 pt-2 sm:pt-0'>
                                    <div className="relative inline-flex rounded-lg shadow-sm w-full text-gray-300 select-none" role="group">
                                        <button type='button' className="z-10 w-full h-10 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-800 py-1 px-3 font-medium rounded-s-lg" onClick={onListClickHandler}>
                                            {user.loggedIn && listData ? "Update List" : "Add to List"}
                                        </button>
                                        {!isShown &&
                                            <button type='button' className="z-10 w-10 h-10 bg-blue-500 hover:bg-blue-700 focus:outline-none py-1 px-3 font-medium rounded-e-lg text-white justify-items-center" onClick={onDownClickHandler}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                                                    <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        }
                                        {isShown &&
                                            <button type='button' className="z-10 w-10 h-10 bg-blue-500 hover:bg-blue-700 focus:outline-none py-1 px-3 font-medium rounded-e-lg text-white justify-items-center" onClick={onUpClickHandler}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 scale-y-[-1]">
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

                                            <div className='top-8 absolute w-full bg-gray-900 rounded-b-lg pt-2 shadow-xl divide-y divide-gray-400' ref={menuRef}>

                                                <ul className='text-gray-300 text-center divide-y divide-gray-700 select-none w-full h-auto p-1' onClick={onStatusSelectHandler}>
                                                    <li id='plan' className={`hover:bg-gray-800 p-2  ${listData.status == "plan" && 'text-blue-400'}`}>Plan to play</li>
                                                    <li id='playing' className={`hover:bg-gray-800 p-2 ${listData.status == "playing" && 'text-blue-400'}`}>Playing</li>
                                                    <li id='played' className={`hover:bg-gray-800 p-2  ${listData.status == "played" && 'text-blue-400'}`}>Played</li>

                                                </ul>
                                                <ul className='text-gray-300 text-center select-none w-full h-auto p-1'>
                                                    <li className={`hover:bg-gray-800 p-2 divide-y-2 divide-white ${user.loggedIn && reviewData && 'text-blue-400'}`} onClick={onReviewClickHandler}>{user.loggedIn && reviewData ? "Edit Review" : "Make a Review"}</li>
                                                </ul>

                                            </div>

                                        </Transition>

                                    </div>

                                    <button type='button' className="h-10 bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-700 py-1 px-3 font-medium rounded-lg" onClick={onHeartClickHandler} disabled={isLoading.setFavorite}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill={favoriteData ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className={`w-6 h-6 text-white ${isLoading.setFavorite && 'animate-pulse'}`}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                        </svg>
                                    </button>
                                </div>

                                <div className='text-center text-blue-400 font-medium text-xl my-2 mx-10 hover:overflow-y-auto h-14 sm:hidden'>{game.name}</div>
                            </div>

                            <div className='text-slate-400 mt-44 hidden sm:block w-full'>
                                <div className='font-medium text-blue-400 text-xl my-1'>{game.name}</div>
                                <div className='overflow-hidden hover:overflow-y-auto h-24'>
                                    <p >{game.summary}</p>
                                </div>
                            </div>

                        </div>


                        {/* Body */}
                        <div className='mt-6'>

                            <div className='flex flex-col w-full sm:justify-between sm:flex-row'>

                                <div className='hidden sm:block'>
                                    <GameInfo game={game} />
                                </div>

                                <div className='w-full'>

                                    {game.videos && <VideoPlaylist videos={game.videos} />}

                                    {game.summary && <div className='text-slate-400 mb-4 sm:hidden'>{game.summary}</div>}

                                    {game.storyline && <StoryLine storyline={game.storyline} />}

                                    <div className='sm:hidden'>
                                        <GameInfo game={game} />
                                    </div>

                                    {game.artworks || game.screenshots ? <Gallery artworks={game.artworks} screenshots={game.screenshots} /> : null}

                                    <Status id={game.id} />

                                    {<ReviewStack id={game.id} reviewData={reviewData} user={user} onReviewClickHandler={onReviewClickHandler} />}

                                    {game.similar_games && <SimilarGames games={game.similar_games} />}

                                </div>

                            </div>

                        </div>

                    </div>
                }
            </div>

            {isListShown &&
                <ListMenu isShown={isListShown} slug={game.slug} listData={listData} favoriteData={favoriteData} onListCloseHandler={onListCloseHandler} updateData={updateDataHandler} />
            }

        </div>
    )
}

export default Game