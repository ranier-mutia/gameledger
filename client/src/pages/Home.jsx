import React, { useEffect, useState } from 'react'
import Dropdown from '../components/Dropdown'
import Strip from '../components/Strip'
import Stack from '../components/Stack'
import axios from 'axios'

const Home = () => {

    const stripNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const [games, setGames] = useState();
    const [events, setEvents] = useState();

    const getGames = async () => {

        await axios.get('http://localhost:3000/games')
            .then((response) => {
                setGames(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const getEvents = async () => {

        await axios.get('http://localhost:3000/events')
            .then((response) => {
                setEvents(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        getGames();
        getEvents();
    }, []);



    return (
        <div className='px-8 py-2'>

            <div>
                <div className="flex justify-between pe-2">
                    <button className='text-lg font-bold drop-shadow-lg text-slate-200'>EVENTS</button>
                </div>

                <div className='w-20 h-[0.1rem] bg-blue-400 rounded-full'></div>

                <div className='mt-6 grid grid-cols-1 lg:grid-cols-2 gap-10'>

                    {events && events.map((item, i) => {
                        return (

                            <div key={item.id} className='bg-gray-600 shadow-2xl border-black rounded-xl '>
                                <div className="h-80 w-full">
                                    <img className="object-fill h-full w-full rounded-t-xl" alt={item.name} src={item.event_logo ? item.event_logo.url : null} />
                                </div>
                                <div className="text-white text-center text-md p-3">{item.name}</div>
                            </div>
                        )
                    })}


                </div>

            </div>


            <div className="flex justify-items-start space-x-5 mt-12">
                <Dropdown name="platform" label="Platform" />
                <Dropdown name="genre" label="Genre" />
            </div >



            <Stack title="HYPED" games={games} />
            <Stack title="NEW" games={games} />
            <Stack title="UPCOMING" games={games} />

            <div>
                <div className="flex justify-between mt-12 pe-2">
                    <button className='text-lg font-bold drop-shadow-lg text-slate-200'>BEST</button>
                </div>

                <div className='w-20 h-[0.1rem] bg-blue-400 rounded-full'></div>

                <div className='flex-col mt-6 space-y-6'>
                    {games && games.best.map((item, i) => {
                        return (
                            <Strip key={item.id} genres={item.genres} title={item.name} img={item.cover.url} year={item.release_date} score={item.score} rank={i + 1} />
                        )
                    })}
                </div>

                <button className="flex w-full p-3 shadow-lg mt-5 rounded-xl bg-blue-500 text-white font-bold justify-center">
                    View All
                </button>
            </div>

        </div>

    )
}

export default Home