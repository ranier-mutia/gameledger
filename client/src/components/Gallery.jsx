import React, { useState } from 'react'

const Gallery = (props) => {


    return (
        <div className='mb-6'>

            <div className="flex overflow-x-auto space-x-1 p-1 bg-gray-800" >
                {props.screenshots && props.screenshots.map((item) => {
                    return <img className="aspect-video w-80 h-32 sm:h-auto row-span-1" key={item.id} src={item.url} alt={item.name} />
                })}
                {props.artworks && props.artworks.map((item) => {
                    return <img className="aspect-video w-80 h-32 sm:h-auto row-span-1" key={item.id} src={item.url} alt={item.name} />
                })}
            </div>
        </div>
    )
}

export default Gallery