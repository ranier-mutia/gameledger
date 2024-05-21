import React from 'react'

const Search = (props) => {
    return (
        <form className='xl:flex justify-center basis-10/12 hidden xl:visible'>
            <div className="relative basis-4/12">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none w-full">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" ><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input type="text" name="search" className="text-gray-200 w-full bg-gray-700 border-gray-600 rounded-full ps-10 px-5 py-1 focus:ring-blue-500 focus:outline-none focus:ring-1 hover:ring-blue-400 hover:outline-none hover:ring-1" placeholder="Search" />
            </div>
        </form>

    )
}

export default Search