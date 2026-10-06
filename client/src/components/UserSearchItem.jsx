import React from 'react'
import { Link } from 'react-router-dom'

const UserSearchItem = (props) => {

    if (!props.isLoading) {
        return (
            <li onMouseEnter={props.selectedIndex} className={`flex w-full min-h-14  ${props.isHighlighted ? "bg-blue-600/10 border-blue-500 border-l-2" : ""}`}>
                <Link onClick={props.itemClickHandler} className='flex w-full px-2 py-0.5' to={"/user/" + props.username} state={{ id: props.id }}>
                    <div className="w-16 p-2">
                        <div className='h-full rounded-full'>
                            <img className="object-cover h-full w-full rounded-full" src={props.img} alt={props.username} onError={(e) => {
                                e.currentTarget.onerror = null; // Prevents infinite loops if default image is also missing
                                e.currentTarget.src = '/profile_pictures/default.png';
                            }} />
                        </div>
                    </div>
                    <div className='flex-col h-auto w-full space-y-1 '>
                        <div className='flex text-left min-h-4 text-slate-200 pt-1 ms-2'>{props.username || ""}</div>
                        <div className='flex text-left min-h-4 text-blue-300 text-xs space-x-1 font-medium'>
                            {props.topGenres?.map((item, i) => (
                                <span className={`${item.name && "bg-blue-950 px-2 rounded-md"}`} key={i}>{item.name}</span>
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

export default UserSearchItem