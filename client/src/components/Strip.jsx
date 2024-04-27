import React from 'react'

const Strip = (props) => {
    return (
        <div className="flex w-full shadow-md">

            <div className="bg-gray-700 flex basis-1/12 justify-center py-8 rounded-s-xl">
                <h1 className='font:bold italic text-3xl text-white'>#{props.rank}</h1>
            </div>

            <div className="bg-white flex  basis-11/12 rounded-e-xl">
                <div className='bg-gray-500 w-20 m-2 basis-1/12'></div>

                <div className='flex-col basis-6/12'>
                    <div className='m-2 pt-3'>
                        <h1 className='font-bold text-md'>{props.title}</h1>
                    </div>
                    <div className='m-2 space-x-2 text-white text-xs pt-2 font-bold'>
                        <span className='bg-blue-500 rounded-full px-3 py-1'>Action</span>
                        <span className='bg-blue-500 rounded-full px-3 py-1'>RPG</span>
                        <span className='bg-blue-500 rounded-full px-3 py-1'>Adventure</span>
                        <span className='bg-blue-500 rounded-full px-3 py-1'>Fantasy</span>
                    </div>
                </div>

                <div className='flex-col basis-5/12'>
                    <div className='bg-red-500'></div>
                    <div className='bg-blue-500'></div>
                </div>
            </div>

        </div>
    )
}

export default Strip