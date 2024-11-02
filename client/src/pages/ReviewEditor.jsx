import React, { useRef, useEffect, useState } from 'react'
import { useUserContext } from '../hooks/UserContext.jsx'
import { useParams, useNavigate } from "react-router-dom";
import JoditEditor, { Jodit } from 'jodit-react';
import { useForm } from 'react-hook-form'
import axios from 'axios'


const Review = (props) => {

    const [review, setReview] = useState();
    const [game, setGame] = useState();
    const [content, setContent] = useState();
    const [isLoading, setIsLoading] = useState(false)

    const controllerRef = useRef();
    const summaryRef = useRef();
    const editor = useRef();

    const user = useUserContext();

    const params = useParams();
    const id = params.id;

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm();

    const config = {
        readonly: false, // all options from https://xdsoft.net/jodit/docs/,

    }

    const getGame = async (signal) => {

        await axios.post('http://localhost:3000/games/getGameInfo', { id }, { signal })
            .then((response) => {
                if (!response.data.id) return navigate("/");

                setGame(response.data);

            })
            .catch((error) => {
                if (error.code != "ERR_CANCELED") {
                    console.log(error);
                }
            });
    }

    const getReview = async (signal) => {

        await axios.post('http://localhost:3000/reviews/getReview', { id: id, email: user.email }, { signal })
            .then((response) => {
                if (!response.data.id) return navigate("/");
                if (user.email != response.data.email) return navigate("/");

                setReview(response.data);
                setValue("score", response.data.score)
                setValue("summary", response.data.summary)
                setValue("review", response.data.review)
                setContent(Jodit.modules.Helpers.stripTags(response.data.review))
                summaryRef.current.innerText = response.data.summary
            })
            .catch((error) => {
                if (error.code != "ERR_CANCELED") {
                    console.log(error);
                }
            });
    }

    const onSummaryInputHandler = (e) => {
        setValue("summary", e.target.innerText)
    }

    const onReviewInputHandler = (reviewInput) => {
        setValue("review", reviewInput)
        setContent(Jodit.modules.Helpers.stripTags(reviewInput))
    }

    const onDeleteClickHandler = async () => {
        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        setIsLoading(true);

        await axios.post('http://localhost:3000/reviews/deleteReview', { id }, { signal })
            .then((response) => {
                navigate(-1);
                setIsLoading(false);
            })
            .catch((error) => {
                if (error.code != "ERR_CANCELED") {
                    console.log(error);
                }
            });
    }

    const onSubmit = async (data) => {

        if (content.replace(/\s/g, '').length > 1200) {
            return setError("review", {
                message: "Review should be less than 1200 characters"
            })
        } else if (content.replace(/\s/g, '').length < 240) {
            return setError("review", {
                message: "Review should be atleast 240 characters"
            })
        }

        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        const formData = {
            id: review ? review.id : "",
            gameID: game ? id : review.game_id,
            email: user.email,
            score: data.score,
            summary: data.summary,
            review: data.review
        }

        await axios.post('http://localhost:3000/reviews/setReview', { formData }, { signal })
            .then((response) => {

                navigate("/review/" + response.data.id)

            })
            .catch((error) => {
                if (error.code != "ERR_CANCELED") {
                    console.log(error);
                }
            });

    }

    useEffect(() => {
        if (!user.loggedIn) return

        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        props.type == "edit" ? getReview(signal) : getGame(signal);

        return () => {
            controllerRef.current.abort();
        };

    }, [user])

    if (user.loggedIn) {
        return (

            <div className='h-full w-full relative'>
                {/* Background Image */}

                <div className='flex absolute w-full xl:ps-[17rem]'>

                    <div className='flex h-auto min-h-80 w-full mx-auto bg-gray-600'>
                        {game && (game.artwork ? <img src={game.artwork} alt={game.name} className="h-auto min-h-80 w-full " /> : game.screenshot ? <img src={game.screenshot} alt={game.name} className="h-auto min-h-80 w-full" /> : <div className='content-center mx-auto text-white pt-12'>No Cover</div>)}
                        {review && (review.game_artworks ? <img src={review.game_artworks[0].url} alt={review.game_name} className="h-auto min-h-80 w-full " /> : review.game_screenshots ? <img src={review.game_screenshots[0].url} alt={review.game_name} className="h-auto min-h-80 w-full" /> : <div className='content-center mx-auto text-white pt-12'>No Cover</div>)}
                    </div>

                    <div className='absolute bg-gray-700 h-full w-full top-60 sm:top-80 left-0'></div>
                </div>


                <div className='flex justify-center h-full w-full pb-20 pt-44 sm:pt-60 xl:ps-[17rem] overflow-x-hidden'>

                    <div className='px-3 w-full sm:w-auto sm:max-w-2xl xl:max-w-none xl:w-full xl:ps-60 xl:px-60 xl:py-2 z-10'>

                        <div className='bg-gray-800 w-full h-auto rounded-xl pb-10 px-5 sm:px-10'>
                            <div className='w-full flex justify-center items-center text-center text-blue-400 font-bold text-xl sm:text-3xl pt-10'>{review && review.game_name}{game && game.name}</div>

                            <form className='w-full mt-5 space-y-4 text-gray-200' onSubmit={handleSubmit(onSubmit)} noValidate>

                                <div className='space-y-2 flex flex-col'>
                                    <label className='text-slate-300 text-sm'>Score</label>
                                    <input className={`bg-gray-700 w-full sm:w-2/5 rounded-md px-3 py-2 border-gray-600 focus:outline-none ${errors.score ? 'ring-1 focus:ring-red-600 ring-red-400' : 'focus:ring-blue-500 hover:ring-blue-400 hover:outline-none hover:ring-1 focus:ring-1'}`}
                                        type="number"
                                        name="score"
                                        id="score"
                                        placeholder='0-100'
                                        {...register("score", {
                                            validate: {
                                                number: v => {
                                                    if (v != "") {
                                                        if (!/^([0-9]|[1-9][0-9]|100)$/.test(v)) {
                                                            return "Score should be a number between 0-100"
                                                        }
                                                    }
                                                },
                                                required: v => {
                                                    if (v == "") {
                                                        return "Please enter score"
                                                    }
                                                }
                                            }
                                        })}
                                    />
                                    {errors.score && <span className='text-red-400 text-xs'>{errors.score.message}</span>}
                                </div>

                                <div className='space-y-2 flex flex-col'>

                                    <label className='text-slate-300 text-sm'>Summary</label>

                                    <span className={`bg-gray-700 w-full rounded-md px-3 py-2 border-gray-600 focus:outline-none ${errors.summary ? 'ring-1 focus:ring-red-600 ring-red-400' : 'focus:ring-blue-500 hover:ring-blue-400 hover:outline-none hover:ring-1 focus:ring-1'}`} role="textbox" contentEditable="plaintext-only" onBlur={onSummaryInputHandler} spellCheck="false" ref={summaryRef} />

                                    <input name="summary" id="summary" type='hidden'
                                        {...register('summary', {
                                            validate: {
                                                minLength: (v) => {
                                                    if (v.replace(/\s/g, '').length < 40) return "Summary should be atleast 40 characters"
                                                },
                                                maxLength: (v) => {
                                                    if (v.replace(/\s/g, '').length > 120) return "Summary should be less than 120 characters"
                                                }
                                            },
                                            required: "Please enter summary"
                                        }
                                        )}
                                    />
                                    {errors.summary && <span className='text-red-400 text-xs'>{errors.summary.message}</span>}
                                </div>

                                <div className='space-y-2 flex flex-col text-black'>
                                    <label className='text-slate-300 text-sm'>Review</label>
                                    <JoditEditor
                                        ref={editor}
                                        value={review && review.review}
                                        config={config}
                                        tabIndex={1}
                                        onBlur={onReviewInputHandler}
                                    />
                                    <input name="review" id="review" type='hidden'
                                        {...register('review', {
                                            required: "Please enter your review"
                                        }
                                        )}
                                    />
                                    {errors.review && <span className='text-red-400 text-xs'>{errors.review.message}</span>}
                                </div>

                                <div className='flex justify-end space-x-2 pt-2'>
                                    {review &&
                                        <button type="button" className="bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-800 py-1 px-3 font-medium rounded-md text-slate-200 text-nowrap" disabled={isSubmitting || isLoading} onClick={onDeleteClickHandler}>
                                            {isLoading ?
                                                <svg aria-hidden="true" className="w-5 h-5 mx-3 text-gray-200 animate-spin fill-red-400 hover:fill-red-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                </svg>
                                                : 'Delete'
                                            }
                                        </button>
                                    }
                                    <button type='submit' className="bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 py-1 px-3 font-medium rounded-md text-slate-200 text-nowrap" disabled={isSubmitting}>
                                        {isSubmitting ?
                                            <svg aria-hidden="true" className="w-5 h-5 mx-2 text-gray-200 animate-spin fill-blue-500 hover:fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                            </svg>
                                            : 'Save'
                                        }

                                    </button>
                                </div>

                            </form>

                        </div>



                    </div>
                </div>
            </div >
        )

    }





}

export default Review