import React, { useEffect, useState, useRef } from 'react'
import Dropdown from '../components/Dropdown'
import Strip from '../components/Strip'
import Stack from '../components/Stack'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Home = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [platforms, setPlatforms] = useState();
    const [games, setGames] = useState();
    const controllerRef = useRef();

    const getGames = async (ids = [6, 167, 169, 48, 49, 130, 34, 39], signal) => {

        const platformIDs = JSON.stringify(ids);
        setIsLoading(true);

        await axios.post('http://localhost:3000/games/homeAllGames', { platformIDs }, { signal })
            .then((response) => {
                setGames(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                if (error.code != "ERR_CANCELED") {
                    console.log(error);
                }

            });
    }

    const loadingStrip = () => {

        const count = 10;
        let strips = []

        for (let i = 0; i < count; i++) {
            strips.push(<Strip key={i} isLoading={true} rank={i + 1} />)
        }

        return strips;

    }


    useEffect(() => {

        const getPlatforms = async () => {

            await axios.get('http://localhost:3000/games/homePlatforms')
                .then((response) => {
                    setPlatforms(response.data);

                })
                .catch((error) => {
                    console.log(error);
                });
        }

        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        getPlatforms();


        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        getGames(undefined, signal);

        return () => controllerRef.current.abort();

    }, []);

    return (
        <div className='flex justify-center h-full w-full pt-20 pb-20 xl:ps-[18rem] overflow-x-hidden'>
            <div className='px-3 w-full sm:w-auto sm:max-w-3xl xl:max-w-none xl:w-full xl:ps-8 xl:px-8 xl:py-2'>

                <div>
                    <div className="flex w-full xl:w-80 space-x-3">
                        <Dropdown id="platform" label="Platforms" checkBox={platforms} dropDownHandler={getGames} />

                    </div >

                    <Stack title="HYPED" path="hyped" games={games && games.hyped} isLoading={isLoading} />
                    <Stack title="NEW" path="new" games={games && games.new} isLoading={isLoading} />
                    <Stack title="UPCOMING" path="upcoming" games={games && games.upcoming} isLoading={isLoading} />
                    <div className='xl:hidden'>
                        <Stack title="BEST" path="best" games={games && games.best} isLoading={isLoading} />
                    </div>


                    <div className='hidden xl:block'>
                        <div className="flex justify-between mt-12 pe-2">
                            <h1 className='text-lg font-bold drop-shadow-lg text-slate-200 cursor-default'>BEST</h1>
                            <Link to="/games/best" className='text-xs font-bold drop-shadow-lg text-blue-300 hover:text-blue-400'>View All</Link>
                        </div>

                        <div className='w-20 h-[0.1rem] bg-blue-400 rounded-full'></div>

                        <div className='flex-col mt-6 space-y-6'>
                            {games ? games.best.map((item, i) => {
                                return (
                                    <Strip key={item.id} genres={item.genres} title={item.name} slug={item.slug} img={item.cover.url} year={item.release_date} score={item.score} rank={i + 1} isLoading={isLoading} />
                                )
                            }) : loadingStrip()}
                        </div>

                    </div>

                </div>

            </div>
        </div>

    )
}

export default Home