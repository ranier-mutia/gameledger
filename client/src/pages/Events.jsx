import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import EventCard from '../components/EventCard';

const Events = (props) => {

    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [hasNext, setHasNext] = useState(true);

    const controllerRef = useRef();


    const getEvents = async (signal) => {

        if (hasNext) {

            setIsLoading(true);

            await axios.post('http://localhost:3000/events/getEvents', { offset }, { signal })
                .then((response) => {

                    const nextOffset = response.data.length - 16;
                    const result = response.data.slice(0, 16);

                    setEvents((prevEvents) => [...prevEvents, ...result]);
                    setOffset(prevOffset => prevOffset + 16);
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
            cards.push(<EventCard key={i} isLoading={true} />)
        }

        return cards;

    }


    useEffect(() => {

        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        getEvents(signal);

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

                getEvents(signal);
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
                    <h1 className='text-white text-xl font-medium'>Events</h1>

                    <div className='grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 xl:gap-4 mt-4'>
                        {events.length ? events.map((item, i) => {
                            return (
                                < EventCard key={item.id} id={item.id} name={item.name} slug={item.slug} img={item.logo ? item.logo : null} isLoading={false} />
                            )
                        }) : loadingCard(16)}
                        {isLoading && loadingCard(4)}
                    </div>
                </div>

            </div>
        </div>

    )
}

export default Events

