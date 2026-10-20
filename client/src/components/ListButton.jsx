import React, { useRef, useEffect, useState } from 'react'
import { Transition } from '@headlessui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export function ListButton(props) {

    const [listData, setListData] = useState("");
    const [isShown, setIsShown] = useState(false);
    const [reviewData, setReviewData] = useState("");
    const [favoriteData, setFavoriteData] = useState("");
    const [isLoading, setIsLoading] = useState({
        setFavorite: false,
        getList: false,
        getReview: false
    });

    const dropdownRef = useRef(null);
    const controllerRef = useRef();

    const navigate = useNavigate();

    const isLoggedIn = () => {
        if (props.user.loggedIn) {
            return true
        } else {
            props.showLoginMenu();
            return false
        }
    }

    const onListClickHandler = () => {
        if (!isLoggedIn()) return

        props.showListMenu(props.game.slug, listData, favoriteData, reviewData);
    }

    const onListDropdownClickHandler = () => {
        setIsShown((prev) => !prev);
    }

    const onStatusSelectHandler = async (e) => {
        if (!isLoggedIn()) return

        const id = listData.id ? listData.id : "";
        const status = e.target.id;

        setIsShown(false);

        let route = '';
        let data = {};
        if(status == 'plan' && listData.status == 'plan' && !props.game.isReleased){
            route ='http://localhost:3000/lists/deleteListData';
            data = { id: id };
        } else {
            route = 'http://localhost:3000/lists/setStatus';
            data = { id: id, gameID: props.game.id, email: props.user.email, status: status }
        }

        await axios.post(route, data)
            .then((response) => {
                setListData(response.data);
            })
            .catch((error) => {
                if (error.code != "ERR_CANCELED") {
                    console.log(error);
                }
            });

    }

    const onReviewClickHandler = () => {
        if (!isLoggedIn()) return

        reviewData ? navigate("/review/edit/" + reviewData.id, { state: { id: reviewData.id, type: "edit" } }) : navigate("/review/new/" + props.game.slug, { state: { id: props.game.id, type: "new" } });

    }

    const onHeartClickHandler = async () => {
        if (!isLoggedIn()) return

        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        const id = favoriteData.id ? favoriteData.id : "";

        setIsLoading((prev) => ({ ...prev, setFavorite: true }));

        await axios.post('http://localhost:3000/preferences/setFavorite', { id: id, email: props.user.email, gameID: props.game.id }, { signal })
            .then((response) => {
                setFavoriteData(response.data);
                setIsLoading((prev) => ({ ...prev, setFavorite: false }));
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

        getFavoriteData(signal);
        getListData(signal);
    }, [props.triggerUpdate])

    const getFavoriteData = async (signal) => {

        setIsLoading((prev) => ({ ...prev, getFavorite: true }));

        await axios.post('http://localhost:3000/preferences/getFavoriteData', { email: props.user.email, id: props.game.id }, { signal })
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

    const getListData = async (signal) => {

        setIsLoading((prev) => ({ ...prev, getList: true }));

        await axios.post('http://localhost:3000/lists/getListData', { email: props.user.email, id: props.game.id }, { signal })
            .then((response) => {
                setListData(response.data);
                setIsLoading((prev) => ({ ...prev, getList: false }));
            })
            .catch((error) => {
                if (error.code != "ERR_CANCELED") {
                    console.log(error);
                }
            });

    }

    useEffect(() => {
        if (!props.game || !props.user.loggedIn) return

        const getReviewData = async (signal) => {

            setIsLoading((prev) => ({ ...prev, getReview: true }));

            await axios.post('http://localhost:3000/reviews/getReviewData', { email: props.user.email, id: props.game.id }, { signal })
                .then((response) => {
                    setReviewData(response.data);
                    setIsLoading((prev) => ({ ...prev, getReview: false }));
                })
                .catch((error) => {
                    if (error.code != "ERR_CANCELED") {
                        console.log(error);
                    }
                });

        }

        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        getFavoriteData(signal);
        getListData(signal);
        getReviewData(signal);

        return () => controllerRef.current.abort();

    }, [props.game])

    useEffect(() => {
        const outsideClickHandler = (event) => {
            // If click is outside the entire dropdown container (button + menu), close it
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsShown(false);
            }
        };

        if (isShown) {
            document.addEventListener('mousedown', outsideClickHandler);
        }

        return () => {
            document.removeEventListener('mousedown', outsideClickHandler);
        };
    }, [isShown]);

    return (
        <div className='w-full flex justify-center items-center space-x-2 pt-2 sm:pt-0'>
            {!props.game?.isReleased ?
                <button id="plan" onClick={onStatusSelectHandler} type='button' className={`rounded-lg shadow-sm w-full text-gray-300 select-none text-xs md:text-sm text-nowrap z-10 h-7 md:h-8  focus:outline-none   py-1 px-3 font-medium ${listData.status == 'plan' ? 'bg-blue-600 hover:bg-blue-700 ' : 'bg-black hover:bg-gray-900 '}`}>{listData.status == 'plan' ? 'Planned to play' : 'Plan to play'}</button>
                :
                <div ref={dropdownRef} className="relative inline-flex rounded-lg shadow-sm w-full text-gray-300 select-none text-xs md:text-sm" role="group">
                    <button type='button' className="text-nowrap z-10 w-full h-7 md:h-8 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-800 py-1 px-3 font-medium rounded-s-lg" onClick={onListClickHandler}>
                        {props.user.loggedIn && listData ? "Update List" : "Add to List"}
                    </button>

                    <button type='button' className="z-10 w-10 h-7 md:h-8 bg-blue-500 hover:bg-blue-700 focus:outline-none py-1 px-3 font-medium rounded-e-lg text-white justify-items-center" onClick={onListDropdownClickHandler}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`h-5 w-5 ${isShown ? 'rotate-180' : ''} ${props.flow == 'up' ? '-scale-y-100' : ''}`}>
                            <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
                        </svg>
                    </button>

                    <Transition show={isShown}
                        enter={`transition-all ${props.flow == 'up' ? 'origin-bottom' : 'origin-top'} duration-250`}
                        enterFrom='scale-y-0'
                        enterTo="scale-y-full"
                        leave={`transition-all ${props.flow == 'up' ? 'origin-bottom' : 'origin-top'} duration-250`}
                        leaveFrom="scale-y-full "
                        leaveTo="scale-y-0"
                    >

                        <div className={`${props.flow == 'up' ? 'bottom-8 pb-2 rounded-t-lg' : 'top-8 pt-2 rounded-b-lg'} absolute w-full bg-gray-900   shadow-xl divide-y divide-gray-400`} >

                            <div className={`flex ${props.flow == 'up' ? 'flex-col-reverse divide-y-reverse' : 'flex-col'} divide-y-2 divide-slate-600`}>
                                <ul className={`text-gray-300 text-center divide-y divide-gray-700 select-none w-full h-auto p-1`} onClick={onStatusSelectHandler}>
                                    <li id='plan' className={`hover:bg-gray-800 p-1  ${listData.status == "plan" && 'text-blue-400'}`}>Plan to play</li>
                                    <li id="playing" className={`p-1 hover:bg-gray-800 cursor-pointer ${listData.status === "playing" ? "text-blue-400" : ""}`} > Playing </li>
                                    <li id="hold" className={`p-1 hover:bg-gray-800 cursor-pointer ${listData.status === "hold" ? "text-blue-400" : ""}`} > On Hold </li>
                                    <li id="completed" className={`p-1 hover:bg-gray-800 cursor-pointer ${listData.status === "completed" ? "text-blue-400" : ""}`} > Completed </li>
                                    <li id="dropped" className={`p-1 hover:bg-gray-800 cursor-pointer ${listData.status === "dropped" ? "text-blue-400" : ""}`} > Dropped </li>
                                </ul>

                                <ul className={`text-gray-300 text-center select-none w-full h-auto p-1`}>
                                    <li className={`p-1 hover:bg-gray-800 cursor-pointer ${props.user.loggedIn && reviewData && 'text-blue-400'}`} onClick={onReviewClickHandler}>{props.user.loggedIn && reviewData ? "Edit Review" : "Make a Review"}</li>
                                </ul>
                            </div>
                        </div>

                    </Transition>

                </div>
            }

            <button type='button' className={`h-7 md:h-8 ${favoriteData ? 'bg-red-500 hover:bg-red-600' : 'bg-black hover:bg-gray-900 '}  focus:outline-none  py-1 px-3 font-medium rounded-lg`} onClick={onHeartClickHandler} disabled={isLoading.setFavorite}>
                <svg xmlns="http://www.w3.org/2000/svg" fill={favoriteData ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className={`w-5 h-5 text-white  ${isLoading.setFavorite && 'animate-pulse'}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
            </button>

        </div>
    );
}