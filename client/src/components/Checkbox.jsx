import React from 'react'

const Checkbox = (props) => {

    return (
        <li>
            <div className="flex items-center p-2 rounded hover:bg-gray-700 select-none">
                <input id={props.item.id} type="checkbox" checked={props.item.isChecked} value={props.item.id} className="w-4 h-4 rounded" onChange={props.handleChange} />
                <label htmlFor={props.item.id} className="w-full ms-2 text-sm rounded text-gray-200">{props.item.name}</label>
            </div>
        </li>
    )
}

export default Checkbox