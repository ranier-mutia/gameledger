import React from 'react'

const Footer = () => {

    var year = new Date().getFullYear();

    return (
        <div className='flex-col content-end h-1/6 mx-5 pb-3'>
            <div className='flex justify-between text-sm text-slate-400'>
                <a href="#" className='hover:text-white cursor-pointer'>About</a>
                <a href="#" className='hover:text-white cursor-pointer'>Contact us</a>
                <a href="#" className='hover:text-white cursor-pointer'>Terms & Privacy</a>
            </div>

            <div className='text-slate-400 text-sm font-bold py-1'>
                <a>&copy; {year} GameLedger</a>
            </div>

        </div>

    )
}

export default Footer