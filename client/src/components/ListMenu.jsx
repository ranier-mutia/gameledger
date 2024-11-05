import React, { useEffect, useState, useRef } from 'react'
import ListForm from './ListForm.jsx';
import axios from 'axios';

const ListMenu = (props) => {

    const [game, setGame] = useState();
    const controllerRef = useRef();
    const listMenuRef = useRef();

    const onClickHandler = () => {
        props.onListCloseHandler();
    }

    function outsideClickHandler(e) {
        if (props.isShown && !listMenuRef.current?.contains(e.target)) {
            props.onListCloseHandler();
        }
    }

    useEffect(() => {

        const getGame = async (signal) => {

            const slug = props.slug;

            await axios.post('http://localhost:3000/games/getGame', { slug }, { signal })
                .then((response) => {
                    setGame(response.data);

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

        getGame(signal);

        if (props.isShown) {
            document.body.style.overflow = 'hidden';
        }

        !props.isShown ? document.body.style.overflow = 'unset' : null;

        document.addEventListener('mousedown', outsideClickHandler);

        return () => {
            document.removeEventListener('mousedown', outsideClickHandler);
            controllerRef.current.abort();
        };

    }, [props.isShown]);



    if (props.isShown) {
        return (
            <div className='fixed top-0 left-0 flex justify-center items-center h-screen w-screen bg-opacity-80 bg-black z-50'>

                <div className={`relative bg-gray-800 w-full h-full sm:rounded-xl ${game ? 'sm:h-auto' : 'sm:h-2/5'} sm:min-h-96 sm:w-4/5 md:w-3/5 xl:w-2/5 pb-8 shadow-xl overflow-y-auto sm:overflow-y-visible`} ref={listMenuRef}>

                    <div className='absolute w-full h-8 flex justify-end top-1 right-1'>
                        <button className='text-blue-300 rounded-lg px-1 hover:bg-gray-500 hover:bg-opacity-25 hover:text-blue-400 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]' onClick={onClickHandler}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {game ?
                        <div className='overflow-hidden'>
                            <div className='flex h-auto min-h-56 sm:min-h-36 w-full sm:max-h-[24rem] bg-gray-600 sm:rounded-t-xl'>
                                {game.artwork ? <img src={game.artwork} alt={game.name} className="h-auto min-h-36 w-full sm:rounded-t-xl" /> : game.screenshot ? <img src={game.screenshot} alt={game.name} className="h-auto min-h-36 w-full sm:rounded-t-xl" /> : <div className='content-center  mx-auto text-white pt-3'>No Cover</div>}
                            </div>

                            <div className="absolute z-20 top-16 left-1/2 -translate-x-1/2 sm:transform-none sm:top-14 sm:left-10 flex justify-center align-middle h-40 w-32 bg-gray-600 rounded-xl border border-gray-800 shadow-xl">
                                {(game.cover ? <img className="object-fill h-full w-full rounded-xl " src={game.cover.urlBig} alt={game.name} />
                                    : <div className='content-center text-white'>No Cover</div>)}
                            </div>

                            <div className='w-full absolute z-10 top-40 sm:bottom-0 '>
                                <div className='flex flex-col h-5/6 sm:h-auto bg-gray-800 sm:rounded-b-xl'>
                                    <div className='font-medium z-20 text-center sm:text-left text-blue-400 text-xl my-1 sm:ps-36 mt-16 sm:mt-3 mx-10 sm:me-10'>{game.name}</div>

                                    <ListForm isShown={props.isShown} listData={props.listData} favoriteData={props.favoriteData} gameID={game.id} onListCloseHandler={props.onListCloseHandler} updateData={props.updateData} />
                                </div>
                            </div>
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
            </div>
        )
    }

}

export default ListMenu