import React from 'react'
import { useNavigate } from 'react-router-dom';

const UserCard = (props) => {

    const navigate = useNavigate();

    if (props.isLoading) {
        return (

            <div className='relative bg-gray-800 border-slate-900 shadow-2xl rounded-xl w-full sm:w-60 xl:w-full animate-pulse'>
                <div className="h-40 sm:h-60"></div>
                <div className="p-2 min-h-[3.5rem] me-3 space-y-3">
                    <div className='flex space-x-3'>
                        <div className="h-2 bg-slate-700 rounded basis-3/4"></div>
                        <div className="h-2 bg-slate-700 rounded basis-1/4"></div>
                    </div>
                    <div className="h-2 bg-slate-700 rounded"></div>
                </div>

            </div>
        )

    } else {
        return (
            <div className='flex bg-gray-800 h-24 hover:bg-black shadow-2xl border-slate-900 rounded-xl cursor-pointer w-full ' onClick={() => navigate("/user/" + props.username, { state: { id: props.id } })}>
                <input type="hidden" id="userID" name='userID' value={props.id} />

                <div className='h-full aspect-square p-4'>
                    <img className="object-cover h-full w-full rounded-full " src={props.img} alt={props.username} onError={(e) => {
                        e.currentTarget.onerror = null; // Prevents infinite loops if default image is also missing
                        e.currentTarget.src = '/profile_pictures/default.png';
                    }} />
                </div>

                <div className='flex-col h-auto w-full space-y-3 content-center sm:min-w-40 '>
                    <div className='flex text-left min-h-4 text-slate-200 pt-1 ms-2 text-xs sm:text-sm xl:text-base'>{props.username || ""}</div>


                    <div className="flex text-left min-h-4 text-blue-300 text-xs space-x-2 font-medium xl:hidden">
                        {props.topGenres?.slice(0, 1).map((item, i) => (
                             <span className={`${item.name && "bg-blue-950 px-2 rounded-md"}`} key={i}>{item.name}</span>
                        ))}
                    </div>

                    <div className='text-left min-h-4 text-blue-300 text-xs space-x-2 font-medium hidden xl:flex'>
                        {props.topGenres?.map((item, i) => (
                            <span className={`${item.name && "bg-blue-950 px-2 rounded-md"}`} key={i}>{item.name}</span>
                        ))}
                    </div>

                </div>

                <div className='flex h-full items-center p-3'>
                    {props.followID ?
                        <button type='button' className="text-xs xl:text-base bg-slate-700 text-slate-200 hover:bg-red-900/50 hover:text-red-400 z-10 w-full h-8 xl:h-10 select-none shadow-sm focus:outline-none py-1 px-3 xl:px-5 font-medium rounded-lg items-center flex space-x-2" onClick={(e) => props.onFollowClickHandler(e, props.id, props.followID)}>
                            <div>Following</div>
                        </button>
                        :
                        <button type='button' className="text-xs xl:text-base z-10 w-full h-8 xl:h-10 select-none shadow-sm bg-blue-500 hover:bg-blue-700 focus:outline-none py-1 px-3 xl:px-5 font-medium rounded-lg text-white items-center flex" onClick={(e) => props.onFollowClickHandler(e, props.id, props.followID)}>
                            <div>Follow</div>
                        </button>
                    }
                </div>



            </div>
        )
    }

}

export default UserCard