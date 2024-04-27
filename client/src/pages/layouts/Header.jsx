import React from 'react'
import Button from '../../components/Button.jsx'

const Header = () => {
    return (
        <header className='fixed z-20 bg-gray-800 w-screen'>
            <nav className="flex justify-between py-4 px-10">

                <div className="flex justify-center"><h1 className='text-blue-400 font-bold text-xl'>GAMEPARK</h1></div>

                <form className='flex justify-center grow'>
                    <input type="text" name="search" className="flex basis-4/12 bg-white rounded-full px-5 py-1" placeholder="Search" />
                </form>


                <Button text="Login" />

            </nav>
        </header>
    )
}

export default Header