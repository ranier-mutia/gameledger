import React, { useRef, useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import axios from 'axios'
import ShowCasedGames from '../components/ShowCasedGames';

const Event = () => {

    const [event, setEvent] = useState();
    const controllerRef = useRef();
    const params = useParams();
    const slug = params.slug;

    useEffect(() => {

        const getEvent = async (signal) => {

            await axios.post('http://localhost:3000/events/event', { slug }, { signal })
                .then((response) => {
                    setEvent(response.data);

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

        getEvent(signal);

        return () => controllerRef.current.abort();

    }, [slug]);



    return (
        <div className='flex justify-center h-full w-full pb-20 pt-20 xl:ps-[17rem] overflow-x-hidden'>
            {event &&
                <div className='px-3 w-full sm:w-auto sm:max-w-3xl xl:max-w-none xl:w-full xl:ps-10 xl:px-20 xl:py-2 z-20'>

                    <div className='flex flex-col sm:flex-row w-full h-auto bg-gray-800 rounded-xl'>

                        <img className='sm:basis-3/6 sm:w-1/2 rounded-t-xl sm:rounded-s-none sm:rounded-e-xl sm:order-last sm:shadow-xl aspect-video' src={event.event_logo.url} alt={event.name} />

                        <div className='sm:basis-3/6 p-4'>
                            <h1 className='text-blue-400 text-2xl'>{event.name}</h1>

                            <div className='flex flex-col text-slate-300 text-sm mt-2'>
                                <span>Event Start: <span className='text-slate-400'>{event.start_time ? event.start_time + ' UTC' : '???'}</span></span>
                                <span>Event End: <span className='text-slate-400'>{event.end_time ? event.end_time + ' UTC' : '???'}</span></span>
                            </div>

                            <div className='mt-2'>
                                <span className='text-slate-300 mt-2'>Description:</span>
                                <div className='text-slate-400 sm:overflow-hidden sm:hover:overflow-y-auto sm:h-44'>{event.description ? event.description : 'No description'}</div>
                            </div>

                        </div>

                    </div>

                    {event.live_stream_url &&
                        <div className='mt-6'>
                            <h1 className='text-lg drop-shadow-lg text-slate-200 cursor-default'>Live Stream:</h1>
                            <div className='w-20 h-[0.1rem] bg-blue-400 rounded-xl mb-4'></div>

                            <div className='w-full bg-gray-800 mt-2'>
                                <div className='flex flex-col h-auto sm:w-2/3 aspect-video sm:flex-row mx-auto'>
                                    <iframe key={event.id} className='w-full h-60 sm:h-auto' src={event.live_stream_url} allowFullScreen></iframe>
                                </div>
                            </div>
                        </div>
                    }

                    {event.games &&
                        <ShowCasedGames games={event.games} />
                    }

                </div>
            }
        </div>
    )
}

export default Event