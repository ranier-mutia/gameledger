import React, { useState, useEffect, useRef } from 'react';
import ReviewCard from './ReviewCard';
import axios from 'axios';

const Reviews = (props) => {

    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState({
        init: true,
        more: false
    });
    const [offset, setOffset] = useState(0);
    const [hasNext, setHasNext] = useState(true);


    const controllerRef = useRef();

    const loadingCard = (count) => {

        let cards = []

        for (let i = 0; i < count; i++) {
            cards.push(<ReviewCard key={i} isLoading={true} />)
        }

        return cards;

    }

    const getAllUserReviews = async (signal) => {

        if (hasNext) {

            setIsLoading(prev => ({ ...prev, more: true }));

            await axios.post('http://localhost:3000/reviews/getAllUserReviews', { email: props.user.email, offset }, { signal })
                .then((response) => {

                    const nextOffset = response.data.length - 16;
                    const result = response.data.slice(0, 16);

                    setReviews((prev) => [...prev, ...result]);
                    setOffset(prevOffset => prevOffset + 16);
                    setIsLoading(prev => ({ ...prev, init: false, more: false }));

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

        const handleScroll = () => {
            const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

            if (scrollTop + clientHeight >= scrollHeight - 20) {

                if (controllerRef.current) {
                    controllerRef.current.abort();
                }

                controllerRef.current = new AbortController();
                const signal = controllerRef.current.signal;

                getAllUserReviews(signal);
            }
        };

        if (!isLoading.more) {
            window.addEventListener("scroll", handleScroll);
        }

        return () => {
            window.removeEventListener("scroll", handleScroll);

        };
    }, [isLoading.more]);


    useEffect(() => {
        if (!props.user) return

        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        setIsLoading(prev => ({ ...prev, init: true }));

        getAllUserReviews(signal);

        return () => controllerRef.current.abort();

    }, [props.user]);

    return (
        <div className='p-2 sm:p-4'>

            <div className='grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 xl:gap-4 mt-4'>
                {reviews && reviews.map((item, i) => {
                    return (
                        < ReviewCard key={item.id} review={item} isLoading={false} type="all" isProfile={true} />
                    )
                })}

                {isLoading.init && loadingCard(16)}
                {isLoading.more && loadingCard(4)}
            </div>
            {!isLoading.init && reviews.length == 0 && <div className='w-full flex justify-center text-slate-400 bg-gray-900 p-4 rounded-xl'>No reviews</div>}

        </div>
    )
}

export default Reviews