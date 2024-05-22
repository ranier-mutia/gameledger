import React, { useEffect, useState } from 'react'
import Dropdown from '../components/Dropdown'
import Strip from '../components/Strip'
import Stack from '../components/Stack'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Home = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [games, setGames] = useState();

    const getGames = async (ids, signal) => {

        setIsLoading(true);

        await axios.post('http://localhost:3000/games/homeGames', { ids }, { signal })
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


    const [platforms, setPlatforms] = useState();


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

        getPlatforms();

    }, []);

    return (
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
                            <Strip key={item.id} genres={item.genres} title={item.name} img={item.cover.url} year={item.release_date} score={item.score} rank={i + 1} isLoading={isLoading} />
                        )
                    }) : loadingStrip()}
                </div>

            </div>

        </div>

    )
}

export default Home