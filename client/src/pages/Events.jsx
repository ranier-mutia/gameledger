import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import EventCard from '../components/EventCard';

const Events = (props) => {

    const [ongoingEvents, setOngoingEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [offset, setOffset] = useState(0);

    const controllerRef = useRef();

    const getOngoingEvents = async (signal) => {

        setIsLoading(true);

        await axios.post('http://localhost:3000/events/ongoingEvents', { signal })
            .then((response) => {
                setOngoingEvents(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                if (error.code != "ERR_CANCELED") {
                    console.log(error);
                }

            });
    }

    const getPastEvents = async (signal) => {

        setIsLoading(true);

        await axios.post('http://localhost:3000/events/pastEvents', { offset }, { signal })
            .then((response) => {
                setPastEvents((prevEvents) => [...prevEvents, ...response.data]);
                setOffset(prevOffset => prevOffset + 12);
                setIsLoading(false);
            })
            .catch((error) => {
                if (error.code != "ERR_CANCELED") {
                    console.log(error);
                }

            });
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

        getPastEvents(signal);
        getOngoingEvents(signal);

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

                getPastEvents(signal);
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

                    {ongoingEvents.length ?
                        <div>
                            <div className='text-white text-md mt-6'>Ongoing</div>
                            <div className='grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 xl:gap-4 mt-4'>
                                {ongoingEvents.length ? ongoingEvents.map((item, i) => {
                                    return (
                                        < EventCard key={item.id} id={item.id} name={item.name} slug={item.slug} img={item.logo ? item.logo : null} isLoading={false} />
                                    )
                                }) : null}
                            </div>
                            <div className='w-full h-[0.1rem] bg-blue-400 rounded-full my-5'></div>
                        </div> : null

                    }


                    <div className='grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 xl:gap-4 mt-4'>
                        {pastEvents.length ? pastEvents.map((item, i) => {
                            return (
                                < EventCard key={item.id} id={item.id} name={item.name} slug={item.slug} img={item.logo ? item.logo : null} isLoading={false} />
                            )
                        }) : loadingCard(12)}
                        {isLoading && loadingCard(4)}
                    </div>
                </div>

            </div>
        </div>

    )
}

export default Events

