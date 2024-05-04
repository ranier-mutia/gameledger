import React from 'react'
import Button from '../../components/Button.jsx'

const Header = () => {
    return (
        <header className='fixed z-20 bg-gray-800 w-screen'>
            <nav className="flex justify-between py-4 px-10">

                <div className="flex justify-center basis-1/12 pe-20"><button className='text-blue-400 font-bold text-xl'>GAMEPARK</button></div>

                <form className='flex justify-center basis-10/12'>
                    <input type="text" name="search" className="flex basis-4/12 bg-white rounded-full px-5 py-1" placeholder="Search" />
                </form>

                <div className='flex basis-1/12'>
                    <button className='py-1 px-5 rounded-md text-slate-100'>Login</button>
                    <Button text="Sign Up" />
                </div>


            </nav>
        </header>
    )
}

export default Header