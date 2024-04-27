import React from 'react'

const Sidebar = () => {
    return (
        <nav className="bg-gray-700 w-[17rem] h-screen ps-10 pt-[6.5rem] fixed z-10 collapse sm:visible">
            <ul className='space-y-4'>
                <li className='text-white font-bold text-lg'><a href="#">Home</a></li>
                <li className='text-white font-bold text-lg'>Games</li>
                <li>
                    <ul className='space-y-4 ps-4'>
                        <li className='text-slate-300 text-sm font-semibold'><a href="#">Popular</a></li>
                        <li className='text-slate-300 text-sm font-semibold'><a href="#">New</a></li>
                        <li className='text-slate-300 text-sm font-semibold'><a href="#">Upcoming</a></li>
                        <li className='text-slate-300 text-sm font-semibold'><a href="#">Free</a></li>
                        <li className='text-slate-300 text-sm font-semibold'><a href="#">Best</a></li>
                    </ul>
                </li>
                <li className='text-white font-bold text-lg'><a href="#">Wishlist</a></li>
            </ul>
        </nav>

    )
}

export default Sidebar