import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';
import axios from 'axios';

const Favorites = (props) => {

    const [favorites, setFavorites] = useState([]);
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
            cards.push(<Card key={i} isLoading={true} />)
        }

        return cards;

    }

    const getAllUserFavorites = async (signal) => {

        if (hasNext) {

            setIsLoading(prev => ({ ...prev, more: true }));

            await axios.post('http://localhost:3000/preferences/getAllFavoriteGames', { email: props.user.email, offset }, { signal })
                .then((response) => {

                    const nextOffset = response.data.length - 24;
                    const result = response.data.slice(0, 24);

                    setFavorites((prev) => [...prev, ...result]);
                    setOffset(prevOffset => prevOffset + 24);
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

                getAllUserFavorites(signal);
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

        getAllUserFavorites(signal);

        return () => controllerRef.current.abort();

    }, [props.user]);

    return (
        <div className='p-2 sm:p-4'>

            <div className='grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-6 xl:gap-4 mt-6'>
                {favorites && favorites.map((item, i) => {
                    return (
                        <Card key={item.id} id={item.id} name={item.name} title="All" slug={item.slug} rank={i + 1} img={item.cover ? item.cover.urlBig : null} isLoading={false} />
                    )
                })}
                {isLoading.init && loadingCard(24)}
                {isLoading.more && loadingCard(6)}
            </div>

            {!isLoading.init && favorites.length == 0 && <div className='w-full flex justify-center text-slate-400 bg-gray-900 p-4 rounded-xl'>No favorites</div>}

        </div>
    )
}

export default Favorites