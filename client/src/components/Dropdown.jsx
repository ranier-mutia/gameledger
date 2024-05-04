import React from 'react'

const Dropdown = (props) => {
    return (
        <div className='basis-2/12'>
            <label className='font-semibold block drop-shadow-lg text-slate-200' htmlFor={props.name}>{props.label}</label>
            <select name={props.name} id={props.name} className='rounded-lg w-full p-2 mt-3'>
                <option value="pc">PC</option>
                <option value="ps5">PS5</option>
                <option value="ps4">PS4</option>
                <option value="switch">Switch</option>
                <option value="android">Android</option>
                <option value="ios">iOS</option>
            </select>
        </div>
    )
}

export default Dropdown