import React from 'react'

const Button = (props) => {
    return (
        <div className="flex justify-center">
            <button className="bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 py-1 px-5 font-bold rounded-md text-slate-100 text-nowrap">{props.text}</button>
        </div>
    )
}

export default Button