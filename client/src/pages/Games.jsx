import React, { useEffect, useState, useRef } from 'react'
import Card from '../components/Card';
import axios from 'axios'

const Games = (props) => {

    const [games, setGames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [hasNext, setHasNext] = useState(true);

    const controllerRef = useRef();

    var type = props.type;

    const getGames = async (signal) => {

        if (hasNext) {

            setIsLoading(true);

            await axios.post('http://localhost:3000/games/getAllGames', { offset, type }, { signal })
                .then((response) => {

                    const nextOffset = response.data.length - 30;
                    const result = response.data.slice(0, 30);

                    setGames((prevGames) => [...prevGames, ...result]);
                    setOffset(prevOffset => prevOffset + 30);
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

    const loadingCard = (count) => {

        let cards = []

        for (let i = 0; i < count; i++) {
            cards.push(<Card key={i} isLoading={true} />)
        }

        return cards;

    }


    useEffect(() => {

        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;


        getGames(signal);


        return () => controllerRef.current.abort();

    }, []);


    useEffect(() => {

        const handleScroll = () => {
            const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

            if (scrollTop + clientHeight >= scrollHeight - 20) {

                if (controllerRef.current) {
                    controllerRef.current.abort();
                }

                controllerRef.current = new AbortController();
                const signal = controllerRef.current.signal;

                getGames(signal);
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
                    <h1 className='text-white text-xl font-medium'>{type}</h1>

                    <div className="flex w-full h-10 bg-gray-800 my-3"></div>

                    <div className='grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-6 xl:gap-4 mt-6'>
                        {games.length ? games.map((item, i) => {
                            return (
                                <Card key={item.id} id={item.id} name={item.name} title={type} slug={item.slug} rank={i + 1} img={item.cover ? item.cover.urlBig : null} isLoading={false} />
                            )
                        }) : loadingCard(24)}
                        {isLoading && loadingCard(6)}
                    </div>
                </div>

            </div>
        </div>

    )
}

export default Games

