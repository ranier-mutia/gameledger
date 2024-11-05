import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import ReviewCard from './ReviewCard';
import { useNavigate } from 'react-router-dom'

const ReviewStack = (props) => {

    const [gameReviews, setGameReviews] = useState();

    const controllerRef = useRef();

    const navigate = useNavigate();

    const onViewAllClickHandler = () => {
        navigate("/reviews/" + props.id)
    }

    useEffect(() => {

        const getGameReviews = async (signal) => {

            await axios.post('http://localhost:3000/reviews/getGameReviews', { id: props.id }, { signal })
                .then((response) => {
                    setGameReviews(response.data);
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

        getGameReviews(signal);

        return () => controllerRef.current.abort();

    }, [])

    if (gameReviews) {
        return (
            <div className='mb-6'>

                <div className='flex justify-between'>
                    <div>
                        <h1 className='text-lg drop-shadow-lg text-slate-200 cursor-default mb-1'>Reviews</h1>
                        <div className='w-20 h-[0.1rem] bg-blue-400 rounded-xl mb-4'></div>
                    </div>
                    <button type='button' className=" bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 my-2 px-3 font-medium rounded-md text-slate-200" onClick={() => props.onReviewClickHandler()}>{props.user.loggedIn && props.reviewData ? "Edit Review" : "Make a Review"}</button>
                </div>

                {gameReviews.length ?

                    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-6 xl:gap-4 mt-4'>
                        {gameReviews.map((item, i) => {

                            return (
                                < ReviewCard key={item.id} review={item} isLoading={false} type="specific" />
                            )

                        })}

                    </div>
                    :
                    <div className='w-full flex justify-center text-slate-400'>Game Has No Reviews</div>
                }

                {gameReviews.length == 4 &&
                    <button type='button' className="w-full bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 mt-4 py-1 px-3 font-medium rounded-md text-slate-200 text-center" onClick={onViewAllClickHandler}>View All Reviews</button>
                }

            </div>
        )
    }

}

export default ReviewStack