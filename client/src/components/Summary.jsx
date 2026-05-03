import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';
import ReviewCard from './ReviewCard';
import axios from 'axios';
import ActivityCard from './ActivityCard';
import { Transition } from '@headlessui/react'

const Summary = (props) => {

    const [gameCount, setGameCount] = useState();
    const [topGenres, setTopGenres] = useState();
    const [favoriteGames, setFavoriteGames] = useState();
    const [reviews, setReviews] = useState();
    const [activities, setActivities] = useState([]);

    const controllerRef = useRef();

    const genreBG = ['bg-yellow-400', 'bg-violet-400', 'bg-blue-400', 'bg-green-400', 'bg-gray-400'];

    const onLikeClickHandler = (actID, liked, prefID) => {
        if (!props.isLoggedIn()) return

        const setPreference = async (signal) => {

            await axios.post('http://localhost:3000/preferences/setActivityPreference', { actID: actID, prefID: prefID, email: props.sessionUser.email, liked: liked }, { signal })
                .then((response) => {

                    setActivities(prev => prev.map(item => {
                        return item.id == actID ? { ...item, prefID: response.data.id, liked: response.data.liked ? 'true' : null, likes: response.data.likes } : item
                    }))

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

        setPreference(signal);

        return () => controllerRef.current.abort();

    }

    useEffect(() => {
        if (!props.user) return

        const getGameCount = async (signal) => {

            await axios.post('http://localhost:3000/lists/getGameCount', { email: props.user.email }, { signal })
                .then((response) => {
                    setGameCount(response.data);
                })
                .catch((error) => {
                    if (error.code != "ERR_CANCELED") {
                        console.log(error);
                    }
                });
        }

        const getGameGenres = async (signal) => {

            await axios.post('http://localhost:3000/lists/getGameGenres', { email: props.user.email }, { signal })
                .then((response) => {
                    setTopGenres(response.data);
                })
                .catch((error) => {
                    if (error.code != "ERR_CANCELED") {
                        console.log(error);
                    }
                });
        }

        const getFavoriteGames = async (signal) => {

            await axios.post('http://localhost:3000/preferences/getFavoriteGames', { email: props.user.email }, { signal })
                .then((response) => {
                    setFavoriteGames(response.data);
                })
                .catch((error) => {
                    if (error.code != "ERR_CANCELED") {
                        console.log(error);
                    }
                });
        }

        const getUserReviews = async (signal) => {

            await axios.post('http://localhost:3000/reviews/getUserReviews', { email: props.user.email }, { signal })
                .then((response) => {
                    setReviews(response.data);
                })
                .catch((error) => {
                    if (error.code != "ERR_CANCELED") {
                        console.log(error);
                    }
                });
        }

        const getUserActivities = async (signal) => {

            await axios.post('http://localhost:3000/activities/getUserActivities', { email: props.user.email, userEmail: props.sessionUser.email }, { signal })
                .then((response) => {

                    setActivities(response.data);

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

        getGameCount(signal);
        getGameGenres(signal);
        getFavoriteGames(signal);
        getUserReviews(signal);
        getUserActivities(signal);

        return () => controllerRef.current.abort();

    }, [props.user]);

    return (
        <div className='pt-3 sm:pt-4 '>

            <div className='h-10 flex sm:hidden w-full mb-6 relative'>
                {props.followData && props.followData.id ?
                    <div className='flex w-full'>
                        {!props.isShown &&
                            <button type='button' className="z-10 w-full h-10 bg-blue-500 hover:bg-blue-700 focus:outline-none py-1 px-5 font-medium rounded-lg text-white items-center flex space-x-2 justify-center" onClick={props.onDownClickHandler}>
                                <div>Following</div>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 absolute right-3">
                                    <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
                                </svg>
                            </button>
                        }
                        {props.isShown &&
                            <button type='button' className="z-10 w-full h-10 bg-blue-500 hover:bg-blue-700 focus:outline-none py-1 px-5 font-medium rounded-lg text-white items-center flex space-x-2 justify-center" onClick={props.onUpClickHandler}>
                                <div>Following</div>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 absolute right-3 scale-y-[-1]">
                                    <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
                                </svg>
                            </button>
                        }

                        <Transition show={props.isShown}
                            enter='transition-all origin-top duration-250 '
                            enterFrom='scale-y-0'
                            enterTo="scale-y-full"
                            leave="transition-all origin-top duration-250 "
                            leaveFrom="scale-y-full "
                            leaveTo="scale-y-0"
                        >

                            <div className='z-30 top-10 absolute w-full bg-slate-800 rounded-b-lg pt-1 shadow-xl divide-y divide-gray-400' ref={props.menuRef}>

                                <ul className='text-gray-300 text-center divide-y divide-gray-700 select-none w-full h-auto p-1' onClick={props.onUnFollowClickHandler}>
                                    <li id='plan' className={`hover:bg-gray-800 p-1`}>Unfollow</li>

                                </ul>

                            </div>

                        </Transition>
                    </div>
                    :
                    <button type='button' className="z-10 w-full h-10 bg-blue-500 hover:bg-blue-700 focus:outline-none py-1 px-5 font-medium rounded-lg text-white items-center flex justify-center" onClick={props.onFollowClickHandler}>
                        <div>Follow</div>
                    </button>

                }
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-5 w-full text-nowrap'>

                <div className='flex w-full h-20 bg-gray-900 rounded-xl divide-x divide-gray-500 sm:col-span-2'>
                    <div className='h-full w-full flex flex-col'>
                        <div className='text-slate-800 px-3 py-2 sm:py-1 text-xs sm:text-sm bg-blue-400 font-medium w-full rounded-tl-xl'>Total Games</div>
                        <div className=' text-slate-200 h-full flex items-center justify-center text-xl xl:text-2xl font-bold'>{gameCount ? gameCount.total.toLocaleString() : '0'}</div>
                    </div>
                    <div className='h-full w-full flex flex-col'>
                        <div className='text-slate-800 px-3 py-2 sm:py-1 text-xs sm:text-sm bg-blue-400 font-medium w-full'>Plan to play</div>
                        <div className=' text-slate-200 h-full flex items-center justify-center text-xl xl:text-2xl font-bold'>{gameCount ? gameCount.plan.toLocaleString() : '0'}</div>
                    </div>
                    <div className='h-full w-full flex flex-col'>
                        <div className='text-slate-800 px-3 py-2 sm:py-1 text-xs sm:text-sm bg-blue-400 font-medium w-full'>Playing</div>
                        <div className=' text-slate-200 h-full flex items-center justify-center text-xl xl:text-2xl font-bold'>{gameCount ? gameCount.playing.toLocaleString() : '0'}</div>
                    </div>
                    <div className='h-full w-full flex flex-col'>
                        <div className='text-slate-800 px-3 py-2 sm:py-1 text-xs sm:text-sm bg-blue-400 font-medium w-full rounded-tr-xl'>Played</div>
                        <div className='text-slate-200 h-full flex items-center justify-center text-xl xl:text-2xl font-bold'>{gameCount ? gameCount.played.toLocaleString() : '0'}</div>
                    </div>

                </div>

                <div className='flex w-full h-20 bg-gray-900 rounded-xl divide-x divide-gray-500 order-first sm:order-last'>
                    <div className='h-full w-full flex flex-col'>
                        <div className='text-slate-800 px-3 py-2 sm:py-1 text-xs sm:text-sm bg-blue-400 font-medium w-full rounded-tl-xl'>Following</div>
                        <div className=' text-slate-200 h-full flex items-center justify-center text-xl xl:text-2xl font-bold'>{props.followData ? props.followData.following.toLocaleString() : '0'}</div>
                    </div>
                    <div className='h-full w-full flex flex-col'>
                        <div className='text-slate-800 px-3 py-2 sm:py-1 text-xs sm:text-sm bg-blue-400 font-medium w-full rounded-tr-xl'>Followers</div>
                        <div className=' text-slate-200 h-full flex items-center justify-center text-xl xl:text-2xl font-bold'>{props.followData ? props.followData.followers.toLocaleString() : '0'}</div>
                    </div>
                </div>

            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-4">

                <div className=''>
                    <h1 className='text-lg drop-shadow-lg text-slate-200 cursor-default mb-1'>Top Genres</h1>
                    <div className='w-20 h-[0.1rem] bg-blue-400 rounded-xl mb-4'></div>
                    <div className={`${topGenres && 'sm:h-24 pt-4 sm:pt-2'} w-full flex flex-col bg-gray-900 rounded-xl`}>
                        <div className='sm:flex w-full h-full items-center justify-around sm:space-x-2 px-4 text-gray-700 font-bold text-sm sm:overflow-x-auto '>
                            {topGenres ? topGenres.map((item, i) => {
                                return (
                                    <div key={item.name} className='flex flex-col sm:space-y-1'>
                                        <div className={`h-8 px-3 ${genreBG[i]} rounded-lg content-center text-nowrap text-center`}>{item.name}</div>
                                        <div className='flex justify-center text-slate-300 font-normal text-xs py-2 sm:py-0'>{item.count.toLocaleString()} Entries</div>
                                    </div>
                                )

                            })
                                :
                                <div className='w-full flex justify-center text-slate-400 bg-gray-900 p-4 rounded-xl font-normal text-base items-center'>No Data</div>
                            }

                        </div>
                    </div>
                </div>
                <div className='row-span-3'>
                    <div className='mb-4'>
                        <div className='flex justify-between pe-2'>
                            <div>
                                <h1 className='text-lg drop-shadow-lg text-slate-200 cursor-default mt-2'>Recent Favorites</h1>
                                <div className='w-20 h-[0.1rem] bg-blue-400 rounded-xl mb-1'></div>
                            </div>
                            <button type='button' value="favorites" className='text-sm sm:text-base font-bold drop-shadow-lg text-blue-400 hover:text-blue-500 pt-2' onClick={props.changeSelected}>View All</button>
                        </div>

                        {favoriteGames && favoriteGames.length ?
                            <div className='grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 mt-2 bg-gray-900 p-4 rounded-xl'>
                                {favoriteGames.map((item, i) => {
                                    return (
                                        <Card key={item.id} id={item.id} name={item.name} title={props.title} slug={item.slug} rank={i + 1} img={item.cover ? item.cover.urlBig : null} isLoading={props.isLoading} />
                                    )
                                })}
                            </div>
                            :
                            <div className='w-full flex justify-center text-slate-400 bg-gray-900 p-4 mt-4 rounded-xl'>No Favorites</div>
                        }

                    </div>

                    <div className=''>
                        <div className='flex justify-between pe-2'>
                            <div>
                                <h1 className='text-lg drop-shadow-lg text-slate-200 cursor-default'>Reviews</h1>
                                <div className='w-20 h-[0.1rem] bg-blue-400 rounded-xl'></div>
                            </div>
                            <button type='button' value="reviews" className='text-sm sm:text-base font-bold drop-shadow-lg text-blue-400 hover:text-blue-500' onClick={props.changeSelected}>View All</button>
                        </div>

                        {reviews && reviews.length ?
                            <div className='grid grid-cols-2 gap-3 sm:gap-6  mt-4 bg-gray-900 p-4 rounded-xl'>
                                {reviews.map((item, i) => {

                                    return (
                                        < ReviewCard key={item.id} review={item} isLoading={false} type="all" isProfile={true} />
                                    )

                                })}

                            </div>
                            :
                            <div className='w-full flex justify-center text-slate-400 bg-gray-900 p-4 mt-4 rounded-xl'>No Reviews</div>
                        }

                    </div>
                </div>
                <div>

                    <div className='xl:order-last'>
                        <h1 className='text-lg drop-shadow-lg text-slate-200 cursor-default mb-1'>List Activities</h1>
                        <div className='w-20 h-[0.1rem] bg-blue-400 rounded-xl mb-4'></div>
                        {activities && activities.length ?
                            <div className={`flex flex-col space-y-3 mt-4 bg-gray-900 p-4 rounded-xl`}>
                                {activities.map((item, i) => {
                                    return (
                                        < ActivityCard key={item.id} activity={item} user={props.user} type="user" onLikeClickHandler={onLikeClickHandler} />
                                    )
                                })}
                                {activities.length == 10 && <button value="activities" type='button' className="w-full bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 mt-4 py-1 px-3 font-medium rounded-md text-slate-200 text-center" onClick={props.changeSelected}>View All</button>}

                            </div>
                            :
                            <div className='w-full flex justify-center text-slate-400 bg-gray-900 p-4 mt-4 rounded-xl'>No Activity</div>
                        }
                    </div>
                </div>
            </div>




        </div>
    )
}

export default Summary