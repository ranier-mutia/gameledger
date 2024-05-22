import React, { useEffect, useRef, useState } from 'react'
import { Transition } from '@headlessui/react'
import axios from 'axios'

const Card = (props) => {

    const [isMouseOver, setIsMouseOver] = useState(false);
    const [placement, setPlacement] = useState();
    const [gameInfo, setGameInfo] = useState();

    var hoverTimeOut;

    var cardRef = useRef();
    const controllerRef = useRef();


    const onMouseEnterHandler = () => {

        hoverTimeOut = setTimeout(() => {
            const cardPos = cardRef.current.getBoundingClientRect();

            const centerX = cardPos.left + cardPos.width / 2
            const centerY = cardPos.top + cardPos.height / 2

            const left = centerX / window.innerWidth;
            const right = (window.innerWidth - centerX) / window.innerWidth;
            const top = centerY / window.innerHeight;
            const bottom = (window.innerHeight - centerY) / window.innerHeight;

            if (top < 0.2 || bottom < 0.2) {
                if (right < 0.2) {
                    top < bottom ? setPlacement('-inset-x-full my-3 top-full right-full') : setPlacement('-inset-x-full my-3 bottom-full right-full')
                } else {
                    top < bottom ? setPlacement('-inset-x-1/2 my-3 top-full') : setPlacement('-inset-x-1/2 my-3 bottom-full')
                }
            } else {
                left < right ? setPlacement('inset-y-0 mx-3 left-full') : setPlacement('inset-y-0 mx-3 right-full')
            }

            setIsMouseOver(true);
        }, 500)

    }

    const onMouseLeaveHandler = () => {
        setIsMouseOver(false);
        clearTimeout(hoverTimeOut);
    }


    useEffect(() => {

        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        if (isMouseOver && window.innerWidth >= 1280) {

            const id = cardRef.current.children['gameID'].value;

            const getGameInfo = async (id, signal) => {

                await axios.post('http://localhost:3000/games/getGameInfo', { id }, { signal })
                    .then((response) => {
                        setGameInfo(response.data[0]);
                    })
                    .catch((error) => {
                        if (error.code != "ERR_CANCELED") {
                            console.log(error);
                        }

                    });
            }

            getGameInfo(id, signal);

        }


        return () => controllerRef.current.abort();

    }, [isMouseOver])


    if (props.isLoading) {
        return (

            <div className='relative bg-gray-800 border-slate-900 shadow-2xl rounded-xl w-full sm:w-40 xl:w-full animate-pulse'>
                <div className="h-40 sm:h-60"></div>
                <div className="p-2 min-h-[3.5rem] me-3 space-y-3">
                    <div className='flex space-x-3'>
                        <div className="h-2 bg-slate-700 rounded basis-3/4"></div>
                        <div className="h-2 bg-slate-700 rounded basis-1/4"></div>
                    </div>
                    <div className="h-2 bg-slate-700 rounded"></div>
                </div>

            </div>
        )

    } else {
        return (
            <div className='relative bg-gray-800 hover:bg-gray-900 shadow-2xl border-slate-900 rounded-xl cursor-pointer w-full sm:w-40 xl:w-full group' ref={cardRef}>

                <input type="hidden" id="gameID" name='gameID' value={props.id} />

                <div onMouseEnter={onMouseEnterHandler} onMouseLeave={onMouseLeaveHandler}>

                    {props.title == "BEST" ? <div className='border border-blue-600 bg-blue-500 group-hover:bg-blue-600 w-10 h-10 absolute rounded-full -m-1.5 text-center content-center text-white font-medium text-md'>#{props.rank}</div> : null}

                    <div className="flex justify-center align-middle h-40 sm:h-60 bg-gray-600 rounded-t-xl">
                        {(props.img ? <img className="object-fill h-full w-full rounded-t-xl " src={props.img} alt={props.name} />
                            : <div className='content-center text-white'>Cover Missing</div>)}
                    </div>

                    <div className="text-white text-sm p-2 min-h-[3.5rem] me-3">{props.name}</div>

                </div>

                <Transition show={isMouseOver}
                    enter='transition-opacity duration-250'
                    enterFrom='opacity-0'
                    enterTo="opacity-100"
                    leave="transition-opacity duration-250"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className={`absolute hidden xl:flex bg-gray-800 h-80 w-80 m-auto z-20 rounded-xl shadow-xl border border-gray-900 ${placement}`}>

                        {gameInfo ?
                            <div className='flex-col w-full text-white'>

                                <h1 className='flex mx-5 my-3 font-medium text-sm'>{gameInfo.name} <span className='font-normal text-slate-300 ms-1'> {'(' + gameInfo.release_date + ')'}</span></h1>

                                <div className='flex justify-center mx-5 bg-gray-700' >
                                    {gameInfo.artwork ? <img className="object-fill h-40 w-full" src={gameInfo.artwork} alt={gameInfo.name} /> : <div className='content-center h-40 text-white'>Image Missing</div>}

                                </div>
                                <div className='mx-5 my-3 flex flex-wrap'>
                                    {gameInfo.genres && gameInfo.genres.map((item, i) => {
                                        return (
                                            <span key={item.id} className='border-2 border-blue-600 rounded-full px-2 py-1 me-1 mb-1 text-xs '>{item.name}</span>
                                        )
                                    })}
                                </div>

                            </div>
                            : <div className='flex justify-center my-auto w-full '>
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

export default Card