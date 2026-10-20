import React, { useRef, useEffect, useState, useContext } from 'react'
import { useParams } from "react-router-dom";
import { useUserContext } from '../hooks/UserContext.jsx'
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
import { ListButton } from '../components/ListButton.jsx'

const Game = () => {

    const [game, setGame] = useState();
    const [gameScore, setGameScore] = useState("");
    const [isListShown, setIsListShown] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(false);
    const [reviewData, setReviewData] = useState("");
    const [listMenuData, setListMenuData] = useState({
        slug: "",
        list: "",
        fave: "",
        review: ""
    });
    const [triggerAction, setTriggerAction] = useState(0);

    const controllerRef = useRef();

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

    const onReviewClickHandler = () => {
        if (!isLoggedIn()) return

        listMenuData.review ? navigate("/review/edit/" + listMenuData.review.id, { state: { id: listMenuData.review.id, type: "edit" } }) : navigate("/review/new/" + slug, { state: { id: game.id, type: "new" } });

    }

    const showListMenu = (slugData, listData, favoriteData, reviewData) => {
        setListMenuData({
            slug: slugData,
            list: listData,
            fave: favoriteData,
            review: reviewData
        })

        setIsListShown(true);
    }


    const onListCloseHandler = () => {
        setIsListShown(false);
    }

    const updateDataTrigger = () => {
        setTriggerAction(prev => prev + 1);
    }

    useEffect(() => {
        if (isListShown) {
            document.body.style.overflow = 'hidden'
        }
        !isListShown ? document.body.style.overflow = 'unset' : null;
    }, [isListShown]);

    useEffect(() => {
        if (!game) return

        const getGameScore = async (signal) => {

            await axios.post('http://localhost:3000/lists/getGameScore', { id: game.id }, { signal })
                .then((response) => {
                    setGameScore(response.data);
                    setIsPageLoading(false);
                })
                .catch((error) => {
                    if (error.code != "ERR_CANCELED") {
                        console.log(error);
                    }
                });

        }


        const getReviewData = async (signal) => {

            setIsPageLoading(false);

            await axios.post('http://localhost:3000/reviews/getReviewData', { email: user.email, id: game.id }, { signal })
                .then((response) => {
                    setReviewData(response.data);
                    setIsPageLoading(false);
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

        getGameScore(signal);

        if (user.loggedIn) {
            getReviewData(signal)
        }

        return () => controllerRef.current.abort();

    }, [game])

    useEffect(() => {

        setIsPageLoading(true);
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

    if (!isPageLoading) {

        return (

            <div className='h-full w-full relative'>
                {/* Background Image */}
                {game &&
                    <div className='flex absolute w-full xl:ps-[17rem]'>
                        <div className='flex h-auto max-h-[600px] min-h-80 w-full mx-auto bg-gray-900'>
                            {game.artwork ? <img src={game.artwork} alt={game.name} className="h-auto min-h-80 w-full" /> : game.screenshot && <img src={game.screenshot} alt={game.name} className="h-auto min-h-80 w-full" />}
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
                                    <div className="flex justify-center align-middle h-64 w-60 bg-gray-600 rounded-xl sm:border sm:border-gray-800 shadow-xl -mt-2">
                                        {(game.cover ? <img className="object-fill h-full w-full rounded-xl " src={game.cover.urlBig} alt={game.name} />
                                            : <div className='content-center text-white'>No Cover</div>)}


                                    </div>

                                    <div className='w-full pt-2'>
                                        <ListButton
                                            game={game}
                                            user={user}
                                            showLoginMenu={showLoginMenu}
                                            showListMenu={showListMenu}
                                            flow={'down'}
                                            triggerUpdate={triggerAction}
                                        />
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
                                        <GameInfo game={game} score={gameScore} />
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

                                        {<ReviewStack id={game.id} slug={game.slug} reviewData={reviewData} user={user} onReviewClickHandler={onReviewClickHandler} />}

                                        {game.similar_games && <SimilarGames games={game.similar_games} />}

                                    </div>

                                </div>

                            </div>

                        </div>
                    }
                </div>

                {isListShown &&
                    <ListMenu isShown={isListShown} slug={listMenuData.slug} listData={listMenuData.list} favoriteData={listMenuData.fave} onListCloseHandler={onListCloseHandler} updateData={updateDataTrigger} />
                }

            </div>
        )
    } else {

        return (
            <div className='h-full w-full relative'>
                {/* Background Image */}

                <div className='flex absolute w-full xl:ps-[17rem]'>
                    <div className='flex h-auto max-h-[600px] min-h-80 w-full mx-auto bg-gray-900'>

                    </div>
                    <div className='absolute bg-gray-700 h-full w-full top-60 sm:top-80 left-0'>
                        <div className='bg-gray-800 h-60 sm:h-40'></div>
                        <div></div>
                    </div>
                </div>


                <div className='flex justify-center h-full w-full pb-20 pt-5 sm:pt-20 xl:ps-[17rem] overflow-x-hidden'>
                    {game &&
                        <div className='px-3 w-full sm:w-auto sm:max-w-3xl xl:max-w-none xl:w-full xl:ps-20 xl:px-20 xl:py-2 z-20'>

                            {/* Cover, Title, and Summary */}
                            <div className='flex justify-center w-full pt-16'>

                                <div className='flex flex-col items-center sm:me-5 h-[24rem] sm:h-[20rem]'>
                                    <div className="flex justify-center align-middle h-64 w-60 bg-gray-700 rounded-xl sm:border sm:border-gray-800 shadow-xl -mt-2">
                                        <div className='content-center text-white h-64 '></div>
                                    </div>

                                    <div className='w-60 sm:w-full sm:h-full flex justify-center items-center space-x-2 pt-2 sm:pt-0 animate-pulse'>
                                        <div className="h-8 bg-slate-700 rounded basis-3/4"></div>
                                        <div className="h-8 bg-slate-700 rounded basis-1/4"></div>
                                    </div>

                                    <div className='text-center text-blue-400 font-medium text-xl my-2 mx-10 hover:overflow-y-auto h-14 sm:hidden'>
                                        <div className='flex space-x-3 w-60 mt-2 animate-pulse'>
                                            <div className="h-3 bg-slate-700 rounded basis-2/5"></div>
                                            <div className="h-3 bg-slate-700 rounded basis-3/5"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className='mt-44 hidden sm:block w-full animate-pulse'>
                                    <div className='flex space-x-3 w-60 mt-4'>
                                        <div className="h-3 bg-slate-700 rounded basis-3/4"></div>
                                        <div className="h-3 bg-slate-700 rounded basis-1/4"></div>
                                    </div>
                                    <div className='overflow-hidden hover:overflow-y-auto h-24'>
                                        <div className='flex space-x-3 w-full mt-4'>
                                            <div className="h-2 bg-slate-700 rounded basis-3/6"></div>
                                            <div className="h-2 bg-slate-700 rounded basis-1/6"></div>
                                            <div className="h-2 bg-slate-700 rounded basis-2/6"></div>
                                        </div>
                                        <div className='flex space-x-3 w-96 mt-2'>
                                            <div className="h-2 bg-slate-700 rounded basis-1/4"></div>
                                            <div className="h-2 bg-slate-700 rounded basis-1/4"></div>
                                            <div className="h-2 bg-slate-700 rounded basis-2/4"></div>
                                        </div>
                                    </div>

                                </div>

                            </div>


                            {/* Body */}
                            <div className='mt-6'>

                                <div className='flex flex-col w-full sm:justify-between sm:flex-row'>

                                    <div className='hidden sm:block'>
                                        <GameInfo game={game} score={gameScore} isLoading={isPageLoading} />
                                    </div>

                                    <div className='w-full'>

                                        {game.videos && <VideoPlaylist videos={game.videos} isLoading={isPageLoading} />}

                                        <div className='text-slate-400 mb-4 sm:hidden animate-pulse'>
                                            <div className='flex space-x-3 w-full mt-2'>
                                                <div className="h-2 bg-slate-600 rounded basis-3/6"></div>
                                                <div className="h-2 bg-slate-600 rounded basis-1/6"></div>
                                                <div className="h-2 bg-slate-600 rounded basis-2/6"></div>
                                            </div>
                                            <div className='flex space-x-3 w-96 mt-2'>
                                                <div className="h-2 bg-slate-600 rounded basis-1/4"></div>
                                                <div className="h-2 bg-slate-600 rounded basis-1/4"></div>
                                                <div className="h-2 bg-slate-600 rounded basis-2/4"></div>
                                            </div>
                                        </div>

                                        <div className='sm:hidden'>
                                            <GameInfo game={game} isLoading={isPageLoading} />
                                        </div>



                                    </div>

                                </div>

                            </div>

                        </div>
                    }
                </div>








            </div>
        )

    }
}

export default Game