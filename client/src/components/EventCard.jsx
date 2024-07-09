import React from 'react'
import { Link } from 'react-router-dom'

const EventCard = (props) => {

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
            <div className='relative bg-gray-800 hover:bg-gray-900 shadow-2xl border-slate-900 rounded-xl cursor-pointer w-full sm:w-60 xl:w-full group'>

                <Link to={"/event/" + props.slug}>

                    <div className="flex justify-center align-middle h-24 sm:h-40 xl:h-48 bg-gray-600 rounded-t-xl">
                        {(props.img ? <img className="object-fill h-full w-full rounded-t-xl " src={props.img} alt={props.name} />
                            : <div className='content-center text-white'>No Cover</div>)}
                    </div>

                    <div className="text-white text-xs sm:text-sm p-2 min-h-[3rem] me-3">{props.name}</div>

                </Link>



            </div>
        )
    }

}

export default EventCard