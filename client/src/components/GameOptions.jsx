import React, { useEffect, useState, useContext, useRef } from 'react'
import { Transition } from '@headlessui/react'
import { useUserContext } from '../hooks/UserContext.jsx'
import LoginContext from '../hooks/LoginContext.jsx'
import ListContext from '../hooks/ListContext.jsx'
import axios from 'axios'

const GameOptions = (props) => {

    const [isShown, setIsShown] = useState(false);
    const [isShownStatus, setIsShownStatus] = useState(false);
    const [listData, setListData] = useState("");
    const [favoriteData, setFavoriteData] = useState("");
    const [isLoading, setIsLoading] = useState({
        setFavorite: false,
        list: false,
        getFavorite: false
    });

    const user = useUserContext();
    const showLoginMenu = useContext(LoginContext);
    const showListMenu = useContext(ListContext);

    const menuRef = useRef();
    const controllerRef = useRef();

    const onClickHandler = () => {

        setIsShownStatus(false)
        setIsShown(!isShown);

    }

    const isLoggedIn = () => {
        if (user.loggedIn) {
            return true
        } else {
            showLoginMenu();
            return false
        }
    }

    const onListClickHandler = () => {
        if (!isLoggedIn()) return

        showListMenu(true, props.slug, listData, favoriteData);
    }

    const onStatusClickHandler = () => {
        if (!isLoggedIn()) return

        setIsShownStatus(true);
    }

    const onStatusSelectHandler = async (e) => {

        const id = listData.id ? listData.id : "";

        await axios.post('http://localhost:3000/lists/setStatus', { id: id, gameID: props.id, email: user.email, status: e.target.id })
            .then((response) => {
                setListData(response.data);
                setIsShownStatus(false);
            })
            .catch((error) => {
                if (error.code != "ERR_CANCELED") {
                    console.log(error);
                }
            });
    }

    const onFavoriteClickHandler = async () => {
        if (!isLoggedIn()) return

        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        setIsLoading((prev) => ({ ...prev, setFavorite: true }));

        const id = favoriteData.id ? favoriteData.id : "";

        await axios.post('http://localhost:3000/favorites/setFavorite', { id: id, email: user.email, gameID: props.id }, { signal })
            .then((response) => {
                setFavoriteData(response.data)
                setIsLoading((prev) => ({ ...prev, setFavorite: false }));
            })
            .catch((error) => {
                if (error.code != "ERR_CANCELED") {
                    console.log(error);
                }
            });

    }

    const onReviewClickHandler = () => {
        if (!isLoggedIn()) return


    }

    function outsideClickHandler(e) {
        if (isShown && !menuRef.current?.contains(e.target)) {
            setIsShown(!isShown);
        }
    }

    const getListData = async (email, id, signal) => {

        setIsLoading((prev) => ({ ...prev, list: true }));

        await axios.post('http://localhost:3000/lists/getListData', { email, id }, { signal })
            .then((response) => {
                setListData(response.data);
                setIsLoading((prev) => ({ ...prev, list: false }));
            })
            .catch((error) => {
                if (error.code != "ERR_CANCELED") {
                    console.log(error);
                }
            });

    }

    const getFavoriteData = async (email, id, signal) => {

        setIsLoading((prev) => ({ ...prev, getFavorite: true }));

        await axios.post('http://localhost:3000/favorites/getFavoriteData', { email, id }, { signal })
            .then((response) => {
                setFavoriteData(response.data);
                setIsLoading((prev) => ({ ...prev, getFavorite: false }));
            })
            .catch((error) => {
                if (error.code != "ERR_CANCELED") {
                    console.log(error);
                }
            });

    }

    useEffect(() => {

        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        if (isShown && user.loggedIn) {
            getListData(user.email, props.id, signal);
            getFavoriteData(user.email, props.id, signal);
        }

        document.addEventListener('mousedown', outsideClickHandler);
        return () => {
            document.removeEventListener('mousedown', outsideClickHandler);
            controllerRef.current.abort();
        };

    }, [isShown]);

    if (props.type == "card") {
        return (
            <div>
                <button type='button' className='absolute bg-gray-900 xl:hidden group-hover:flex h-8 w-10 top-0 right-0 rounded-tr-xl rounded-bl-xl border border-gray-900 shadow-xl flex flex-row space-x-1 justify-center items-center group/option' onClick={onClickHandler}>
                    <div className='h-1 w-1 rounded-full bg-gray-400 group-hover/option:bg-gray-300'></div>
                    <div className='h-1 w-1 rounded-full bg-gray-400 group-hover/option:bg-gray-300'></div>
                    <div className='h-1 w-1 rounded-full bg-gray-400 group-hover/option:bg-gray-300'></div>
                </button>

                <Transition show={isShown}
                    enter='transition-all origin-top-right duration-250 '
                    enterFrom='scale-0 rounded-bl-full right-1 top-1'
                    enterTo="scale-full rounded-bl-none right-0 top-0"
                    leave="transition-all origin-top-right duration-250 "
                    leaveFrom="scale-full rounded-bl-none right-0 top-0"
                    leaveTo="scale-0 rounded-bl-full right-1 top-1"
                >
                    <div className='absolute w-full h-40 sm:h-60 bg-gray-900 rounded-t-xl border-b border-b-gray-700 p-1' ref={menuRef}>

                        {!isLoading.list && !isLoading.getFavorite ?
                            <div>
                                <div className='w-full h-8 flex justify-between'>
                                    <button className={`text-slate-300  rounded-lg px-1 hover:bg-slate-800 ${!isShownStatus && 'collapse'}`} onClick={() => setIsShownStatus(false)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                                        </svg>
                                    </button>
                                    <button className='text-slate-300 rounded-lg px-1 hover:bg-slate-800' onClick={onClickHandler}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                {!isShownStatus ?
                                    <ul className='text-gray-300 text-center divide-y divide-gray-700 select-none'>
                                        <li className={`hover:bg-gray-800 p-0.5 sm:p-3 ${user.loggedIn && listData && 'text-blue-400'}`} onClick={onListClickHandler}>{user.loggedIn && listData ? "Update List" : "Add to List"}</li>
                                        <li className={`hover:bg-gray-800 p-0.5 sm:p-3 ${user.loggedIn && listData.status && 'text-blue-400'}`} onClick={onStatusClickHandler}>{user.loggedIn && listData.status ? "Update Status" : "Set Status"}</li>
                                        {!isLoading.setFavorite ?
                                            <li className={`hover:bg-gray-800 p-0.5 sm:p-3 ${user.loggedIn && favoriteData && 'text-red-300'}`} onClick={onFavoriteClickHandler}>{user.loggedIn && favoriteData ? "Unfavorite" : "Add to Favorites"}</li>
                                            :
                                            <div className='flex justify-center my-auto w-full h-full items-center p-1.5 sm:p-3'>
                                                <svg aria-hidden="true" className="w-4 h-4 sm:w-6 sm:h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                </svg>
                                            </div>
                                        }

                                        <li className='hover:bg-gray-800 p-0.5 sm:p-3'>Make a review</li>
                                    </ul>
                                    :
                                    <ul className='text-gray-300 text-center divide-y divide-gray-700 select-none' onClick={onStatusSelectHandler}>
                                        <li id='plan' className={`hover:bg-gray-800 p-2 sm:p-5 ${listData.status == "plan" && 'text-blue-400'}`}>Plan to play</li>
                                        <li id='playing' className={`hover:bg-gray-800 p-2 sm:p-5 ${listData.status == "playing" && 'text-blue-400'}`}>Playing</li>
                                        <li id='played' className={`hover:bg-gray-800 p-2 sm:p-5 ${listData.status == "played" && 'text-blue-400'}`}>Played</li>
                                    </ul>
                                }

                            </div>

                            :
                            <div className='flex justify-center my-auto w-full h-full items-center'>
                                <svg aria-hidden="true" className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                            </div>
                        }

                    </div>
                </Transition>

            </div>
        )
    } else {
        return (
            <div>
                {isShown &&
                    <button type="button" className='text-slate-300 absolute top-0 right-0 flex bg-black h-full shadow-xl w-8 rounded-e-lg px-1  justify-center items-center flex-col ' onClick={onClickHandler} >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                }
                {!isShown &&
                    <button type='button' className={`absolute top-0 right-0 bg-black group-hover:flex h-full w-8 rounded-e-lg border border-black shadow-xl hidden flex-col space-y-1 justify-center items-center group/option ${isShown && 'hidden'}`} onClick={onClickHandler}>
                        <div className='h-1 w-1 rounded-full bg-gray-400 group-hover/option:bg-gray-300'></div>
                        <div className='h-1 w-1 rounded-full bg-gray-400 group-hover/option:bg-gray-300'></div>
                        <div className='h-1 w-1 rounded-full bg-gray-400 group-hover/option:bg-gray-300'></div>
                    </button>
                }

                <Transition show={isShown}
                    enter='transition-all origin-right duration-250 '
                    enterFrom='scale-x-0 right-5'
                    enterTo="scale-x-full right-8"
                    leave="transition-all origin-right duration-250 "
                    leaveFrom="scale-x-full right-8"
                    leaveTo="scale-x-0 right-5"
                >
                    <div className='z-10 h-52 w-60 absolute -top-1/2 bg-gray-900 rounded-lg p-1 border border-gray-700' ref={menuRef}>

                        {!isLoading.list && !isLoading.getFavorite ?

                            <div>

                                {!isShownStatus ?
                                    <ul className='text-gray-300 text-center divide-y divide-gray-700 select-none'>
                                        <li className={`hover:bg-gray-800 p-0.5 sm:p-3 ${user.loggedIn && listData && 'text-blue-400'}`} onClick={onListClickHandler}>{user.loggedIn && listData ? "Update List" : "Add to List"}</li>
                                        <li className={`hover:bg-gray-800 p-0.5 sm:p-3 ${user.loggedIn && listData.status && 'text-blue-400'}`} onClick={onStatusClickHandler}>{user.loggedIn && listData.status ? "Update Status" : "Set Status"}</li>
                                        {!isLoading.setFavorite ?
                                            <li className={`hover:bg-gray-800 p-0.5 sm:p-3 ${user.loggedIn && favoriteData && 'text-red-300'}`} onClick={onFavoriteClickHandler}>{user.loggedIn && favoriteData ? "Unfavorite" : "Add to Favorites"}</li>
                                            :
                                            <div className='flex justify-center my-auto w-full h-full items-center p-1.5 sm:p-3'>
                                                <svg aria-hidden="true" className="w-4 h-4 sm:w-6 sm:h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                </svg>
                                            </div>
                                        }

                                        <li className='hover:bg-gray-800 p-0.5 sm:p-3'>Make a review</li>
                                    </ul>
                                    :
                                    <div>
                                        <button className={`text-slate-300 m-1 rounded-lg px-1 hover:bg-slate-800 ${!isShownStatus && 'collapse'}`} onClick={() => setIsShownStatus(false)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                                            </svg>
                                        </button>
                                        <ul className='text-gray-300 text-center divide-y divide-gray-700 select-none' onClick={onStatusSelectHandler}>
                                            <li id='plan' className={`hover:bg-gray-800 p-3.5 ${listData.status == "plan" && 'text-blue-400'}`}>Plan to play</li>
                                            <li id='playing' className={`hover:bg-gray-800 p-4 ${listData.status == "playing" && 'text-blue-400'}`}>Playing</li>
                                            <li id='played' className={`hover:bg-gray-800 p-4 ${listData.status == "played" && 'text-blue-400'}`}>Played</li>
                                        </ul>
                                    </div>
                                }
                            </div>

                            :
                            <div className='flex justify-center my-auto w-full h-full items-center'>
                                <svg aria-hidden="true" className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                            </div>

                        }

                    </div>

                </Transition>

            </div>
        )
    }

}

export default GameOptions