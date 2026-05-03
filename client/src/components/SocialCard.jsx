import React from 'react'


const SocialCard = (props) => {

    if (!props.isLoading) {
        return (
            <div className={`h-20 bg-gray-800 hover:bg-black shadow-2xl border-slate-900 rounded-xl cursor-pointer w-full group`} onClick={() => props.onSocialClickHandler(props.social.username, props.social.user_id)}>

                <div className="flex h-full w-full justify-between p-2">
                    <div>
                        {(props.social.profile_picture && <img className="object-fill h-full w-20 rounded-lg group-hover:opacity-75" src={`/profile_pictures/${props.social.profile_picture}.png`} alt="profile_picture" draggable="false" />)}
                    </div>
                    <div className='w-full text-slate-200 py-2 px-3'>
                        {props.social.username}
                    </div>
                </div>

            </div>
        )
    } else {
        return <div className={`h-24 bg-gray-800 shadow-2xl border-slate-900 rounded-xl w-full animate-pulse`}></div>
    }



}

export default SocialCard