import React from 'react'
import Card from './Card'

const Stack = (props) => {

    const cardNum = [1, 2, 3, 4, 5, 6];
    var games;

    if (props.games) {

        switch (props.title) {
            case "HYPED":
                games = props.games.hyped;
                break;
            case "NEW":
                games = props.games.new;
                break;
            case "UPCOMING":
                games = props.games.upcoming;
                break;
        }

    }

    return (
        <div>
            <div className="flex justify-between mt-12 pe-2">
                <button className='text-lg font-bold drop-shadow-lg text-slate-200'>{props.title}</button>
                <button className='text-xs font-bold drop-shadow-lg text-blue-300'>View All</button>
            </div>

            <div className='w-20 h-[0.1rem] bg-blue-400 rounded-full'></div>

            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-10 mt-6'>
                {games && games.map((item, i) => {
                    return (
                        <Card key={item.id} title={item.name} img={item.cover ? item.cover.urlBig : null} />
                    )
                })}
            </div>
        </div>
    )
}

export default Stack