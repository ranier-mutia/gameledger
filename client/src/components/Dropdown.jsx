import React, { useState, useEffect, useRef } from 'react'
import Checkbox from './Checkbox'


const Dropdown = (props) => {

    const [checkBox, setCheckBox] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef();
    const buttonRef = useRef();
    const controllerRef = useRef();

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

    function handleChange(e) {

        if (!e.target.checked) {

            setCheckBox(prev => prev.map(item => item.id == e.target.value ? { ...item, isChecked: false } : item));

        } else {

            setCheckBox(prev => prev.map(item => item.id == e.target.value ? { ...item, isChecked: true } : item));

        }
    }

    useEffect(() => {

        document.addEventListener('mousedown', outsideClickHandler);
        return () => {
            document.removeEventListener('mousedown', outsideClickHandler);
        };
    }, [isOpen]);

    useEffect(() => {
        if (props.checkBox) {
            props.checkBox.map((item, i) => {
                item.isChecked = true;
            })
            setCheckBox(props.checkBox);

        }

    }, [props.checkBox]);

    useEffect(() => {

        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        if (checkBox && isOpen) {

            const ids = checkBox.filter((item) => item.isChecked == true).map(i => { return i.id });
            props.dropDownHandler(JSON.stringify(ids), signal);

        }

        return () => controllerRef.current.abort();

    }, [checkBox])



    return (
        <div className='flex-col w-full' >
            <button id={props.id} data-dropdown-toggle="dropdownFilter" className="text-white border-2 border-blue-500 hover:bg-blue-500 focus:ring-1 focus:outline-none focus:ring-blue-600 focus:bg-blue-500 font-medium rounded-lg text-sm px-5 py-1 text-center inline-flex items-center" type="button" onClick={onCLickHandler} ref={buttonRef}>
                {props.label}
                <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
            </button>

            {isOpen && (
                <div id={props.id + "Menu"} className="z-10 rounded-lg shadow-2xl bg-gray-800 mt-2 absolute w-11/12 sm:w-2/3 lg:w-1/2 xl:w-48" ref={menuRef}>
                    <ul className="p-3 text-sm text-gray-200" aria-labelledby="dropdownFilterButton" >
                        {checkBox && checkBox.map((item, i) => {
                            return (<Checkbox key={item.id} item={item} handleChange={handleChange} />)
                        })}

                    </ul>
                </div>
            )}
        </div >
    )
}

export default Dropdown