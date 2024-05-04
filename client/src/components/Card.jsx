import React from 'react'

const Card = (props) => {
    return (
        <div className='bg-gray-600 shadow-2xl border border-slate-700 rounded-xl'>
            <div className="w-full h-40 sm:h-60">
                <img className="object-fill h-full w-full rounded-t-xl" src={props.img} alt={props.title} />
            </div>
            <div className="text-white text-sm p-2 min-h-[3.5rem] me-3">{props.title}</div>
        </div>
    )
}

export default Card