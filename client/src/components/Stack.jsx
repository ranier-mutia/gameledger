import React from 'react'
import Card from './Card'
import { Link } from 'react-router-dom'

const Stack = (props) => {

    const loadingCard = () => {

        var cardNum;

        if (props.title != "BEST") {
            cardNum = [1, 2, 3, 4, 5, 6];
        } else {
            cardNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        }

        return (
            cardNum.map((item, i) => {
                return (<Card key={i} isLoading={true} />)
            })

        )

    }


    return (
        <div>
            <div className="flex justify-between mt-12 pe-2">
                <h1 className='text-lg font-bold drop-shadow-lg text-slate-200 cursor-default'>{props.title}</h1>
                <Link to={"/games/" + props.path} className='text-xs font-bold drop-shadow-lg text-blue-300 hover:text-blue-400'>View All</Link>
            </div>

            <div className='w-20 h-[0.1rem] bg-blue-400 rounded-xl'></div>

            <div className='grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-6 xl:gap-4 mt-6'>
                {props.games ? props.games.map((item, i) => {
                    return (
                        <Card key={item.id} id={item.id} name={item.name} title={props.title} rank={i + 1} img={item.cover ? item.cover.urlBig : null} isLoading={props.isLoading} />
                    )
                }) : loadingCard()}
            </div>
        </div>
    )
}

export default Stack