import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import GameOptions from './GameOptions'

const ListCard = (props) => {

    const optionRef = useRef();

    const navigate = useNavigate()

    const onListClick = (e) => {
        if (!optionRef.current?.contains(e.target)) {
            navigate("/game/" + props.list.game_slug)
        }
    }

    if (!props.isLoading) {
        return (
            <div className={`h-auto min-h-24 bg-gray-800 hover:bg-gray-900 shadow-2xl border-slate-900 rounded-xl cursor-pointer w-full group relative`} onClick={onListClick}>
                <div className='flex h-full w-full'>
                    <div className='flex h-full w-28 sm:w-24'>
                        {(props.list.game_cover && <img className="object-fill flex h-full w-full rounded-s-xl group-hover:opacity-75" src={props.list.game_cover} alt={props.list.game_name} />)}
                    </div>

                    <div className='flex flex-col sm:flex-row w-full h-full'>

                        <div className='w-full text-blue-400 py-2 px-3'>{props.list.game_name}</div>

                        <div className='w-full xl:w-2/3  flex flex-col sm:flex-row text-sm xl:text-base text-slate-400 px-3 py-2 sm:justify-between pe-12'>

                            <div className='flex sm:flex-col space-x-2 sm:space-x-0'>
                                <div className='text-slate-200'>Score:</div>
                                <div className='flex items-center sm:justify-center w-full h-full'>{props.list.score}</div>
                            </div>
                            <div className='flex sm:flex-col space-x-2 sm:space-x-0'>
                                <div className='text-slate-200'>Started:</div>
                                <div className='flex items-center h-full'>{new Date(props.list.start_date).toLocaleDateString()}</div>
                            </div>
                            <div className='flex sm:flex-col space-x-2 sm:space-x-0'>
                                <div className='text-slate-200'>Ended:</div>
                                <div className='flex items-center h-full'>{new Date(props.list.end_date).toLocaleDateString()}</div>
                            </div>


                        </div>


                    </div>

                    <div ref={optionRef}>
                        <GameOptions type="strip" slug={props.list.game_slug} id={props.list.game_id} />
                    </div>
                </div>

            </div>
        )
    } else {
        return <div className={`h-24 bg-gray-800 shadow-2xl border-slate-900 rounded-xl w-full animate-pulse`}></div>
    }



}

export default ListCard