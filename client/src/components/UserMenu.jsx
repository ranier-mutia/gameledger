import React, { useState, useRef, useEffect } from 'react'
import { useUserContext } from '../hooks/UserContext';

const UserMenu = (props) => {

    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef();
    const buttonRef = useRef();

    const user = useUserContext();

    function onCLickHandler(e) {

        if (isOpen) {

            setIsOpen(false);
            buttonRef.current.blur();
        } else {
            setIsOpen(true);
        }

    }

    function outsideClickHandler(e) {
        if (isOpen && !menuRef.current?.contains(e.target)) {
            if (!buttonRef.current?.contains(e.target)) {
                setIsOpen(false)
            }
        }
    }

    useEffect(() => {

        document.addEventListener('mousedown', outsideClickHandler);
        return () => {
            document.removeEventListener('mousedown', outsideClickHandler);
        };
    }, [isOpen]);

    return (
        <div className="h-8 w-8">
            <button data-dropdown-toggle="userMenuButton" type="button" className='w-full h-full rounded-full hover:opacity-75 focus:opacity-75 select-none' onClick={onCLickHandler} ref={buttonRef}>

                <img className="rounded-full" src={"/profile_pictures/default.png"} alt="profile_picture" draggable="false" />

            </button>

            {isOpen && (
                <div id="userMenu" className="z-30 mt-3 absolute right-2" ref={menuRef}>
                    <ul className="p-2 sm:text-sm text-gray-300 select-none bg-gray-800 rounded-lg shadow-2xl border-gray-900 min-w-36" aria-labelledby="dropdownFilterButton" >
                        <li className='flex justify-center items-center text-blue-300 font-medium'>{user.username.toUpperCase()}</li>
                        <div className='bg-gray-500 h-[0.08rem] my-1'></div>
                        <li className='flex items-center p-1 ps-2 rounded hover:bg-gray-700'>Profile</li>
                        <li className='flex items-center p-1 ps-2 rounded hover:bg-gray-700'>My List</li>
                        <li className='flex items-center p-1 ps-2 rounded hover:bg-gray-700'>My Favorites</li>
                        <li className='flex items-center p-1 ps-2 rounded hover:bg-gray-700' onClick={props.logout}>Logout</li>
                    </ul>
                </div>
            )}


        </div>
    )
}

export default UserMenu