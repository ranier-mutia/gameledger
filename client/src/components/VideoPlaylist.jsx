import React, { useState, useEffect } from 'react'

const VideoPlaylist = (props) => {

    const [video, setVideo] = useState([])

    const onClickHandler = (e) => {
        setVideo(e.target.id)
    }

    useEffect(() => {

        setVideo(props.videos && props.videos[0].video_id);

    }, [props.videos]);

    return (
        <div className='flex flex-col h-auto aspect-video sm:flex-row mb-4'>
            {video && <iframe key={video} className='w-full h-60 sm:h-auto' src={`https://www.youtube.com/embed/` + video} allowFullScreen></iframe>}

            {props.videos.length > 1 ? <div className='flex bg-gray-800  overflow-x-auto sm:overflow-y-auto sm:flex-col'>
                {props.videos.map(item => {
                    return (<img key={item.video_id} id={item.video_id} className={`w-32 sm:w-full h-20 sm:h-24 p-0.5  ${video == item.video_id ? 'bg-blue-400 opacity-100' : 'opacity-50'}`} src={`https://img.youtube.com/vi/` + item.video_id + `/hqdefault.jpg`} onClick={onClickHandler} />)
                })}
            </div> : null}
        </div>
    )
}

export default VideoPlaylist