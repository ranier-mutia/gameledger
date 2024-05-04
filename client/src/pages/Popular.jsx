import React from 'react'
import Dropdown from '../components/Dropdown'
import Card from '../components/Card'

const Popular = () => {

    const cardNum = [1, 2, 3, 4, 5, 6];

    return (
        <div className='px-8 py-2'>
            <div className="flex justify-items-start space-x-5">
                <Dropdown name="platform" label="Platform" />
                <Dropdown name="genre" label="Genre" />
            </div >

        </div>



    )
}

export default Popular