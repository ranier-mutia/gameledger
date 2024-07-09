import React, { useState, useEffect, useRef } from 'react'

const StoryLine = (props) => {

    const [isStoryShown, setIsStoryShown] = useState(false);
    const [isOverFlowing, setIsOverflowing] = useState(false);
    const storyRef = useRef();

    const readMoreHandler = () => {
        setIsStoryShown(!isStoryShown);
    }

    useEffect(() => {

        if (storyRef.current.clientHeight < storyRef.current.scrollHeight) {
            setIsOverflowing(true);
        }

    }, [])

    return (
        <div className='mb-6'>

            <h1 className='text-lg drop-shadow-lg text-slate-200 cursor-default mb-1'>Storyline</h1>
            <div className='w-20 h-[0.1rem] bg-blue-400 rounded-xl mb-4'></div>

            <div className={`text-slate-400 overflow-hidden ${isStoryShown ? null : 'max-h-36'}`} ref={storyRef}>{props.storyline}</div>
            {isOverFlowing && <span className='text-blue-400 hover:text-blue-500 cursor-pointer' onClick={readMoreHandler} >{isStoryShown ? 'Hide' : 'Read More'}</span>}
        </div>
    )
}

export default StoryLine