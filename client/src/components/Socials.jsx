import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'
import SocialCard from './SocialCard';
import { Transition } from '@headlessui/react';
import axios from 'axios';

const Socials = (props) => {

    const [socials, setSocials] = useState([]);
    const [isLoading, setIsLoading] = useState({
        init: true,
        more: false
    });
    const [offset, setOffset] = useState(0);
    const [hasNext, setHasNext] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState("followers");

    const menuRef = useRef();

    const controllerRef = useRef();

    const navigate = useNavigate()

    const serverURL = import.meta.env.VITE_REACT_APP_SERVER_BASEURL;

    const onSocialClickHandler = (username, userID) => {

        setSocials([])
        setOffset(0);
        setHasNext(true);

        props.resetSelected();
        navigate("/user/" + username, { state: { id: userID } });
    }

    const onDownClickHandler = () => {
        setIsOpen(true);
    }

    const onUpClickHandler = () => {
        setIsOpen(false);
    }

    useEffect(() => {
        document.addEventListener('mousedown', outsideClickHandler);
        return () => {
            document.removeEventListener('mousedown', outsideClickHandler);
        };
    }, [isOpen]);

    function outsideClickHandler(e) {
        if (isOpen && !menuRef.current?.contains(e.target)) {
            setIsOpen(false);
        }
    }


    const loadingCard = (count) => {

        let cards = []

        for (let i = 0; i < count; i++) {
            cards.push(<SocialCard key={i} isLoading={true} />)
        }

        return cards;

    }

    const onFilterClickHandler = (e) => {
        setIsOpen(false);
        setFilter(e.target.id)

        setSocials([])
        setOffset(0);
        setHasNext(true);

    }

    const getSocials = async (signal) => {

        if (hasNext) {

            setIsLoading(prev => ({ ...prev, more: true }));

            await axios.post('http://localhost:3000/follows/getSocials', { id: props.user.id, filter, offset }, { signal })
                .then((response) => {

                    const nextOffset = response.data.length - 20;
                    const result = response.data.slice(0, 20);

                    setSocials((prev) => [...prev, ...result]);
                    setOffset(prevOffset => prevOffset + 20);
                    setIsLoading(prev => ({ ...prev, init: false, more: false }));

                    if (nextOffset <= 0) { setHasNext(false) }
                })
                .catch((error) => {
                    if (error.code != "ERR_CANCELED") {
                        console.log(error);
                    }
                });
        }

    }

    useEffect(() => {
        if (!props.user) return

        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        setIsLoading(prev => ({ ...prev, init: true }));

        getSocials(signal);

        return () => controllerRef.current.abort();

    }, [filter]);

    useEffect(() => {

        const handleScroll = () => {
            const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

            if (scrollTop + clientHeight >= scrollHeight - 20) {

                if (controllerRef.current) {
                    controllerRef.current.abort();
                }

                controllerRef.current = new AbortController();
                const signal = controllerRef.current.signal;

                getSocials(signal);
            }
        };

        if (!isLoading.more) {
            window.addEventListener("scroll", handleScroll);
        }

        return () => {
            window.removeEventListener("scroll", handleScroll);

        };
    }, [isLoading.more]);

    useEffect(() => {
        if (!props.user) return

        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        setIsLoading(prev => ({ ...prev, init: true }));

        getSocials(signal);

        return () => controllerRef.current.abort();

    }, [props.user]);

    return (
        <div className='p-2 sm:p-4'>

            <div className="h-8 w-40 relative">

                {!isOpen &&
                    <button type='button' className="z-10 w-full h-10 bg-blue-500 hover:bg-blue-700 focus:outline-none py-1 px-5  rounded-lg text-white items-center flex space-x-2" onClick={onDownClickHandler}>
                        <div>{filter.toLocaleUpperCase()}</div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 absolute right-3">
                            <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
                        </svg>
                    </button>
                }
                {isOpen &&
                    <button type='button' className="z-10 w-full h-10 bg-blue-500 hover:bg-blue-700 focus:outline-none py-1 px-5  rounded-lg text-white items-center flex space-x-2" onClick={onUpClickHandler}>
                        <div>{filter.toLocaleUpperCase()}</div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 scale-y-[-1] absolute right-3">
                            <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
                        </svg>
                    </button>
                }

                <Transition show={isOpen}
                    enter='transition-all origin-top duration-250 '
                    enterFrom='scale-y-0'
                    enterTo="scale-y-full"
                    leave="transition-all origin-top duration-250 "
                    leaveFrom="scale-y-full "
                    leaveTo="scale-y-0"
                >

                    <div id="userMenu" className="z-30 top-10 absolute w-full bg-black rounded-b-lg p-1 shadow-xl divide-y divide-gray-400" ref={menuRef}>
                        <ul className="text-gray-300 text-center divide-y divide-gray-700 select-none w-full h-auto" onClick={onFilterClickHandler}>

                            {filter != "followers" && <li id="followers" className='p-1 ps-2 rounded hover:bg-gray-800'>Followers</li>}
                            {filter != "following" && <li id="following" className='p-1 ps-2 rounded hover:bg-gray-800'>Following</li>}

                        </ul>
                    </div>

                </Transition>
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-4 mt-6 rounded-xl`}>
                {socials && socials.map((item, i) => {
                    return (
                        < SocialCard key={item.id} social={item} img={`${serverURL}uploads/profile_pictures/${item.profile_picture}`} onSocialClickHandler={onSocialClickHandler} />
                    )
                })}
                {isLoading.init && loadingCard(20)}
                {isLoading.more && loadingCard(2)}
            </div>

            {!isLoading.init && socials.length == 0 && <div className='w-full flex justify-center text-slate-400 bg-gray-900 p-4 rounded-xl'>{filter == "followers" ? 'No followers' : 'No following'}</div>}

        </div>
    )
}

export default Socials