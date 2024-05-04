import React from 'react'

const Strip = (props) => {

    return (
        <div className="flex w-full shadow-2xl max-h-20">

            <div className="bg-gray-800 flex basis-1/12  justify-center rounded-s-xl">
                <h1 className='font:bold italic text-3xl text-yellow-200 my-auto'>{props.rank}</h1>
            </div>

            <div className="bg-gray-600 flex basis-11/12 rounded-e-xl ">
                <div className='bg-white w-20 m-2 basis-1/12 '>
                    <img className="object-fill h-full w-full " src={props.img} alt={props.title} />
                </div>

                <div className='flex flex-col basis-9/12'>
                    <div className='basis-6/12 flex flex-col justify-center p-2'>
                        <h1 className='font-bold text-md text-white'>{props.title} <span className='font-normal text-slate-300'>({props.year})</span></h1>
                    </div>
                    <div className='basis-6/12 ps-2 flex flex-col justify-center'>
                        <div className='flex flex-wrap text-white text-xs'>
                            {props.genres && props.genres.map((item, i) => {
                                return (
                                    <span key={item.id} className='bg-blue-500 rounded-full px-2 py-1 me-1 my-1'>{item.name}</span>
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

export default Strip