import React, { useRef, useEffect, useState, useContext } from 'react'
import { useUserContext } from '../hooks/UserContext.jsx'
import LoginContext from '../hooks/LoginContext.jsx'
import { useParams } from "react-router-dom";
import DOMPurify from 'dompurify';
import axios from 'axios'

const Review = () => {

    const [review, setReview] = useState();
    const [isLoading, setIsLoading] = useState(false)

    const controllerRef = useRef();

    const user = useUserContext();
    const showLoginMenu = useContext(LoginContext);

    const params = useParams();
    const id = params.id;

    const isLoggedIn = () => {
        if (user.loggedIn) {
            return true
        } else {
            showLoginMenu();
            return false
        }
    }

    const onLikeClickHandler = (liked) => {
        if (!isLoggedIn()) return

        setIsLoading(true);

        const setPreference = async (signal) => {

            await axios.post('http://localhost:3000/preferences/setReviewPreference', { revID: id, prefID: review.prefID, email: user.email, liked: liked, prevLiked: review.liked != null ? review.liked : null }, { signal })
                .then((response) => {
                    setReview((prev) => ({ ...prev, prefID: response.data.id, liked: response.data.liked, like: response.data.like, dislike: response.data.dislike }))
                    setIsLoading(false);
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

        if (!user) return

        const getReview = async (signal) => {

            await axios.post('http://localhost:3000/reviews/getReview', { id: id, email: user.email }, { signal })
                .then((response) => {
                    setReview(response.data);
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

        getReview(signal);

        return () => controllerRef.current.abort();

    }, [user]);



    return (

        <div className='h-full w-full relative'>
            {/* Background Image */}
            {review &&
                <div className='flex absolute w-full xl:ps-[17rem]'>

                    <div className='flex h-auto min-h-80 w-full mx-auto bg-gray-600'>
                        {review.game_artworks ? <img src={review.game_artworks[0].url} alt={review.game_name} className="h-auto min-h-80 w-full " /> : review.game_screenshots ? <img src={review.game_screenshots[0].url} alt={review.game_name} className="h-auto min-h-80 w-full" /> : <div className='content-center mx-auto text-white pt-12'>No Cover</div>}
                    </div>

                    <div className='absolute bg-gray-700 h-full w-full top-60 sm:top-80 left-0'></div>
                </div>
            }

            <div className='flex justify-center h-full w-full pb-20 pt-44 sm:pt-60 xl:ps-[17rem] overflow-x-hidden'>
                {review &&
                    <div className='px-3 w-full sm:w-auto sm:max-w-2xl xl:max-w-none xl:w-full xl:ps-60 xl:px-60 xl:py-2 z-10'>

                        <div className='bg-gray-800 w-full h-auto rounded-xl pb-20 px-5 sm:px-10'>
                            <div className='w-full flex justify-center items-center text-center text-blue-400 font-bold text-xl sm:text-3xl pt-10'>{review.game_name}</div>

                            <div className=' w-full flex justify-between py-8'>

                                <div className='text-slate-200'>
                                    <div className=''>{new Date(review.date_added).toLocaleString()}</div>
                                    <div className=''>Review by <span className='text-blue-400 font-bold'>{review.username}</span></div>
                                </div>

                                <div className={`h-14 w-20 flex items-center justify-center rounded-xl ${review.score <= 100 && review.score >= 70 ? 'bg-green-600' : review.score < 70 && review.score >= 50 ? 'bg-orange-500' : 'bg-red-500'}`}>
                                    <div className='text-white text-lg font-bold pb-2'>{review.score}</div>
                                    <div className='text-xs text-slate-200 pt-2'> / 100</div>
                                </div>
                            </div>

                            <h4 className='text-blue-400 font-bold '>Summary:</h4>
                            <div className='w-full h-full flex text-slate-300 tracking-wider text-sm sm:text-base mb-4 italic break-words'>{review.summary}</div>

                            <div className='w-full h-full text-slate-300 sm:leading-loose tracking-wider text-sm sm:text-base break-words' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(review.review) }}></div>


                        </div>


                        <div className='relative'>
                            <div className='absolute -translate-y-1/2 left-1/2 -translate-x-1/2 bg-gray-900 h-20 rounded-xl border border-black flex justify-between text-slate-300 p-2'>
                                <button className={`flex space-x-2 text-blue-400 items-center hover:bg-gray-800 rounded-lg p-2 ${isLoading && 'animate-pulse'}`} onClick={() => onLikeClickHandler(true)} disabled={isLoading}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill={review.liked == true ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 pt-1 scale-x-[-1]">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                                    </svg>

                                    <div>{review.like}</div>
                                </button>

                                <button className={`flex space-x-2 text-red-400 items-center hover:bg-gray-800 rounded-lg p-2 ${isLoading && 'animate-pulse'}`} onClick={() => onLikeClickHandler(false)} disabled={isLoading}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill={review.liked == false ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 pt-1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54" />
                                    </svg>

                                    <div>{review.dislike}</div>
                                </button>

                            </div>
                        </div>



                    </div>
                }

            </div>
        </div >
    )
}

export default Review