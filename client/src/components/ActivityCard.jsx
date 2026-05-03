import React, { useRef } from 'react'
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigate } from 'react-router-dom'

const ActivityCard = (props) => {

    const likeRef = useRef();

    dayjs.extend(relativeTime);

    const navigate = useNavigate()

    const onActivityClick = (e) => {
        if (!likeRef.current?.contains(e.target)) {
            navigate("/game/" + props.activity.game_slug)
        }
    }

    if (!props.isLoading) {
        return (
            <div className={`h-auto min-h-24 bg-gray-800 hover:bg-black shadow-2xl border-slate-900 rounded-xl cursor-pointer w-full group`} onClick={onActivityClick}>

                <div className="flex h-full w-full">
                    <div>
                        {(props.activity.game_cover && <img className="object-fill h-full w-24 rounded-s-xl group-hover:opacity-75" src={props.activity.game_cover} alt={props.activity.game_name} />)}
                    </div>

                    <div className='flex w-full h-auto min-h-24 justify-between'>

                        {props.type == "user" ?
                            <div className='flex flex-col h-full p-2 text-sm sm:text-base'>
                                <div className='text-slate-300'>{props.activity.status == "plan" ? "Plans to play" : props.activity.status == "playing" ? "Is playing" : "Have played"}</div>
                                <div className='h-full text-blue-400'>{props.activity.game_name}</div>
                            </div>
                            :
                            <div>
                                <div className='flex flex-col h-full p-2'>
                                    <img className="rounded-md w-6 h-6" src={`/profile_pictures/${props.user.profile_picture}.png`} alt="profile_picture" draggable="false" />
                                    <div className='text-blue-400 font-medium'>{props.user.username}</div>
                                    <div className='text-slate-300'>{props.activity.status == "plan" ? "Plans to play " : props.activity.status == "playing" ? "Is playing " : "Have played "}<span className='text-blue-400'>{props.activity.game_name}</span></div>
                                </div>
                            </div>
                        }


                        <div className='flex flex-col justify-between h-full p-2 text-slate-400 text-xs sm:text-sm '>

                            <div className='text-end'>
                                {dayjs(props.activity.date_added).fromNow()}
                            </div>

                            <div className={`flex ${props.activity.liked ? 'text-blue-500' : 'text-blue-200'} justify-end`}>
                                <div className='flex space-x-1 hover:bg-gray-800 rounded-lg p-2' onClick={() => props.onLikeClickHandler(props.activity.id, props.activity.liked, props.activity.prefID)} ref={likeRef}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 mt-0.5 sm:mt-1 scale-x-[-1]">
                                        <path d="M2.09 15a1 1 0 0 0 1-1V8a1 1 0 1 0-2 0v6a1 1 0 0 0 1 1ZM5.765 13H4.09V8c.663 0 1.218-.466 1.556-1.037a4.02 4.02 0 0 1 1.358-1.377c.478-.292.907-.706.989-1.26V4.32a9.03 9.03 0 0 0 0-2.642c-.028-.194.048-.394.224-.479A2 2 0 0 1 11.09 3c0 .812-.08 1.605-.235 2.371a.521.521 0 0 0 .502.629h1.733c1.104 0 2.01.898 1.901 1.997a19.831 19.831 0 0 1-1.081 4.788c-.27.747-.998 1.215-1.793 1.215H9.414c-.215 0-.428-.035-.632-.103l-2.384-.794A2.002 2.002 0 0 0 5.765 13Z" />
                                    </svg>

                                    <div className=''>{props.activity.likes.toLocaleString()}</div>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>

            </div>
        )
    } else {
        return <div className={`h-24 bg-gray-800 shadow-2xl border-slate-900 rounded-xl w-full animate-pulse`}></div>
    }



}

export default ActivityCard