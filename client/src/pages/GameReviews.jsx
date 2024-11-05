import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useParams } from "react-router-dom";
import ReviewCard from '../components/ReviewCard';

const GameReviews = (props) => {

    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [hasNext, setHasNext] = useState(true);

    const controllerRef = useRef();

    const params = useParams();
    const id = params.id;

    const loadingCard = (count) => {

        let cards = []

        for (let i = 0; i < count; i++) {
            cards.push(<ReviewCard key={i} isLoading={true} />)
        }

        return cards;

    }

    const getReviews = async (signal) => {

        if (hasNext) {

            setIsLoading(true);

            await axios.post('http://localhost:3000/reviews/getAllGameReviews', { id, offset }, { signal })
                .then((response) => {

                    const nextOffset = response.data.length - 24;
                    const result = response.data.slice(0, 24);

                    setReviews((reviews) => [...reviews, ...result]);
                    setOffset(prevOffset => prevOffset + 24);
                    setIsLoading(false);

                    if (nextOffset <= 0) { setHasNext(false) }

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

        getReviews(signal);

        return () => controllerRef.current.abort();

    }, [id]);

    useEffect(() => {

        const handleScroll = () => {
            const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

            if (scrollTop + clientHeight >= scrollHeight - 20) {

                if (controllerRef.current) {
                    controllerRef.current.abort();
                }

                controllerRef.current = new AbortController();
                const signal = controllerRef.current.signal;

                getReviews(signal);
            }
        };

        if (!isLoading) {
            window.addEventListener("scroll", handleScroll);
        }

        return () => {
            window.removeEventListener("scroll", handleScroll);

        };
    }, [isLoading]);

    return (
        <div className='flex justify-center h-full w-full pt-20 pb-20 xl:ps-[18rem] overflow-x-hidden'>
            <div className='px-3 w-full sm:w-auto sm:max-w-3xl xl:max-w-none xl:w-full xl:ps-8 xl:px-8 xl:py-2'>

                <div>
                    <h1 className='text-white text-xl font-medium'>Reviews</h1>

                    <div className='grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 xl:gap-4 mt-4'>
                        {reviews.length ? reviews.map((item, i) => {

                            return (
                                < ReviewCard key={item.id} review={item} isLoading={false} type="specific" />
                            )

                        }) : loadingCard(24)}
                        {isLoading && loadingCard(4)}
                    </div>
                </div>

            </div>
        </div>

    )
}

export default GameReviews

