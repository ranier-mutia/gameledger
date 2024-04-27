import React from 'react'

const Card = (props) => {
    return (
        <div className=''>
            <div className="bg-white w-full h-40 sm:h-60 rounded-xl"></div>
            <div className="mt-1 drop-shadow-lg">{props.title}</div>
        </div>
    )
}

export default Card