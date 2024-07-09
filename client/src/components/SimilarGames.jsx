import React, { useState, useEffect } from 'react'
import Card from './Card'
import axios from 'axios';

const SimilarGames = (props) => {

    const [games, setGames] = useState();
    const gameIDs = props.games;

    const loadingCard = () => {

        let cards = []

        for (let i = 0; i < 6; i++) {
            cards.push(<Card key={i} isLoading={true} />)
        }

        return cards;

    }

    useEffect(() => {

        const getGames = async () => {

            await axios.post('http://localhost:3000/games/similarGames', { gameIDs })
                .then((response) => {
                    setGames(response.data);

                })
                .catch((error) => {
                    console.log(error);
                });
        }

        getGames();

    }, [props.games]);


    return (
        <div className='mb-6'>

            <h1 className='text-lg drop-shadow-lg text-slate-200 cursor-default'>Similar Games</h1>

            <div className='w-20 h-[0.1rem] bg-blue-400 rounded-xl mb-4'></div>

            <div className='grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 xl:gap-8'>
                {games ? games.map((item, i) => {
                    return (
                        <Card key={item.id} id={item.id} name={item.name} title="SimilarGames" slug={item.slug} rank={i + 1} img={item.cover ? item.cover.urlBig : null} isLoading={false} />
                    )
                }) : loadingCard()}
            </div>
        </div>
    )
}

export default SimilarGames