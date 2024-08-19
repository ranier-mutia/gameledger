import React from 'react'
import Search from '../../components/Search.jsx'
import Logo from '../../components/Logo.jsx'
import { Link } from 'react-router-dom'
import { useUserContext } from '../../hooks/UserContext.jsx'
import UserMenu from '../../components/UserMenu.jsx'

const Header = (props) => {

    const user = useUserContext();

    return (
        <header className='fixed z-40 bg-gray-800 w-full shadow-xl'>
            <nav className="flex justify-between py-3 px-3 xl:px-6">

                <div className="flex basis-1/12 md:pe-1 lg:pe-18 ">

                    <button className='xl:hidden text-slate-300 rounded-lg hover:bg-slate-700 px-1 me-1' onClick={props.onMenuClickHandler}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>

                    <Link to='/' className='flex space-x-1 cursor-pointer'>
                        <Logo />

                        <button className='text-blue-400 font-bold text-lg hidden sm:block'>GameLedger</button>
                    </Link>

                </div>

                <Search />

                <div className='flex justify-end basis-1/12 space-x-2'>
                    <button className='xl:hidden text-slate-300 rounded-lg hover:bg-slate-700 p-1 px-2'>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" ><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </button>
                    <div className="flex justify-center items-center">
                        {user.loggedIn ?

                            <UserMenu logout={props.logout} />

                            : <button className="bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 py-1 px-5 font-bold rounded-md text-slate-100 text-nowrap" onClick={props.onLoginClickHandler}>Login</button>
                        }
                    </div>
                </div>

            </nav>
        </header>
    )
}

export default Header