import React from 'react'
import Dropdown from '../components/Dropdown'
import Card from '../components/Card'
import Strip from '../components/Strip'

const Home = () => {

    const cardNum = [1, 2, 3, 4, 5, 6];
    const stripNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    return (
        <div className='px-8 py-2'>
            <div className="flex justify-items-start space-x-5">
                <Dropdown name="platform" label="Platform" />
                <Dropdown name="genre" label="Genre" />
            </div >

            <div>
                <div className="flex justify-between mt-6">
                    <button className='text-xl font-semibold drop-shadow-lg'>Popular</button>
                    <button className='text-xs font-semibold drop-shadow-lg'>View All</button>
                </div>

                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-10 mt-4'>
                    {cardNum.map((cards) => {
                        return (
                            <Card key={cards} title="Game Title" />
                        )
                    })}
                </div>
            </div>

            <div>
                <div className="flex justify-between mt-6">
                    <button className='text-xl font-semibold drop-shadow-lg'>New</button>
                    <button className='text-xs font-semibold drop-shadow-lg'>View All</button>
                </div>

                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-10 mt-4'>
                    {cardNum.map((cards) => {
                        return (
                            <Card key={cards} title="Game Title" />
                        )
                    })}
                </div>
            </div>

            <div>
                <div className="flex justify-between mt-6">
                    <button className='text-xl font-semibold drop-shadow-lg'>Upcoming</button>
                    <button className='text-xs font-semibold drop-shadow-lg'>View All</button>
                </div>

                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-10 mt-4'>
                    {cardNum.map((cards) => {
                        return (
                            <Card key={cards} title="Game Title" />
                        )
                    })}
                </div>
            </div>

            <div>
                <div className="flex justify-between mt-6">
                    <button className='text-xl font-semibold drop-shadow-lg'>Free</button>
                    <button className='text-xs font-semibold drop-shadow-lg'>View All</button>
                </div>

                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-10 mt-4'>
                    {cardNum.map((cards) => {
                        return (
                            <Card key={cards} title="Game Title" />
                        )
                    })}
                </div>
            </div>


            <div>
                <div className="flex justify-between mt-6">
                    <button className='text-xl font-semibold drop-shadow-lg'>Best</button>
                    <button className='text-xs font-semibold drop-shadow-lg'>View All</button>
                </div>

                <div className='flex-col mt-4 space-y-6'>
                    {stripNum.map((strips, i) => {
                        return (
                            <Strip key={strips} title="Game Title" rank={i + 1} />
                        )
                    })}
                </div>
            </div>





        </div>



    )
}

export default Home