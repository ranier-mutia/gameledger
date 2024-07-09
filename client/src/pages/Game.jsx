import React, { useRef, useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import axios from 'axios'
import VideoPlaylist from '../components/VideoPlaylist';
import StoryLine from '../components/StoryLine';
import GameInfo from '../components/GameInfo';
import Gallery from '../components/Gallery';
import SimilarGames from '../components/SimilarGames';

const Game = () => {

    const [game, setGame] = useState();
    const controllerRef = useRef();
    const params = useParams();
    const slug = params.slug;

    useEffect(() => {

        const getGame = async (signal) => {

            await axios.post('http://localhost:3000/games/getGame', { slug }, { signal })
                .then((response) => {
                    setGame(response.data);

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

        getGame(signal);

        return () => controllerRef.current.abort();

    }, [slug]);



    return (


        <div className='h-full w-full relative'>
            {/* Background Image */}
            {game &&
                <div className='flex absolute w-full xl:ps-[17rem]'>
                    <div className='flex h-auto min-h-80 w-full mx-auto bg-gray-600'>
                        {game.artwork ? <img src={game.artwork} alt={game.name} className="h-auto min-h-80 w-full" /> : game.screenshot ? <img src={game.screenshot} alt={game.name} className="h-auto min-h-80 w-full" /> : <div className='content-center  mx-auto text-white pt-12'>No Cover</div>}
                    </div>
                    <div className='absolute bg-gray-700 h-full w-full top-60 sm:top-80 left-0'>
                        <div className='bg-gray-800 h-60 sm:h-40'></div>
                        <div></div>
                    </div>
                </div>
            }

            <div className='flex justify-center h-full w-full pb-20 pt-5 sm:pt-20 xl:ps-[17rem] overflow-x-hidden'>
                {game &&
                    <div className='px-3 w-full sm:w-auto sm:max-w-3xl xl:max-w-none xl:w-full xl:ps-20 xl:px-20 xl:py-2 z-20'>

                        {/* Cover, Title, and Summary */}
                        <div className='flex justify-center w-full pt-16'>

                            <div className='flex flex-col items-center sm:me-5 h-[24rem] sm:h-[20rem]'>
                                <div className="flex justify-center align-middle h-60 w-40 bg-gray-600 rounded-xl border border-gray-800 shadow-xl">
                                    {(game.cover ? <img className="object-fill h-full w-full rounded-xl " src={game.cover.urlBig} alt={game.name} />
                                        : <div className='content-center text-white'>No Cover</div>)}
                                </div>

                                <div className='text-center text-slate-200 font-medium text-xl my-2 mx-10 overflow-hidden hover:overflow-y-auto h-14 sm:hidden'>{game.name}</div>
                            </div>

                            <div className='text-slate-400 mt-44 hidden sm:block w-full'>
                                <div className='font-medium text-slate-200 text-xl my-1'>{game.name}</div>
                                <div className='overflow-hidden hover:overflow-y-auto h-24'>
                                    <p >{game.summary}</p>
                                </div>
                            </div>

                        </div>


                        {/* Body */}
                        <div className='mt-6'>

                            <div className='flex flex-col w-full sm:justify-between sm:flex-row'>

                                <div className='w-full'>


                                    {game.videos && <VideoPlaylist videos={game.videos} />}

                                    {game.summary && <div className='text-slate-400 mb-4 sm:hidden'>{game.summary}</div>}

                                    {game.storyline && <StoryLine storyline={game.storyline} />}

                                    {game.artworks || game.screenshots ? <Gallery artworks={game.artworks} screenshots={game.screenshots} /> : null}

                                    {game.similar_games && <SimilarGames games={game.similar_games} />}


                                </div>

                                <GameInfo game={game} />

                            </div>

                        </div>

                    </div>
                }
            </div>

        </div>
    )
}

export default Game