import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const Status = (props) => {

    const [statusCount, setStatusCount] = useState();

    const controllerRef = useRef();

    useEffect(() => {

        const getStatusCount = async (signal) => {

            await axios.post('http://localhost:3000/lists/getStatusCount', { id: props.id }, { signal })
                .then((response) => {
                    setStatusCount(response.data);
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

        getStatusCount(signal);

        return () => controllerRef.current.abort();

    }, [])

    return (
        <div className='mb-6'>

            <h1 className='text-lg drop-shadow-lg text-slate-200 cursor-default mb-1'>Status Distribution</h1>
            <div className='w-20 h-[0.1rem] bg-blue-400 rounded-xl mb-4'></div>

            <div className='flex w-full h-20 bg-gray-800 rounded-xl divide-x divide-gray-500'>
                <div className='h-20 w-full flex flex-col'>
                    <div className='text-blue-400 px-3 py-1 absolute text-sm xl:text-base'>Plan to play</div>
                    <div className='text-slate-200 h-full flex items-center justify-center text-xl xl:text-2xl pt-3 xl:pt-0 font-bold'>{statusCount ? statusCount.plan.toLocaleString() : '0'}</div>                </div>
                <div className='h-20 w-full flex flex-col'>
                    <div className='text-blue-400 px-3 py-1 absolute text-sm xl:text-base'>Playing</div>
                    <div className='text-slate-200 h-full flex items-center justify-center text-xl xl:text-2xl pt-3 xl:pt-0 font-bold'>{statusCount ? statusCount.playing.toLocaleString() : '0'}</div>                </div>
                <div className='h-20 w-full flex flex-col'>
                    <div className='text-blue-400 px-3 py-1 absolute text-sm xl:text-base'>Played</div>
                    <div className='text-slate-200 h-full flex items-center justify-center text-xl xl:text-2xl pt-3 xl:pt-0 font-bold'>{statusCount ? statusCount.played.toLocaleString() : '0'}</div>
                </div>

            </div>

        </div>
    )
}

export default Status