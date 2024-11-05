import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const ReviewCard = (props) => {

    const [isMouseOver, setIsMouseOver] = useState(false)

    if (props.isLoading) {
        return (

            <div className='relative bg-gray-800 border-slate-900 shadow-2xl rounded-xl w-full sm:w-60 xl:w-full animate-pulse'>
                <div className="h-24 sm:h-40 xl:h-48"></div>
                <div className="p-2 min-h-[3rem] me-3 space-y-3">
                    <div className='flex space-x-3'>
                        <div className="h-2 bg-slate-700 rounded basis-3/4"></div>
                        <div className="h-2 bg-slate-700 rounded basis-1/4"></div>
                    </div>
                    <div className="h-2 bg-slate-700 rounded"></div>
                </div>

            </div>
        )

    } else {
        return (
            <div className='h-auto bg-gray-800 hover:bg-gray-900 shadow-2xl border-slate-900 rounded-xl cursor-pointer w-full group' onMouseEnter={() => setIsMouseOver(true)} onMouseLeave={() => setIsMouseOver(false)}>

                <Link to={"/review/" + props.review.id}>

                    <div className='relative h-full flex flex-col justify-between pb-3'>

                        <div className={`absolute h-6 w-10  top-0 left-0 z-20 rounded-tl-xl rounded-br-xl border-black ${props.review.score <= 100 && props.review.score >= 70 ? 'bg-green-600 group-hover:bg-green-700' : props.review.score < 70 && props.review.score >= 50 ? 'bg-orange-500 group-hover:bg-orange-600' : 'bg-red-500 group-hover:bg-red-600'} `}>
                            <div className='h-full flex justify-center align-middle text-slate-200 font-bold'>
                                {props.review.score}
                            </div>
                        </div>

                        {props.type == "all" ?
                            <div className="absolute w-full h-20 bg-gray-600 rounded-t-xl overflow-hidden">
                                {isMouseOver &&
                                    <div className='absolute w-full h-full bg-black bg-opacity-50 flex justify-center items-center text-slate-200 font-bold text-lg'>READ MORE</div>
                                }

                                {(props.review.game_artworks ? <img className="object-fill h-28 sm:h-auto w-full rounded-t-xl -mt-5" src={props.review.game_artworks[0].url} alt={props.review.game_name} />
                                    : null)}
                            </div>
                            :
                            <div className="absolute w-full h-6 bg-gray-900 rounded-t-xl overflow-hidden border-b border-b-slate-600 shadow-xl">
                                {isMouseOver &&
                                    <div className='absolute w-full h-full bg-black flex justify-center items-center text-blue-400 text-xs'>READ MORE</div>
                                }

                                {(props.review.game_artworks ? <img className="object-fill h-28 sm:h-auto w-full rounded-t-xl -mt-5" src={props.review.game_artworks[0].url} alt={props.review.game_name} />
                                    : null)}
                            </div>
                        }


                        <div className={`flex flex-col ${props.type == "all" ? 'pt-20' : 'pt-4'} `}>
                            <div className="text-blue-300 text-sm sm:text-base font-bold p-2 me-3 z-10">{props.review.game_name}</div>
                            <div className="text-slate-300 text-xs sm:text-sm p-2 me-3 italic z-10 break-words">{props.review.summary}</div>
                        </div>

                        <div className="text-slate-400 text-xs sm:text-sm flex justify-between px-3">

                            <div className='z-10 flex space-x-1 text-blue-300'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 pt-1 scale-x-[-1]">
                                    <path d="M2.09 15a1 1 0 0 0 1-1V8a1 1 0 1 0-2 0v6a1 1 0 0 0 1 1ZM5.765 13H4.09V8c.663 0 1.218-.466 1.556-1.037a4.02 4.02 0 0 1 1.358-1.377c.478-.292.907-.706.989-1.26V4.32a9.03 9.03 0 0 0 0-2.642c-.028-.194.048-.394.224-.479A2 2 0 0 1 11.09 3c0 .812-.08 1.605-.235 2.371a.521.521 0 0 0 .502.629h1.733c1.104 0 2.01.898 1.901 1.997a19.831 19.831 0 0 1-1.081 4.788c-.27.747-.998 1.215-1.793 1.215H9.414c-.215 0-.428-.035-.632-.103l-2.384-.794A2.002 2.002 0 0 0 5.765 13Z" />
                                </svg>

                                <div>{props.review.like.toLocaleString()}</div>
                            </div>

                            <div className='z-10'>- {props.review.username}</div>

                        </div>

                        <div className='absolute bottom-0 w-full h-2/3 bg-gray-800 rounded-b-xl group-hover:bg-gray-900 '>

                        </div>

                    </div>

                </Link>

            </div>
        )
    }

}

export default ReviewCard