import React from 'react'

const Strip = (props) => {

    if (props.isLoading) {
        return (
            <div className="flex bg-gray-800 w-full shadow-2xl rounded-xl h-20 animate-pulse">

                <div className="flex basis-1/12"></div>

                <div className="flex basis-11/12">
                    <div className='bg-gray-700 w-20 m-2 basis-1/12 rounded-lg'></div>

                    <div className='flex flex-col basis-9/12'>

                        <div className='basis-6/12 flex flex-col justify-center p-2 mt-2'>
                            <div className='flex space-x-3'>
                                <div className="h-3 bg-slate-700 rounded-full basis-4/12"></div>
                                <div className="h-3 bg-slate-700 rounded-full basis-1/12"></div>

                            </div>
                        </div>

                        <div className='basis-6/12 flex flex-col justify-center p-2'>
                            <div className='flex space-x-3'>
                                <div className="h-5 bg-slate-700  basis-6/12 rounded-full px-2 py-1 me-1 my-1"></div>
                            </div>
                        </div>

                    </div>

                    <div className='flex justify-end basis-2/12'>
                        <div className="h-6 bg-slate-700 rounded-lg me-10 my-auto px-6 py-1"></div>
                    </div>
                </div>

            </div>
        )
    }
    else {

        return (
            <div className="flex w-full shadow-2xl h-20 group cursor-pointer">

                <div className="bg-gray-900 group-hover:bg-black flex basis-1/12  justify-center rounded-s-xl">
                    <h1 className='font:bold italic text-3xl text-blue-200 my-auto'>#{props.rank}</h1>
                </div>

                <div className="bg-gray-800 group-hover:bg-gray-900 flex basis-11/12 rounded-e-xl ">
                    <div className='bg-white  w-20 m-2 basis-1/12 '>
                        <img className="object-fill h-full w-full " src={props.img} alt={props.title} />
                    </div>

                    <div className='flex flex-col basis-9/12'>
                        <div className='basis-6/12 flex flex-col justify-center p-2'>
                            <h1 className='font-bold text-md text-white'>{props.title} <span className='font-normal text-slate-300'>({props.year})</span></h1>
                        </div>
                        <div className='basis-6/12 ps-2 flex flex-col justify-center'>
                            <div className='flex flex-wrap text-slate-200 text-xs font-bold'>
                                {props.genres && props.genres.map((item, i) => {
                                    return (
                                        <span key={item.id} className='border-2 border-blue-600 rounded-full px-2 py-1 me-1 my-1'>{item.name}</span>
                                    )
                                })}

                            </div>

                        </div>
                    </div>

                    <div className='flex justify-end basis-2/12 text-white font-bold text-lg rounded-e-xl'>
                        <div className='border-2 border-blue-500 me-10 my-auto px-5 py-1 rounded-lg'>{props.score}</div>
                    </div>
                </div>

            </div>
        )

    }

}

export default Strip