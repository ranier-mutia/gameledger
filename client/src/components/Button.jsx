import React from 'react'

const Button = (props) => {
    return (
        <div className="flex justify-center">
            <button className="bg-blue-400 py-1 px-5 font-bold rounded-md">{props.text}</button>
        </div>
    )
}

export default Button