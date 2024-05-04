import React from 'react'

const Sidebar = () => {
    return (
        <div className='w-[17rem] h-screen fixed z-10 collapse sm:visible'>
            <div className='flex justify-between'>
                <nav className="bg-gray-700 ps-10 pt-[6.5rem]">
                    <ul className='space-y-4'>
                        <li className='text-blue-400 font-bold text-lg'><a href="#">Home</a></li>
                        <li className='text-blue-400 font-bold text-lg'><a href="#">Events</a></li>
                        <li className='text-blue-400 font-bold text-lg'><a href="#">Games</a></li>
                        <li>
                            <ul className='space-y-4 ps-4'>
                                <li className='text-slate-200 text-sm font-semibold'><a href="#">Hyped</a></li>
                                <li className='text-slate-200 text-sm font-semibold'><a href="#">New</a></li>
                                <li className='text-slate-200 text-sm font-semibold'><a href="#">Upcoming</a></li>
                                <li className='text-slate-200 text-sm font-semibold'><a href="#">Best</a></li>
                            </ul>
                        </li>
                        <li className='text-blue-400 font-bold text-lg'><a href="#">Reviews</a></li>
                        <li className='text-blue-400 font-bold text-lg'><a href="#">Wishlist</a></li>
                    </ul>
                </nav>
                <div className='bg-gray-500 h-screen w-[0.01rem]'></div>
            </div>
        </div>

    )
}

export default Sidebar