import React from 'react'
import { Link } from 'react-router-dom'

const GameSearchItem = (props) => {

    if (!props.isLoading) {
        return (
            <li onMouseEnter={props.selectedIndex} className={`flex w-full min-h-14  ${props.isHighlighted ? "bg-blue-600/10 border-blue-500 border-l-2" : ""}`}>
                <Link onClick={props.itemClickHandler} className='flex w-full px-2' to={"/game/" + props.slug}>
                    <div className="w-16 py-1 px-2 ">
                        <div className='h-full rounded-md aspect-[3/4]'>
                            {props.img ?
                                <img className="object-cover h-full w-full rounded-md" src={props.img} alt={props.name} />
                                :
                                <div className='text-center h-full content-center text-slate-200 text-xs bg-gray-600 rounded-md'>No Cover</div>
                            }
                        </div>
                    </div>
                    <div className='flex-col h-auto w-full py-1 space-y-1'>
                        <div className='flex text-left min-h-4 text-slate-200 '>{props.name ? props.name : ""} {props.releaseDate ? <span className='font-normal text-slate-400 ms-1'> {'(' + props.releaseDate + ')'}</span> : ""}</div>
                        <div className='flex text-left min-h-4 text-blue-300 text-xs space-x-1 font-medium'>
                            {props.platforms && props.platforms.map((item) => (
                                <span className={`${item.abbreviation ? "bg-blue-950 px-2 rounded-md" : ""}`} key={item.id}>{item.abbreviation}</span>
                            ))}
                        </div>
                    </div>
                </Link>
            </li>
        )
    } else {
        return (
            <li className={`flex w-full min-h-14 px-2`}>
                <div className="w-16 py-1 px-2 ">
                    <div className='h-full rounded-md aspect-[3/4]'>
                        <div className='h-full bg-gray-700 rounded-md animate-pulse'></div>
                    </div>
                </div>
                <div className='flex-col h-auto w-full mt-4 space-y-1'>
                    <div className='flex text-left min-h-4 space-x-3 w-80'>

                        <div className={`h-3 bg-slate-700 rounded-sm animate-pulse ${props.variations.titleWidth}`}></div>

                    </div>
                    <div className='flex text-left min-h-4 space-x-1 pt-1'>
                        {Array.from({ length: props.variations.badgeCount }).map((_, index) => (
                            <div key={index} className={`h-2 w-10 bg-slate-700 rounded animate-pulse`}></div>
                        ))}
                    </div>
                </div>

            </li>
        )
    }

}

export default GameSearchItem