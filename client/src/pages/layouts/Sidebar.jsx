import React, { useRef, useEffect } from 'react'
import Nav from './Nav'
import Footer from './Footer'

const Sidebar = (props) => {

    const sideBarRef = useRef();

    function outsideClickHandler(e) {
        if (!props.isHidden && !sideBarRef.current?.contains(e.target)) {
            props.onClickHandler();
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', outsideClickHandler);
        return () => {
            document.removeEventListener('mousedown', outsideClickHandler);
        };
    }, [props.isHidden]);

    return (
        <div className={`w-[17rem] h-full fixed z-30 ease-in-out duration-200 xl:flex xl:z-10 xl:transform-none ${props.isHidden ? '-translate-x-full' : 'translate-x-0'}`} ref={sideBarRef}>

            <div className='flex-col content-between w-full h-full bg-gray-800 xl:bg-gray-700'>
                <Nav onClickHandler={props.onClickHandler} />
                <Footer />
            </div>
            <div className='bg-gray-500 h-full w-[0.01rem]'></div>
        </div>
    )
}

export default Sidebar